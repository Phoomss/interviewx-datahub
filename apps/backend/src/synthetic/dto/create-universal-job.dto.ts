import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUniversalJobDto {
  @ApiProperty({ description: 'ชื่อชุดงานสร้างข้อมูลสังเคราะห์', example: 'Medical Resident Interview Dataset 2026' })
  @IsString()
  @IsNotEmpty()
  jobName: string;

  @ApiProperty({
    description: 'ประเภทชุดข้อมูล (10 มิติ: profile, resume, academic_cv, portfolio, supporting_doc, interview_question, interview_answer, rubric_evaluation, feedback, scenario)',
    example: 'profile',
    enum: ['profile', 'resume', 'academic_cv', 'portfolio', 'supporting_doc', 'interview_question', 'interview_answer', 'rubric_evaluation', 'feedback', 'scenario'],
  })
  @IsString()
  @IsNotEmpty()
  datasetType: string;

  @ApiProperty({ description: 'รหัสกลุ่มอุตสาหกรรม (Industry Key or UUID)', example: 'healthcare' })
  @IsString()
  @IsNotEmpty()
  industryKey: string;

  @ApiProperty({
    description: 'รายการรหัสอาชีพเป้าหมาย (รองรับการสร้างพร้อมกันหลายอาชีพแบบ Batch)',
    example: ['medical_doctor', 'nurse'],
  })
  @IsArray()
  @IsString({ each: true })
  professionKeys: string[];

  @ApiProperty({
    description: 'หมวดหมู่การสัมภาษณ์ (เช่น job, academic, scholarship, international_exchange, research, career_dev, general)',
    example: 'job',
  })
  @IsString()
  @IsNotEmpty()
  interviewCategory: string;

  @ApiPropertyOptional({ description: 'หมวดหมู่การสัมภาษณ์ย่อย', example: 'technical' })
  @IsOptional()
  @IsString()
  interviewSubcategory?: string;

  @ApiProperty({ description: 'ระดับประสบการณ์ / ลำดับอาวุโส', example: 'Licensed Professional' })
  @IsString()
  @IsNotEmpty()
  seniority: string;

  @ApiPropertyOptional({ description: 'รายการทักษะเฉพาะ', example: ['Clinical Diagnosis', 'Patient Care'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ description: 'ภาษาของข้อมูล (en, th, mixed)', example: 'en', default: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'ระดับความยาก (Entry, Mid, Senior, Executive)', example: 'Mid', default: 'Mid' })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional({ description: 'จำนวนรายการต่ออาชีพ (1 - 20)', example: 2, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  batchSizePerProfession?: number;

  @ApiPropertyOptional({ description: 'พารามิเตอร์ปรับแต่งเพิ่มเติม', example: { answer_quality: 'Excellent' } })
  @IsOptional()
  customParameters?: Record<string, any>;
}
