import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyntheticService } from './synthetic.service';
import { CreateSyntheticJobDto } from './dto/create-synthetic-job.dto';

@ApiTags('Synthetic Resume Generation')
@Controller('synthetic')
export class SyntheticController {
  constructor(private readonly syntheticService: SyntheticService) {}

  @Post('jobs')
  @ApiOperation({ summary: 'สั่งสร้างชุดข้อมูลเรซูเมสังเคราะห์ (Batch Synthetic Generation)' })
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
