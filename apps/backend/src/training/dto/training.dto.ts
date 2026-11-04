import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainingJobDto {
  @ApiProperty({ description: 'Training Job Name', example: 'Fine-Tuning Qwen2.5 for Technical Interviews' })
  @IsString()
  @IsNotEmpty()
  jobName: string;

  @ApiProperty({ description: 'Base Foundation Model', example: 'Qwen/Qwen2.5-7B-Instruct' })
  @IsString()
  @IsNotEmpty()
  baseModel: string;

  @ApiPropertyOptional({ enum: ['QLORA', 'LORA', 'FULL'], default: 'QLORA' })
  @IsOptional()
  @IsEnum(['QLORA', 'LORA', 'FULL'])
  method?: 'QLORA' | 'LORA' | 'FULL';

  @ApiPropertyOptional({ description: 'Linked Dataset Export ID' })
  @IsOptional()
  @IsString()
  datasetExportId?: string;

  @ApiPropertyOptional({ description: 'PEFT and Hyperparameters Config' })
  @IsOptional()
  @IsObject()
  hyperparameters?: Record<string, any>;
}

export class RegisterModelVersionDto {
  @ApiProperty({ description: 'Model Name Identifier', example: 'interviewx-tech-interviewer' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Semantic Version', example: 'v1.0.0' })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiPropertyOptional({ description: 'Training Job ID' })
  @IsOptional()
  @IsString()
  trainingJobId?: string;

  @ApiProperty({ description: 'Base Foundation Model' })
  @IsString()
  @IsNotEmpty()
  baseModel: string;

  @ApiProperty({ description: 'MinIO/S3 URI to Adapter Weights or Merged Model' })
  @IsString()
  @IsNotEmpty()
  artifactUri: string;

  @ApiPropertyOptional({ description: 'Benchmark Quality Score', example: 0.91 })
  @IsOptional()
  @IsNumber()
  benchmarkScore?: number;

  @ApiPropertyOptional({ description: 'Zero PII Verified', default: true })
  @IsOptional()
  piiScanPassed?: boolean;
}

export class PromoteModelDto {
  @ApiProperty({ enum: ['CANDIDATE', 'STAGING', 'PRODUCTION', 'ARCHIVED'], example: 'PRODUCTION' })
  @IsEnum(['CANDIDATE', 'STAGING', 'PRODUCTION', 'ARCHIVED'])
  targetStatus: 'CANDIDATE' | 'STAGING' | 'PRODUCTION' | 'ARCHIVED';

  @ApiPropertyOptional({ description: 'Inference Serving Endpoint URL' })
  @IsOptional()
  @IsString()
  deploymentEndpoint?: string;
}
