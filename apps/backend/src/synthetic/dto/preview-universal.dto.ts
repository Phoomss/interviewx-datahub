import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PreviewUniversalDto {
  @ApiProperty({
    description: 'ประเภทชุดข้อมูล (10 มิติ: profile, resume, academic_cv, portfolio, supporting_doc, interview_question, interview_answer, rubric_evaluation, feedback, scenario)',
    example: 'interview_question',
    enum: ['profile', 'resume', 'academic_cv', 'portfolio', 'supporting_doc', 'interview_question', 'interview_answer', 'rubric_evaluation', 'feedback', 'scenario'],
  })
  @IsString()
  @IsNotEmpty()
  datasetType: string;

  @ApiProperty({ description: 'รหัสกลุ่มอุตสาหกรรม (Industry Key or UUID)', example: 'tech' })
  @IsString()
  @IsNotEmpty()
  industryKey: string;

  @ApiProperty({ description: 'รหัสตำแหน่งงานเป้าหมาย', example: 'ai_engineer' })
  @IsString()
  @IsNotEmpty()
  professionKey: string;

  @ApiPropertyOptional({ description: 'ชื่ออาชีพภาษาอังกฤษ' })
  @IsOptional()
  @IsString()
  professionName?: string;

  @ApiProperty({ description: 'หมวดหมู่การสัมภาษณ์', example: 'job' })
  @IsString()
  @IsNotEmpty()
  interviewCategory: string;

  @ApiPropertyOptional({ description: 'หมวดหมู่การสัมภาษณ์ย่อย', example: 'technical' })
  @IsOptional()
  @IsString()
  interviewSubcategory?: string;

  @ApiProperty({ description: 'ระดับความอาวุโส', example: 'Senior' })
  @IsString()
  @IsNotEmpty()
  seniority: string;

  @ApiPropertyOptional({ description: 'รายการทักษะเฉพาะ', example: ['PyTorch', 'LLMs'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ description: 'ภาษาของข้อมูล (en, th, mixed)', example: 'en', default: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'ระดับความยาก (Entry, Mid, Senior, Executive)', example: 'Senior', default: 'Mid' })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional({ description: 'พารามิเตอร์ปรับแต่งเพิ่มเติม', example: {} })
  @IsOptional()
  customParameters?: Record<string, any>;
}
