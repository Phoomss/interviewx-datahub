import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TrainingService } from './training.service';
import { CreateTrainingJobDto, RegisterModelVersionDto, PromoteModelDto } from './dto/training.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('AI Model Training & Model Registry')
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ML_ENGINEER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'สร้างงานฝึกสอนโมเดล AI (LoRA / QLoRA Training Job Creation)' })
  createJob(@Body() dto: CreateTrainingJobDto, @Request() req: any) {
    return this.trainingService.createTrainingJob(dto, req.user?.id);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'ดึงรายการงานฝึกสอนโมเดลทั้งหมด' })
  @ApiQuery({ name: 'status', required: false, enum: ['QUEUED', 'RUNNING', 'COMPLETED', 'FAILED'] })
  listJobs(@Query('status') status?: string) {
    return this.trainingService.listTrainingJobs(status);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'ดึงรายละเอียดและสถานะงานฝึกสอนโมเดล' })
  getJob(@Param('id') id: string) {
    return this.trainingService.getTrainingJob(id);
  }

  @Post('jobs/:id/trigger')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ML_ENGINEER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'สั่งเริ่มรันกระบวนการ Fine-Tuning และ Automated Benchmark' })
  triggerJob(@Param('id') id: string) {
    return this.trainingService.triggerTrainingJob(id);
  }

  // ==========================================
  // Model Registry & Publishing
  // ==========================================

  @Post('models')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ML_ENGINEER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลงทะเบียนโมเดลเวอร์ชันใหม่เข้า Model Registry' })
  registerModel(@Body() dto: RegisterModelVersionDto, @Request() req: any) {
    return this.trainingService.registerModelVersion(dto, req.user?.id);
  }

  @Get('models')
  @ApiOperation({ summary: 'ดึงรายการโมเดลใน Model Registry (CANDIDATE, STAGING, PRODUCTION)' })
  @ApiQuery({ name: 'status', required: false, enum: ['CANDIDATE', 'STAGING', 'PRODUCTION', 'ARCHIVED'] })
  listModels(@Query('status') status?: string) {
    return this.trainingService.listModelVersions(status);
  }

  @Patch('models/:id/promote')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'เลื่อนสถานะโมเดล (Integrity Gate: บังคับตรวจคะแนน Benchmark และ Zero PII)' })
  promoteModel(@Param('id') id: string, @Body() dto: PromoteModelDto, @Request() req: any) {
    return this.trainingService.promoteModel(id, dto, req.user?.id);
  }

  @Get('models/active')
  @ApiOperation({ summary: 'ดึงข้อมูลโมเดลระดับ PRODUCTION ที่พร้อมให้บริการสำหรับ InterviewX Core' })
  @ApiQuery({ name: 'name', required: false })
  getActiveModel(@Query('name') name?: string) {
    return this.trainingService.getActiveProductionModel(name);
  }
}
