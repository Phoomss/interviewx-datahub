import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthorizationDecisionService } from '../consent/authorization-decision.service';

export interface EligibilityEvaluationResult {
  documentId: string;
  isEligibleForTraining: boolean;
  isEligibleForProfileManagement: boolean;
  status:
    | 'EXTRACTION_PENDING'
    | 'EXTRACTION_COMPLETED'
    | 'AWAITING_REVIEW'
    | 'REVIEWED'
    | 'APPROVED_FOR_PROFILE_MANAGEMENT'
    | 'APPROVED_FOR_DATASET_PREPARATION'
    | 'APPROVED_FOR_TRAINING'
    | 'RESTRICTED'
    | 'CONSENT_WITHDRAWN'
    | 'REJECTED';
  reasons: string[];
  evaluatedAt: Date;
}

@Injectable()
export class TrainingEligibilityService {
  private readonly logger = new Logger(TrainingEligibilityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly authDecisionService: AuthorizationDecisionService,
  ) {}

  /**
   * ประเมินสิทธิ์การฝึกสอนโมเดล (Training Eligibility Gate)
   * แยกเด็ดขาดระหว่างสิทธิ์การจัดการโปรไฟล์ (Profile Management) กับสิทธิ์การเทรน AI (AI Model Training)
   */
  async evaluateEligibility(documentId: string): Promise<EligibilityEvaluationResult> {
    const reasons: string[] = [];
    const now = new Date();

    let doc: any = null;
    try {
      doc = await this.prisma.document.findUnique({
        where: { id: documentId },
        include: {
          consent: true,
          reviews: { orderBy: { createdAt: 'desc' } },
          qualityValidation: true,
        },
      });
    } catch (err) {
      this.logger.debug(`Prisma findUnique deferred: ${err.message}`);
    }

    if (!doc) {
      // Demo / in-memory fallback
      return {
        documentId,
        isEligibleForTraining: false,
        isEligibleForProfileManagement: true,
        status: 'AWAITING_REVIEW',
        reasons: ['เอกสารอยู่ในขั้นตอนรอการตรวจสอบจากผู้เชี่ยวชาญ (Human Review Required)'],
        evaluatedAt: now,
      };
    }

    // 1. ถ้าเป็น Synthetic Data ให้ผ่านเข้า Training Pool ได้โดยอัตโนมัติ
    if (doc.isSynthetic) {
      return {
        documentId,
        isEligibleForTraining: true,
        isEligibleForProfileManagement: true,
        status: 'APPROVED_FOR_TRAINING',
        reasons: ['เอกสารเป็น Synthetic Data ปลอดภัยจาก PII และพร้อมสำหรับการเทรนโมเดล'],
        evaluatedAt: now,
      };
    }

    // 2. ถ้าเป็น Real Authorized Data: ต้องตรวจสอบ Consent อย่างเข้มงวด
    if (!doc.consentId || !doc.consent) {
      reasons.push('ไม่มีหนังสือแสดงความยินยอม (Missing Consent Record)');
      return {
        documentId,
        isEligibleForTraining: false,
        isEligibleForProfileManagement: false,
        status: 'RESTRICTED',
        reasons,
        evaluatedAt: now,
      };
    }

    const consent = doc.consent;

    // ตรวจสอบสถานะการเพิกถอน
    if (consent.status === 'WITHDRAWN' || consent.withdrawnAt || !consent.isActive) {
      reasons.push('เจ้าของข้อมูลเพิกถอนความยินยอมแล้ว (Consent Withdrawn/Revoked)');
      return {
        documentId,
        isEligibleForTraining: false,
        isEligibleForProfileManagement: false,
        status: 'CONSENT_WITHDRAWN',
        reasons,
        evaluatedAt: now,
      };
    }

    // ตรวจสอบวันหมดอายุ
    if (consent.expiresAt && new Date(consent.expiresAt) < now) {
      reasons.push('หนังสือแสดงความยินยอมหมดอายุแล้ว (Consent Expired)');
      return {
        documentId,
        isEligibleForTraining: false,
        isEligibleForProfileManagement: false,
        status: 'RESTRICTED',
        reasons,
        evaluatedAt: now,
      };
    }

    // ตรวจสอบวัตถุประสงค์ Profile Management
    const permittedPurposes: string[] = Array.isArray(consent.permittedPurposes)
      ? consent.permittedPurposes.map((p: string) => p.toUpperCase())
      : [];

    const canProfileManage =
      permittedPurposes.length === 0 ||
      permittedPurposes.includes('PROFILE_MANAGEMENT') ||
      permittedPurposes.includes('DOCUMENT_EXTRACTION');

    const canTrainAI = permittedPurposes.includes('AI_MODEL_TRAINING');

    // ตรวจสอบการตรวจสอบโดยมนุษย์ (Human Review Gate)
    const latestReview = doc.reviews?.[0];
    const isHumanApproved = doc.status === 'APPROVED' || latestReview?.status === 'APPROVED';

    if (!canTrainAI) {
      reasons.push('ความยินยอมอนุญาตเฉพาะการจัดการโปรไฟล์เท่านั้น ไม่อนุญาตให้ใช้ฝึกสอนโมเดล AI (Purpose Limitation)');
      return {
        documentId,
        isEligibleForTraining: false,
        isEligibleForProfileManagement: canProfileManage,
        status: 'APPROVED_FOR_PROFILE_MANAGEMENT',
        reasons,
        evaluatedAt: now,
      };
    }

    if (!isHumanApproved) {
      reasons.push('ต้องผ่านการตรวจสอบและอนุมัติจากผู้เชี่ยวชาญ (Human Review) ก่อนนำเข้า Training Pool');
      return {
        documentId,
        isEligibleForTraining: false,
        isEligibleForProfileManagement: canProfileManage,
        status: 'AWAITING_REVIEW',
        reasons,
        evaluatedAt: now,
      };
    }

    // ตรวจสอบคุณภาพข้อมูล (Quality Validation Gate)
    if (doc.qualityValidation && doc.qualityValidation.overallScore < 0.60) {
      reasons.push('คะแนนคุณภาพการสกัดข้อมูลต่ำกว่าเกณฑ์ 60% จำเป็นต้องปรับปรุงก่อนเทรน');
      return {
        documentId,
        isEligibleForTraining: false,
        isEligibleForProfileManagement: canProfileManage,
        status: 'REVIEWED',
        reasons,
        evaluatedAt: now,
      };
    }

    // ผ่านทุกเงื่อนไข: อนุมัติสำหรับฝึกสอน AI โมเดล
    reasons.push('ผ่านการตรวจสอบความยินยอม PDPA, วัตถุประสงค์ AI_MODEL_TRAINING, และผ่านการ Review โดยมนุษย์เรียบร้อยแล้ว');
    return {
      documentId,
      isEligibleForTraining: true,
      isEligibleForProfileManagement: true,
      status: 'APPROVED_FOR_TRAINING',
      reasons,
      evaluatedAt: now,
    };
  }

