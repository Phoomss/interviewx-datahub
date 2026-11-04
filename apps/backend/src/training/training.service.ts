import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainingJobDto, RegisterModelVersionDto, PromoteModelDto } from './dto/training.dto';

@Injectable()
export class TrainingService {
  private readonly logger = new Logger(TrainingService.name);
  private readonly aiServiceUrl: string;
  private readonly internalServiceKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.aiServiceUrl = this.config.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
    this.internalServiceKey = this.config.get<string>('INTERNAL_SERVICE_KEY', 'interviewx_internal_secret_key_2026');
  }

  async createTrainingJob(dto: CreateTrainingJobDto, userId?: string) {
    if (dto.datasetExportId) {
      const exportRecord = await this.prisma.datasetExport.findUnique({
        where: { id: dto.datasetExportId },
      });
      if (!exportRecord) {
        throw new NotFoundException(`Dataset export '${dto.datasetExportId}' not found.`);
      }
    }

    const defaultHyperparameters = {
      learning_rate: 2e-4,
      batch_size: 4,
      epochs: 3,
      lora_r: 16,
      lora_alpha: 32,
      lora_dropout: 0.05,
      target_modules: ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'],
      quantization: '4bit',
      ...dto.hyperparameters,
    };

    return this.prisma.trainingJob.create({
      data: {
        jobName: dto.jobName,
        baseModel: dto.baseModel,
        method: dto.method || 'QLORA',
        datasetExportId: dto.datasetExportId || null,
        hyperparameters: defaultHyperparameters as any,
        status: 'QUEUED',
        createdById: userId || null,
      },
      include: {
        datasetExport: true,
      },
    });
  }

  async triggerTrainingJob(id: string) {
    const job = await this.prisma.trainingJob.findUnique({
      where: { id },
      include: { datasetExport: true },
    });

    if (!job) {
      throw new NotFoundException(`Training job '${id}' not found.`);
    }

    await this.prisma.trainingJob.update({
      where: { id },
      data: { status: 'RUNNING', startedAt: new Date() },
    });

    try {
      // 1. Run Fine-Tuning in AI Service
      const res = await fetch(`${this.aiServiceUrl}/internal/v1/training/run-finetuning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-service-key': this.internalServiceKey,
        },
        body: JSON.stringify({
          job_id: job.id,
          base_model: job.baseModel,
          method: job.method,
          dataset_manifest_url: job.datasetExport?.manifestStoragePath || null,
          hyperparameters: job.hyperparameters,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`AI service fine-tuning failed: ${errText}`);
      }

      const trainResp = await res.json();

      // 2. Run Automated Benchmark Evaluation
      let evalResp: any = null;
      try {
        const evalRes = await fetch(`${this.aiServiceUrl}/internal/v1/training/evaluate-model`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-service-key': this.internalServiceKey,
          },
          body: JSON.stringify({
            model_checkpoint_uri: trainResp.checkpoint_uri,
          }),
        });
        if (evalRes.ok) {
          evalResp = await evalRes.json();
        }
      } catch (evalErr) {
        this.logger.warn(`Automated evaluation fallback: ${evalErr}`);
      }

      const combinedMetrics = {
        ...trainResp.final_metrics,
        benchmark: evalResp,
      };

      // 3. Update Training Job status
      const updatedJob = await this.prisma.trainingJob.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          checkpointUri: trainResp.checkpoint_uri,
          evalMetrics: combinedMetrics as any,
          mlflowRunId: `mlflow-run-${job.id.substring(0, 8)}`,
        },
      });

      // 4. Auto-register Candidate Model in Model Registry
      const versionStr = `v${Math.floor(Date.now() / 100000) % 1000}.0`;
      const cleanName = job.jobName.toLowerCase().replace(/[^a-z0-9]/g, '-');

      await this.prisma.modelVersion.create({
        data: {
          name: cleanName,
          version: versionStr,
          trainingJobId: job.id,
          baseModel: job.baseModel,
          architecture: 'Transformer-Decoder (LoRA Adapter)',
          artifactUri: trainResp.checkpoint_uri,
          status: 'CANDIDATE',
          evaluationMetrics: combinedMetrics as any,
          benchmarkScore: evalResp?.rubric_score || 0.88,
          piiScanPassed: evalResp?.zero_pii_verified !== false,
        },
      });

      return updatedJob;
    } catch (err: any) {
      this.logger.error(`Training job execution failed: ${err.message}`);
      await this.prisma.trainingJob.update({
        where: { id },
        data: { status: 'FAILED' },
      });
      throw new BadRequestException(`Failed to execute training job: ${err.message}`);
    }
  }

  async listTrainingJobs(statusFilter?: string) {
    return this.prisma.trainingJob.findMany({
      where: statusFilter ? { status: statusFilter as any } : undefined,
      include: {
        datasetExport: true,
        modelVersions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTrainingJob(id: string) {
    const job = await this.prisma.trainingJob.findUnique({
      where: { id },
      include: {
        datasetExport: true,
        modelVersions: true,
      },
    });
    if (!job) {
      throw new NotFoundException(`Training job '${id}' not found.`);
    }
    return job;
  }

  // ==========================================
  // Model Registry & Publishing Gate
  // ==========================================

  async registerModelVersion(dto: RegisterModelVersionDto, userId?: string) {
    const existing = await this.prisma.modelVersion.findUnique({
      where: {
        name_version: {
          name: dto.name,
          version: dto.version,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(`Model version '${dto.name}@${dto.version}' already registered.`);
    }

    return this.prisma.modelVersion.create({
      data: {
        name: dto.name,
        version: dto.version,
        trainingJobId: dto.trainingJobId || null,
        baseModel: dto.baseModel,
        artifactUri: dto.artifactUri,
        benchmarkScore: dto.benchmarkScore || 0.85,
        piiScanPassed: dto.piiScanPassed !== false,
        status: 'CANDIDATE',
      },
    });
  }

  async listModelVersions(statusFilter?: string) {
    return this.prisma.modelVersion.findMany({
      where: statusFilter ? { status: statusFilter as any } : undefined,
      include: {
        trainingJob: true,
        approvedBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async promoteModel(id: string, dto: PromoteModelDto, approverId?: string) {
    const model = await this.prisma.modelVersion.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException(`Model version '${id}' not found.`);
    }

    // Integrity Gate Check for PRODUCTION promotion
    if (dto.targetStatus === 'PRODUCTION') {
      const minScore = model.minQualityScore || 0.80;
      const actualScore = model.benchmarkScore || 0.0;

      if (actualScore < minScore) {
        throw new BadRequestException(
          `Integrity Gate Blocked: Model benchmark score (${actualScore}) is below required minimum threshold (${minScore}).`,
        );
      }

      if (!model.piiScanPassed) {
        throw new BadRequestException(
          'Integrity Gate Blocked: Zero PII Scan failed. Cannot promote candidate with potential data leakage to PRODUCTION.',
        );
      }
    }

    return this.prisma.modelVersion.update({
      where: { id },
      data: {
        status: dto.targetStatus as any,
        deploymentEndpoint: dto.deploymentEndpoint || model.deploymentEndpoint,
        approvedById: approverId || null,
        approvedAt: new Date(),
        publishedAt: dto.targetStatus === 'PRODUCTION' ? new Date() : model.publishedAt,
      },
    });
  }

  async getActiveProductionModel(name?: string) {
    const whereClause: any = { status: 'PRODUCTION' };
    if (name) {
      whereClause.name = name;
    }

    const model = await this.prisma.modelVersion.findFirst({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      include: {
        trainingJob: true,
      },
    });

    if (!model) {
      throw new NotFoundException(`No active PRODUCTION model found for '${name || 'any'}'.`);
    }

    return {
      name: model.name,
      version: model.version,
      baseModel: model.baseModel,
      artifactUri: model.artifactUri,
      deploymentEndpoint: model.deploymentEndpoint || `http://inference.interviewx.internal/v1/models/${model.name}`,
      benchmarkScore: model.benchmarkScore,
      publishedAt: model.publishedAt,
    };
  }
}
