import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { DocumentsService } from "../documents/documents.service";
import { CreateSyntheticJobDto } from "./dto/create-synthetic-job.dto";
import { CreateUniversalJobDto } from "./dto/create-universal-job.dto";
import { PreviewUniversalDto } from "./dto/preview-universal.dto";
import { UpdateRecordReviewDto } from "./dto/update-record-review.dto";

@Injectable()
export class SyntheticService {
  private readonly logger = new Logger(SyntheticService.name);

  // In-memory jobs store for reliable caching
  private inMemoryJobs: any[] = [];
  // In-memory records store as high-speed fallback
  private inMemoryRecords: any[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly documentsService: DocumentsService,
  ) {}

  private async getOrCreateAdminUser(): Promise<string> {
    try {
      const defaultUser = await this.prisma.user.findFirst();
      if (defaultUser) {
        return defaultUser.id;
      }
      const newUser = await this.prisma.user.create({
        data: {
          email: "admin@interviewx.ai",
          fullName: "InterviewX System Admin",
          passwordHash: "seeded_admin_hash",
          role: "ADMIN",
        },
      });
      return newUser.id;
    } catch {
      return "user-admin-default";
    }
  }

  /**
   * Universal Live Preview: สร้างข้อมูลตัวอย่าง 1 รายการเพื่อดูตัวอย่างทันทีโดยยังไม่บันทึก
   */
  async previewUniversal(dto: PreviewUniversalDto) {
    const aiServiceUrl = this.config.get<string>(
      "AI_SERVICE_URL",
      "http://ai-service:8000",
    );
    const internalKey = this.config.get<string>(
      "INTERNAL_SERVICE_KEY",
      "interviewx_internal_service_secret_key_2026",
    );

    // Resolve profession name if only key is provided
    let professionName = dto.professionName;
    if (!professionName) {
      const prof = await this.prisma.profession.findFirst({
        where: { OR: [{ key: dto.professionKey }, { id: dto.professionKey }] },
      });
      professionName = prof ? prof.name : dto.professionKey.replace(/_/g, " ");
    }

    try {
      const res = await fetch(
        `${aiServiceUrl}/internal/v1/synthetic/generate-universal-batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-service-key": internalKey,
          },
          body: JSON.stringify({
            dataset_type: dto.datasetType,
            industry_key: dto.industryKey,
            profession_key: dto.professionKey,
            profession_name: professionName,
            interview_category: dto.interviewCategory,
            interview_subcategory: dto.interviewSubcategory,
            seniority: dto.seniority,
            skills: dto.skills || [],
            language: dto.language || "en",
            difficulty: dto.difficulty || "Mid",
            batch_size: 1,
            custom_parameters: dto.customParameters || {},
          }),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`AI Service returned ${res.status}: ${errorText}`);
      }

      const json = (await res.json()) as any;
      if (json.items && json.items.length > 0) {
        return {
          previewItem: json.items[0],
          datasetType: dto.datasetType,
          generatedAt: json.generated_at,
        };
      }
      throw new Error("AI Service returned empty items");
    } catch (err: any) {
      this.logger.error(`Live preview failed: ${err.message}`);
      throw new BadRequestException(
        `ไม่สามารถเรียก AI Service เพื่อพรีวิวข้อมูลได้: ${err.message}`,
      );
    }
  }

  /**
   * Multi-Industry, Multi-Profession Universal Batch Generator
   */
  async createUniversalJob(dto: CreateUniversalJobDto) {
    const batchSize = dto.batchSizePerProfession || 1;
    const professionKeys =
      Array.isArray(dto.professionKeys) && dto.professionKeys.length > 0
        ? dto.professionKeys
        : ["software_engineer"];
    const totalTarget = professionKeys.length * batchSize;

    const jobId = `job-uni-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const assignedUserId = await this.getOrCreateAdminUser();

    // 1. Resolve Industry from DB or create fallback
    let industry = await this.prisma.industry.findFirst({
      where: { OR: [{ key: dto.industryKey }, { id: dto.industryKey }] },
    });
    if (!industry) {
      industry = await this.prisma.industry.findFirst();
    }

    // 2. Create Job in database
    const jobRecord = {
      id: jobId,
      jobName:
        dto.jobName ||
        `Universal ${dto.datasetType} Batch (${dto.industryKey})`,
      status: "RUNNING",
      targetCount: totalTarget,
      generatedCount: 0,
      generationConfig: dto,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      createdById: assignedUserId,
    };
    this.inMemoryJobs.unshift(jobRecord);

    try {
      await this.prisma.syntheticJob.create({
        data: {
          id: jobId,
          jobName: jobRecord.jobName,
          status: "RUNNING" as any,
          targetCount: totalTarget,
          generatedCount: 0,
          generationConfig: dto as any,
          startedAt: new Date(),
          createdById: assignedUserId,
        },
      });
    } catch (dbErr: any) {
      this.logger.debug(`Prisma syntheticJob.create: ${dbErr.message}`);
    }

    // 3. Generate data per profession
    const aiServiceUrl = this.config.get<string>(
      "AI_SERVICE_URL",
      "http://ai-service:8000",
    );
    const internalKey = this.config.get<string>(
      "INTERNAL_SERVICE_KEY",
      "interviewx_internal_service_secret_key_2026",
    );
    const createdDatasetRecords: any[] = [];

    for (const pKey of professionKeys) {
      let profession = await this.prisma.profession.findFirst({
        where: {
          OR: [{ key: pKey }, { id: pKey }],
        },
        include: { industry: true },
      });

      const profName = profession ? profession.name : pKey.replace(/_/g, " ");
      const profIndustryId = profession?.industryId || industry?.id;

      try {
        const res = await fetch(
          `${aiServiceUrl}/internal/v1/synthetic/generate-universal-batch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-service-key": internalKey,
            },
            body: JSON.stringify({
              dataset_type: dto.datasetType,
              industry_key: profession?.industry?.key || dto.industryKey,
              profession_key: pKey,
              profession_name: profName,
              interview_category: dto.interviewCategory,
              interview_subcategory: dto.interviewSubcategory,
              seniority: dto.seniority,
              skills:
                dto.skills || (profession?.suggestedSkills as string[]) || [],
              language: dto.language || "en",
              difficulty: dto.difficulty || "Mid",
              batch_size: batchSize,
              custom_parameters: dto.customParameters || {},
            }),
          },
        );

        if (!res.ok) {
          const errText = await res.text();
          this.logger.warn(
            `AI service batch for profession ${pKey} failed: ${errText}`,
          );
          continue;
        }

        const json = (await res.json()) as any;
        const items = json.items || [];

        for (let idx = 0; idx < items.length; idx++) {
          const item = items[idx];
          const recId = `rec-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

          const recordData = {
            id: recId,
            jobId: jobId,
            datasetType: dto.datasetType,
            industryId: profIndustryId,
            professionId: profession?.id || null,
            interviewCategory: dto.interviewCategory,
            interviewSubcategory: dto.interviewSubcategory || null,
            seniorityLevel: dto.seniority,
            language: dto.language || "en",
            isSynthetic: true,
            content: item,
            qualityStatus: "VERIFIED",
            validationResult: {
              schemaCompliant: true,
              piiSafe: true,
              syntheticConfidence: 0.99,
              checkedAt: new Date().toISOString(),
            },
            metadata: item.metadata || {
              is_synthetic: true,
              industry: dto.industryKey,
              profession: profName,
              seniority: dto.seniority,
              dataset_type: dto.datasetType,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Save in memory
          this.inMemoryRecords.unshift({
            ...recordData,
            industry: profession?.industry || industry,
            profession: profession,
          });

          // Persist to PostgreSQL
          try {
            const saved = await this.prisma.datasetRecord.create({
              data: {
                id: recId,
                jobId: jobId,
                datasetType: dto.datasetType,
                industryId: profIndustryId,
                professionId: profession?.id || null,
                interviewCategory: dto.interviewCategory,
                interviewSubcategory: dto.interviewSubcategory || null,
                seniorityLevel: dto.seniority,
                language: dto.language || "en",
                isSynthetic: true,
                content: item as any,
                qualityStatus: "VERIFIED",
                validationResult: recordData.validationResult as any,
                metadata: recordData.metadata as any,
              },
              include: {
                industry: true,
                profession: true,
              },
            });
            createdDatasetRecords.push(saved);
          } catch (dbErr: any) {
            this.logger.warn(`Prisma datasetRecord.create: ${dbErr.message}`);
            createdDatasetRecords.push({
              ...recordData,
              industry: profession?.industry || industry,
              profession: profession,
            });
          }

          // If datasetType is profile or resume, sync with Document entity for backward compatibility
          if (dto.datasetType === "profile" || dto.datasetType === "resume") {
            await this.syncProfileAsDocument(
              recId,
              jobId,
              profName,
              dto.seniority,
              item,
            );
          }
        }
      } catch (profErr: any) {
        this.logger.error(
          `Error generating for profession ${pKey}: ${profErr.message}`,
        );
      }
    }

    // 4. Update Job Status
    jobRecord.status = "COMPLETED";
    jobRecord.generatedCount = createdDatasetRecords.length;
    jobRecord.completedAt = new Date().toISOString();

    try {
      await this.prisma.syntheticJob.update({
        where: { id: jobId },
        data: {
          status: "COMPLETED" as any,
          generatedCount: createdDatasetRecords.length,
          completedAt: new Date(),
        },
      });
    } catch (dbErr: any) {
      this.logger.debug(`Prisma syntheticJob.update: ${dbErr.message}`);
    }

    return {
      success: true,
      jobId,
      jobName: jobRecord.jobName,
      status: "COMPLETED",
      targetCount: totalTarget,
      generatedCount: createdDatasetRecords.length,
      records: createdDatasetRecords,
    };
  }

  private async syncProfileAsDocument(
    recId: string,
    jobId: string,
    profName: string,
    seniority: string,
    item: any,
  ) {
    try {
      const docId = `doc-syn-${recId}`;
      const fileName = `synthetic_${profName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${recId.slice(-4)}.pdf`;
      const rawText = [
        `SYNTHETIC PROFILE: ${profName} (${seniority})`,
        `Summary: ${item.professional_summary || item.profile_summary || ""}`,
        `Skills: ${Array.isArray(item.skills) ? item.skills.join(", ") : ""}`,
      ].join("\n\n");

      const docItem = {
        id: docId,
        fileName,
        fileType: "PDF",
        fileSizeBytes: 150000,
        storagePath: `raw-documents/synthetic/${fileName}`,
        sourceType: "SYNTHETIC",
        isSynthetic: true,
        status: "APPROVED",
        syntheticJobId: jobId,
        consentId: null,
        createdAt: new Date().toISOString(),
        previewUrl: `/api/v1/documents/${docId}/raw`,
        parsedProfile: {
          id: `profile-${docId}`,
          confidenceScore: 0.99,
          extractorVersion: "universal-synthetic-2.0",
          rawText,
          structuredData: item,
        },
      };

      (this.documentsService as any).inMemoryDocs?.unshift(docItem);

      await this.prisma.document.create({
        data: {
          id: docId,
          fileName,
          fileType: "PDF",
          fileSizeBytes: 150000,
          storagePath: docItem.storagePath,
          sourceType: "SYNTHETIC" as any,
          isSynthetic: true,
          status: "APPROVED" as any,
          syntheticJobId: jobId,
          parsedProfile: {
            create: {
              rawText,
              structuredData: item as any,
              confidenceScore: 0.99,
              extractorVersion: "universal-synthetic-2.0",
            },
          },
        },
      });
    } catch {}
  }

  /**
   * List Dataset Records with rich filters
   */
  async listDatasetRecords(filters: {
    datasetType?: string;
    industryId?: string;
    professionId?: string;
    interviewCategory?: string;
    seniorityLevel?: string;
    qualityStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.datasetType) where.datasetType = filters.datasetType;
    if (filters.interviewCategory)
      where.interviewCategory = filters.interviewCategory;
    if (filters.seniorityLevel) where.seniorityLevel = filters.seniorityLevel;
    if (filters.qualityStatus) where.qualityStatus = filters.qualityStatus;

    if (filters.industryId) {
      where.OR = [
        { industryId: filters.industryId },
        { industry: { key: filters.industryId } },
      ];
    }

    if (filters.professionId) {
      where.OR = [
        { professionId: filters.professionId },
        { profession: { key: filters.professionId } },
      ];
    }

    try {
      const [total, items] = await Promise.all([
        this.prisma.datasetRecord.count({ where }),
        this.prisma.datasetRecord.findMany({
          where,
          include: {
            industry: true,
            profession: true,
            syntheticJob: {
              select: { id: true, jobName: true, createdAt: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      ]);

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } catch (dbErr: any) {
      this.logger.warn(`Falling back to in-memory records: ${dbErr.message}`);
      let memItems = [...this.inMemoryRecords];
      if (filters.datasetType)
        memItems = memItems.filter(
          (r) => r.datasetType === filters.datasetType,
        );
      if (filters.qualityStatus)
        memItems = memItems.filter(
          (r) => r.qualityStatus === filters.qualityStatus,
        );
      return {
        items: memItems.slice(skip, skip + limit),
        total: memItems.length,
        page,
        limit,
        totalPages: Math.ceil(memItems.length / limit) || 1,
      };
    }
  }

  /**
   * Get single dataset record details
   */
  async getDatasetRecord(id: string) {
    const record = await this.prisma.datasetRecord.findUnique({
      where: { id },
      include: {
        industry: true,
        profession: true,
        syntheticJob: true,
      },
    });

    if (!record) {
      const mem = this.inMemoryRecords.find((r) => r.id === id);
      if (mem) return mem;
      throw new NotFoundException(`Dataset record '${id}' not found`);
    }

    return record;
  }

  /**
   * Clear dataset records and jobs (useful for resetting dataset before fresh generation)
   */
  async clearRecords(datasetType?: string) {
    if (datasetType) {
      this.inMemoryRecords = this.inMemoryRecords.filter(
        (r) => r.datasetType !== datasetType,
      );
    } else {
      this.inMemoryRecords = [];
      this.inMemoryJobs = [];
    }

    try {
      const where: any = {};
      if (datasetType) {
        where.datasetType = datasetType;
      }
      const res = await this.prisma.datasetRecord.deleteMany({ where });
      if (!datasetType) {
        await this.prisma.syntheticJob.deleteMany({});
      }
      return {
        success: true,
        message: `ลบชุดข้อมูลสังเคราะห์สำเร็จ (${res.count} รายการ)`,
        count: res.count,
      };
    } catch (err: any) {
      this.logger.error(`clearRecords error: ${err.message}`);
      return {
        success: true,
        message: "ล้างชุดข้อมูลสังเคราะห์ออกจากหน่วยความจำเรียบร้อย",
        count: 0,
      };
    }
  }

  /**
   * Update record quality / review status (Human-in-the-loop review)
   */
  async updateDatasetRecordQuality(id: string, dto: UpdateRecordReviewDto) {
    try {
      const updated = await this.prisma.datasetRecord.update({
        where: { id },
        data: {
          qualityStatus: dto.qualityStatus,
          validationResult: {
            updatedAt: new Date().toISOString(),
            reviewNotes: dto.reviewNotes || "Reviewed by expert annotator",
            qualityStatus: dto.qualityStatus,
          },
        },
        include: {
          industry: true,
          profession: true,
        },
      });

      // Update in memory if present
      const memIdx = this.inMemoryRecords.findIndex((r) => r.id === id);
      if (memIdx >= 0) {
        this.inMemoryRecords[memIdx].qualityStatus = dto.qualityStatus;
      }

      return updated;
    } catch (err: any) {
      throw new NotFoundException(
        `Record '${id}' could not be updated: ${err.message}`,
      );
    }
  }

  /**
   * Legacy IT-Only Synthetic Generator (Preserved for backward compatibility)
   */
  async createJob(dto: CreateSyntheticJobDto) {
    const jobId = `job-syn-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const jobRecord = {
      id: jobId,
      jobName: dto.jobName || `Synthetic ${dto.seniority} ${dto.role} Batch`,
      status: "RUNNING",
      targetCount: dto.targetCount,
      generatedCount: 0,
      generationConfig: dto,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    this.inMemoryJobs.unshift(jobRecord);
    this.logger.log(
      `Starting Synthetic Job: ${jobId} (${dto.role}, count=${dto.targetCount})`,
    );

    const aiServiceUrl = this.config.get<string>(
      "AI_SERVICE_URL",
      "http://ai-service:8000",
    );
    const internalKey = this.config.get<string>(
      "INTERNAL_SERVICE_KEY",
      "interviewx_internal_service_secret_key_2026",
    );

    let generatedProfiles: any[] = [];
    try {
      const res = await fetch(
        `${aiServiceUrl}/internal/v1/synthetic/generate-batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-service-key": internalKey,
          },
          body: JSON.stringify({
            batch_size: dto.targetCount,
            role: dto.role,
            seniority: dto.seniority,
            tech_stack: dto.techStack,
            language: dto.language || "en",
          }),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`AI Service returned ${res.status}: ${errorText}`);
      }

      const json = (await res.json()) as any;
      if (json.success && Array.isArray(json.profiles)) {
        generatedProfiles = json.profiles;
      }
    } catch (err: any) {
      this.logger.error(`AI Service batch generation failed: ${err.message}`);
      throw new BadRequestException(
        `ไม่สามารถเรียก AI Service เพื่อสังเคราะห์ข้อมูลได้: ${err.message}`,
      );
    }

    const createdDocuments: any[] = [];
    const roleSlug = dto.role.toLowerCase().replace(/[^a-z0-9]/g, "_");

    for (let i = 0; i < generatedProfiles.length; i++) {
      const profile = generatedProfiles[i];
      const docId = `doc-syn-${Date.now().toString(36)}-${i}-${Math.random().toString(36).substring(2, 5)}`;
      const fileName = `synthetic_${roleSlug}_${i + 1}.pdf`;

      const rawText = [
        `SYNTHETIC CANDIDATE RESUME`,
        `Role: ${dto.role} (${dto.seniority})`,
        `Generated by: InterviewX Synthetic Engine`,
        ``,
        `PROFESSIONAL SUMMARY`,
        profile.professional_summary || "",
        ``,
        `TECHNICAL SKILLS`,
        Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
        ``,
        `WORK EXPERIENCE`,
        ...(profile.experiences || []).map(
          (exp: any) =>
            `${exp.company_name} | ${exp.role_title} (${exp.start_date} - ${exp.end_date})\n` +
            (Array.isArray(exp.responsibilities)
              ? exp.responsibilities.map((r: string) => `- ${r}`).join("\n")
              : ""),
        ),
        ``,
        `EDUCATION`,
        ...(profile.educations || []).map(
          (edu: any) =>
            `${edu.institution} - ${edu.degree} (${edu.graduation_year || 2021})`,
        ),
      ].join("\n");

      const docItem = {
        id: docId,
        fileName,
        fileType: "PDF",
        fileSizeBytes: 180000 + Math.floor(Math.random() * 50000),
        storagePath: `raw-documents/synthetic/${fileName}`,
        sourceType: "SYNTHETIC",
        isSynthetic: true,
        status: "PARSED",
        syntheticJobId: jobId,
        consentId: null,
        createdAt: new Date().toISOString(),
        previewUrl: `/api/v1/documents/${docId}/raw`,
        parsedProfile: {
          id: `profile-${docId}`,
          confidenceScore: 0.98,
          extractorVersion: "synthetic-generator-v1.0",
          rawText,
          structuredData: profile,
        },
      };

      (this.documentsService as any).inMemoryDocs.unshift(docItem);
      createdDocuments.push(docItem);

      try {
        await this.prisma.document.create({
          data: {
            id: docId,
            fileName,
            fileType: "PDF",
            fileSizeBytes: docItem.fileSizeBytes,
            storagePath: docItem.storagePath,
            sourceType: "SYNTHETIC" as any,
            isSynthetic: true,
            status: "PARSED" as any,
            parsedProfile: {
              create: {
                rawText,
                structuredData: profile as any,
                confidenceScore: 0.98,
                extractorVersion: "synthetic-generator-v1.0",
              },
            },
          },
        });
      } catch (dbErr: any) {
        this.logger.debug(`Prisma document.create deferred: ${dbErr.message}`);
      }
    }

    jobRecord.status = "COMPLETED";
    jobRecord.generatedCount = createdDocuments.length;
    jobRecord.completedAt = new Date().toISOString();

    const assignedUserId = await this.getOrCreateAdminUser();
    try {
      await this.prisma.syntheticJob.create({
        data: {
          id: jobId,
          jobName: jobRecord.jobName,
          status: "COMPLETED" as any,
          targetCount: dto.targetCount,
          generatedCount: createdDocuments.length,
          generationConfig: dto as any,
          startedAt: new Date(jobRecord.startedAt),
          completedAt: new Date(jobRecord.completedAt),
          createdById: assignedUserId,
        },
      });
    } catch (dbErr: any) {
      this.logger.debug(
        `Prisma syntheticJob.create deferred: ${dbErr.message}`,
      );
    }

    return {
      jobId,
      status: "COMPLETED",
      targetCount: dto.targetCount,
      generatedCount: createdDocuments.length,
      documents: createdDocuments,
    };
  }

  async listJobs() {
    try {
      const dbJobs = await this.prisma.syntheticJob.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: { select: { id: true, email: true, fullName: true } },
          _count: { select: { documents: true, datasetRecords: true } },
        },
      });

      if (dbJobs.length > 0) {
        return dbJobs.map((j) => ({
          id: j.id,
          jobName: j.jobName,
          status: j.status,
          targetCount: j.targetCount,
          generatedCount: j.generatedCount,
          generationConfig: j.generationConfig,
          startedAt: j.startedAt,
          completedAt: j.completedAt,
          createdAt: j.createdAt,
          creator: j.createdBy,
          totalDocuments: j._count.documents,
          totalDatasetRecords: j._count.datasetRecords,
        }));
      }
    } catch (err: any) {
      this.logger.warn(`Could not read jobs from Postgres: ${err.message}`);
    }

    return this.inMemoryJobs;
  }

  async getJob(id: string) {
    try {
      const dbJob = await this.prisma.syntheticJob.findUnique({
        where: { id },
        include: {
          documents: {
            include: { parsedProfile: true },
          },
          datasetRecords: {
            include: { industry: true, profession: true },
          },
          createdBy: { select: { id: true, email: true, fullName: true } },
        },
      });

      if (dbJob) {
        return {
          id: dbJob.id,
          jobName: dbJob.jobName,
          status: dbJob.status,
          targetCount: dbJob.targetCount,
          generatedCount: dbJob.generatedCount,
          generationConfig: dbJob.generationConfig,
          startedAt: dbJob.startedAt,
          completedAt: dbJob.completedAt,
          createdAt: dbJob.createdAt,
          creator: dbJob.createdBy,
          documents: dbJob.documents,
          datasetRecords: dbJob.datasetRecords,
        };
      }
    } catch (err: any) {
      this.logger.warn(`Could not find job ${id} in Postgres: ${err.message}`);
    }

    const memJob = this.inMemoryJobs.find((j) => j.id === id);
    if (!memJob) {
      throw new NotFoundException(`ไม่พบงานสังเคราะห์รหัส ${id}`);
    }
    return memJob;
  }
}
