import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SyntheticService } from './synthetic.service';
import { CreateSyntheticJobDto } from './dto/create-synthetic-job.dto';
import { CreateUniversalJobDto } from './dto/create-universal-job.dto';
import { PreviewUniversalDto } from './dto/preview-universal.dto';
import { UpdateRecordReviewDto } from './dto/update-record-review.dto';

@ApiTags('Universal Multi-Industry Synthetic Generator')
@Controller('synthetic')
export class SyntheticController {
  constructor(private readonly syntheticService: SyntheticService) {}

  @Post('universal/preview')
  @ApiOperation({ summary: 'สร้างตัวอย่างสด (Live Preview) 1 รายการก่อนสร้างชุดใหญ่' })
  @ApiResponse({ status: 200, description: 'ตัวอย่างข้อมูลที่สอดคล้องตามโครงสร้าง' })
  previewUniversal(@Body() dto: PreviewUniversalDto) {
    return this.syntheticService.previewUniversal(dto);
  }

  @Post('universal/jobs')
  @ApiOperation({ summary: 'สร้างชุดข้อมูลสังเคราะห์ข้ามอุตสาหกรรมและหลายอาชีพ (Universal Batch Generation)' })
  @ApiResponse({ status: 201, description: 'สร้างชุดข้อมูลสำเร็จ' })
  createUniversalJob(@Body() dto: CreateUniversalJobDto) {
    return this.syntheticService.createUniversalJob(dto);
  }

  @Get('records')
  @ApiOperation({ summary: 'ดึงรายการชุดข้อมูลสังเคราะห์ 7 มิติพร้อมตัวกรองละเอียด' })
  @ApiQuery({ name: 'datasetType', required: false, enum: ['profile', 'resume', 'interview_question', 'interview_answer', 'rubric_evaluation', 'feedback', 'scenario'] })
  @ApiQuery({ name: 'industryId', required: false })
  @ApiQuery({ name: 'professionId', required: false })
  @ApiQuery({ name: 'interviewCategory', required: false })
  @ApiQuery({ name: 'seniorityLevel', required: false })
  @ApiQuery({ name: 'qualityStatus', required: false, enum: ['VERIFIED', 'PENDING_REVIEW', 'NEEDS_REVISION', 'REJECTED'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listRecords(
    @Query('datasetType') datasetType?: string,
    @Query('industryId') industryId?: string,
    @Query('professionId') professionId?: string,
    @Query('interviewCategory') interviewCategory?: string,
    @Query('seniorityLevel') seniorityLevel?: string,
    @Query('qualityStatus') qualityStatus?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.syntheticService.listDatasetRecords({
      datasetType,
      industryId,
      professionId,
      interviewCategory,
      seniorityLevel,
      qualityStatus,
      page,
      limit,
    });
  }

  @Delete('records/clear')
  @ApiOperation({ summary: 'ล้างชุดข้อมูลสังเคราะห์ทั้งหมดหรือตามประเภทเพื่อเตรียมสร้างใหม่' })
  @ApiResponse({ status: 200, description: 'ล้างชุดข้อมูลสำเร็จ' })
  clearRecords(@Query('datasetType') datasetType?: string) {
    return this.syntheticService.clearRecords(datasetType);
  }

  @Get('records/:id')
  @ApiOperation({ summary: 'ดึงรายละเอียดข้อมูลสังเคราะห์รายรายการ' })
  getRecord(@Param('id') id: string) {
    return this.syntheticService.getDatasetRecord(id);
  }

  @Patch('records/:id/review')
  @ApiOperation({ summary: 'ตรวจสอบและรับรองคุณภาพข้อมูล (Human-in-the-loop Quality Check)' })
  updateRecordQuality(@Param('id') id: string, @Body() dto: UpdateRecordReviewDto) {
    return this.syntheticService.updateDatasetRecordQuality(id, dto);
  }

  // --- Legacy Endpoints (Maintained for full backward compatibility) ---

  @Post('jobs')
  @ApiOperation({ summary: 'สั่งสร้างชุดข้อมูลเรซูเมสังเคราะห์ (Legacy Batch Generation)' })
  @ApiResponse({ status: 201, description: 'สร้างข้อมูลสังเคราะห์สำเร็จ' })
  createJob(@Body() dto: CreateSyntheticJobDto) {
    return this.syntheticService.createJob(dto);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'ดึงรายการประวัติงานสร้างข้อมูลสังเคราะห์ทั้งหมด' })
  @ApiResponse({ status: 200, description: 'รายการงานสำเร็จ' })
  listJobs() {
    return this.syntheticService.listJobs();
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'ดึงรายละเอียดและความคืบหน้าของงานสังเคราะห์ตามรหัสงาน' })
  @ApiResponse({ status: 200, description: 'รายละเอียดงานสำเร็จ' })
  getJob(@Param('id') id: string) {
    return this.syntheticService.getJob(id);
  }
}
