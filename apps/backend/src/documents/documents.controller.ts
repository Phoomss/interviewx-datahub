import { Controller, Get, Post, Delete, Body, Param, Query, Req, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
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

  @Delete(':id')
  @ApiOperation({ summary: 'ลบเอกสารเรซูเมออกจากระบบ (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'ลบเอกสารสำเร็จ' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Get(':id/raw')
  @ApiOperation({ summary: 'ดาวน์โหลดหรือเปิดดูไฟล์เอกสารต้นฉบับจาก MinIO (PDF/DOCX Stream)' })
  async getRawDocument(@Param('id') id: string, @Res() res: Response) {
    try {
      const docResult = await this.documentsService.findOne(id);
      const doc = docResult.data;
      const stream = await this.documentsService.getRawDocumentStream(id);
      const contentType = doc.fileType === 'DOCX'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/pdf';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${doc.fileName}"`);
      stream.pipe(res);
    } catch (err) {
      res.status(404).json({ success: false, message: 'ไม่พบไฟล์เอกสารต้นฉบับใน Object Storage' });
    }
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'อัปโหลดเอกสารเรซูเมเข้าระบบ (PDF/DOCX Ingestion)' })
  @ApiResponse({ status: 201, description: 'อัปโหลดและประมวลผลเอกสารสำเร็จ' })
  uploadDocument(
    @UploadedFile() file: any,
    @Body() body: { sourceType?: string; consentId?: string; fileName?: string },
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('กรุณาเลือกไฟล์ PDF หรือ DOCX ก่อนเริ่มนำเข้า');
    }
    return this.documentsService.uploadDocument(
      {
        fileName: body.fileName || file?.originalname,
        fileSizeBytes: file?.size,
        buffer: file?.buffer,
      },
      body.sourceType,
      body.consentId,
    );
  }
}
