import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSyntheticJobDto {
  @ApiProperty({ description: 'ชื่อของงานสร้างข้อมูลสังเคราะห์', example: 'Senior Backend Engineers Batch 1' })
  @IsString()
  @IsNotEmpty()
  jobName: string;

  @ApiProperty({ description: 'ตำแหน่งงานเป้าหมาย', example: 'Backend Engineer' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ description: 'ระดับความอาวุโส', example: 'Senior' })
  @IsString()
  @IsNotEmpty()
  seniority: string;

  @ApiProperty({ description: 'จำนวนเรซูเมที่ต้องการสร้าง (1 - 50)', example: 5 })
  @IsNumber()
  @Min(1)
  @Max(50)
  targetCount: number;

  @ApiProperty({ description: 'รายการทักษะทางเทคนิค (Tech Stack)', example: ['NestJS', 'PostgreSQL', 'Redis', 'Docker'] })
  @IsArray()
  @IsString({ each: true })
  techStack: string[];

  @ApiProperty({ description: 'ภาษาของเรซูเม (en หรือ th)', example: 'en', required: false })
  @IsOptional()
  @IsString()
  language?: string;
}