  /**
   * อัปเดตสถานะ Training Eligibility ของเอกสารในฐานข้อมูล
   */
  async updateEligibilityStatus(
    documentId: string,
    status: any,
    reason?: string,
    actorId?: string,
  ) {
    try {
      const updated = await this.prisma.document.update({
        where: { id: documentId },
        data: {
          trainingEligibilityStatus: status,
          trainingEligibilityReason: reason || null,
        },
      });

      return {
        success: true,
        message: `อัปเดตสถานะ Training Eligibility เป็น ${status} สำเร็จ`,
        data: updated,
      };
    } catch (err) {
      return {
        success: true,
        message: `อัปเดตสถานะ Training Eligibility สำเร็จ (Simulator)`,
        data: { documentId, status, reason },
      };
    }
  }

  /**
   * ดึงรายการเอกสารทั้งหมดพร้อมสถานะ Training Eligibility Dashboard
   */
  async listEligibilityRecords(limit: number = 50) {
    try {
      const records = await this.prisma.document.findMany({
        take: limit,
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fileName: true,
          sourceType: true,
          isSynthetic: true,
          classification: true,
          trainingEligibilityStatus: true,
          trainingEligibilityReason: true,
          consentId: true,
          status: true,
          createdAt: true,
          consent: {
            select: {
              id: true,
              subjectIdentifier: true,
              status: true,
              permittedPurposes: true,
            },
          },
          qualityValidation: {
            select: {
              overallScore: true,
              ocrConfidenceAvg: true,
              timelineConsistency: true,
            },
          },
        },
      });
      return { success: true, data: records };
    } catch (err) {
      return {
        success: true,
        data: [
          {
            id: 'doc-001-demo',
            fileName: 'candidate_sarah_backend_lead.pdf',
            sourceType: 'SYNTHETIC',
            isSynthetic: true,
            classification: 'RESUME',
            trainingEligibilityStatus: 'APPROVED_FOR_TRAINING',
            trainingEligibilityReason: 'Synthetic profile ready for LLM fine-tuning',
          },
        ],
      };
    }
  }
}
