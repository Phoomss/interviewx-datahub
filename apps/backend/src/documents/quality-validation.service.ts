import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ValidationIssue {
  level: number; // 1 to 4
  type: string;
  field?: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface DocumentQualityResult {
  overallScore: number;
  fileIntegrityValid: boolean;
  extractionCompleteness: number;
  ocrConfidenceAvg: number;
  timelineConsistency: boolean;
  crossDocumentConsistency: boolean;
  issues: ValidationIssue[];
}

@Injectable()
export class QualityValidationService {
  private readonly logger = new Logger(QualityValidationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * ประเมินคุณภาพข้อมูลเอกสาร 4 ระดับแรก (Levels 1-4 Quality Gate)
   */
  evaluateQuality(
    fileValidationValid: boolean,
    structuredData: any,
    ocrConfidenceAvg: number = 1.0,
    rawText: string = '',
  ): DocumentQualityResult {
    const issues: ValidationIssue[] = [];

    // Level 1: File Integrity
    if (!fileValidationValid) {
      issues.push({
        level: 1,
        type: 'FILE_CORRUPTED',
        message: 'ไฟล์ไม่ผ่านการตรวจสอบความสมบูรณ์หรือ Magic Signature',
        severity: 'ERROR',
      });
    }

    // Level 2: Extraction Completeness
    let completenessScore = 0.0;
    const skills = structuredData?.skills || [];
    const experiences = structuredData?.experiences || [];
    const educations = structuredData?.educations || [];
    const summary = structuredData?.professional_summary || '';

    let completenessWeight = 0;
    if (skills.length >= 3) completenessWeight += 30;
    else if (skills.length > 0) completenessWeight += 15;
    else {
      issues.push({
        level: 2,
        type: 'MISSING_SKILLS',
        message: 'ไม่พบรายการทักษะที่ชัดเจนในเอกสาร',
        severity: 'WARNING',
      });
    }

    if (experiences.length >= 1) completenessWeight += 35;
    else {
      issues.push({
        level: 2,
        type: 'MISSING_EXPERIENCE',
        message: 'ไม่พบประวัติการทำงานในเอกสาร',
        severity: 'WARNING',
      });
    }

    if (educations.length >= 1) completenessWeight += 20;
    else {
      issues.push({
        level: 2,
        type: 'MISSING_EDUCATION',
        message: 'ไม่พบประวัติการศึกษาในเอกสาร',
        severity: 'INFO',
      });
    }

    if (summary && summary.length > 30) completenessWeight += 15;
    completenessScore = completenessWeight / 100;

    // OCR Quality Check
    if (ocrConfidenceAvg < 0.85) {
      issues.push({
        level: 2,
        type: 'LOW_OCR_CONFIDENCE',
        message: `ความแม่นยำของ OCR ต่ำกว่าเกณฑ์ (${Math.round(ocrConfidenceAvg * 100)}%) ควรส่งให้มนุษย์ตรวจสอบ`,
        severity: 'WARNING',
      });
    }

    // Level 3: Field Validation
    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      if (!exp.start_date || exp.start_date.length < 4) {
        issues.push({
          level: 3,
          type: 'INVALID_DATE_FORMAT',
          field: `experiences[${i}].start_date`,
          message: 'รูปแบบวันที่เริ่มต้นการทำงานไม่ถูกต้อง',
          severity: 'INFO',
        });
      }
    }

    for (let j = 0; j < educations.length; j++) {
      const edu = educations[j];
      if (edu.graduation_year && (edu.graduation_year < 1960 || edu.graduation_year > 2035)) {
        issues.push({
          level: 3,
          type: 'INVALID_GRADUATION_YEAR',
          field: `educations[${j}].graduation_year`,
          message: `ปีที่จบการศึกษา (${edu.graduation_year}) อยู่นอกช่วงสมเหตุสมผล`,
          severity: 'WARNING',
        });
      }
    }

    // Level 4: Cross-Document & Timeline Consistency Validation
    let timelineConsistent = true;
    for (const exp of experiences) {
      const startYear = parseInt(exp.start_date?.substring(0, 4) || '0', 10);
      const endYearStr = exp.end_date?.substring(0, 4);
      const endYear = endYearStr && !isNaN(parseInt(endYearStr, 10)) ? parseInt(endYearStr, 10) : 9999;

      if (startYear > 0 && endYear < 9999 && startYear > endYear) {
        timelineConsistent = false;
        issues.push({
          level: 4,
          type: 'INVERTED_TIMELINE',
          message: `ช่วงเวลาทำงานขัดแย้ง: ปีเริ่มต้น (${startYear}) หลังปีสิ้นสุด (${endYear})`,
          severity: 'ERROR',
        });
      }
    }

    // Overall Quality Score (Normalized between 0.0 and 1.0)
    let overall = (completenessScore * 0.5) + (ocrConfidenceAvg * 0.3) + (timelineConsistent ? 0.2 : 0.0);
    overall = Math.min(0.99, Math.max(0.1, Math.round(overall * 100) / 100));

    return {
      overallScore: overall,
      fileIntegrityValid: fileValidationValid,
      extractionCompleteness: completenessScore,
      ocrConfidenceAvg,
      timelineConsistency: timelineConsistent,
      crossDocumentConsistency: issues.filter((i) => i.severity === 'ERROR').length === 0,
      issues,
    };
  }

  /**
   * บันทึกผลการประเมินคุณภาพลงฐานข้อมูล DocumentQualityValidation
   */
  async persistQualityValidation(documentId: string, result: DocumentQualityResult) {
    try {
      await this.prisma.documentQualityValidation.upsert({
        where: { documentId },
        update: {
          overallScore: result.overallScore,
          fileIntegrityValid: result.fileIntegrityValid,
          extractionCompleteness: result.extractionCompleteness,
          ocrConfidenceAvg: result.ocrConfidenceAvg,
          timelineConsistency: result.timelineConsistency,
          crossDocumentConsistency: result.crossDocumentConsistency,
          validationIssues: result.issues as any,
          validatedAt: new Date(),
        },
        create: {
          documentId,
          overallScore: result.overallScore,
          fileIntegrityValid: result.fileIntegrityValid,
          extractionCompleteness: result.extractionCompleteness,
          ocrConfidenceAvg: result.ocrConfidenceAvg,
          timelineConsistency: result.timelineConsistency,
          crossDocumentConsistency: result.crossDocumentConsistency,
          validationIssues: result.issues as any,
          validatedAt: new Date(),
        },
      });
    } catch (err) {
      this.logger.debug(`Quality validation persist deferred: ${err.message}`);
    }
  }
}
