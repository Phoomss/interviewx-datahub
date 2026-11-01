import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { FilterDocumentsDto } from './dto/filter-documents.dto';

@ApiTags('Documents & Annotation')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงรายการเอกสารเรซูเมพร้อมตัวกรอง' })
  @ApiResponse({ status: 200, description: 'รายการเอกสารสำเร็จ' })
  findAll(@Query() filter: FilterDocumentsDto) {
    return this.documentsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลเรซูเมและผลการสกัดโครงสร้าง (Parsed Profile) ตามรหัสเอกสาร' })
  @ApiResponse({ status: 200, description: 'รายละเอียดเอกสารสำเร็จ' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'บันทึกผลการตรวจสอบรับรอง (Approve / Reject / Edit) และสร้าง Audit Trail' })
  @ApiResponse({ status: 200, description: 'บันทึกผลการตรวจสอบสำเร็จ' })
  submitReview(
    @Param('id') id: string,
    @Body() dto: SubmitReviewDto,
    @Req() req: any,
  ) {
    const userIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    return this.documentsService.submitReview(id, dto, userIp);
  }
}
