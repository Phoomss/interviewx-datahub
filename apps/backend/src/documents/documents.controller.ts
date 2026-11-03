import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { TrainingEligibilityService } from './training-eligibility.service';
import { QualityValidationService } from './quality-validation.service';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { FilterDocumentsDto } from './dto/filter-documents.dto';
import { ReclassifyDocumentDto } from './dto/reclassify-document.dto';

@ApiTags('Documents & Real Document Intelligence')
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly eligibilityService: TrainingEligibilityService,
    private readonly qualityService: QualityValidationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'ดึงรายการเอกสารพร้อมตัวกรอง (Classification, Eligibility, Status)' })
  @ApiResponse({ status: 200, description: 'รายการเอกสารสำเร็จ' })
  findAll(@Query() filter: FilterDocumentsDto) {
    return this.documentsService.findAll(filter);
  }

  @Get('training-eligibility/records')
  @ApiOperation({ summary: 'ดึงรายการเอกสารทั้งหมดพร้อมสถานะ Training Eligibility Dashboard' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getEligibilityRecords(@Query('limit') limit?: number) {
    return this.eligibilityService.listEligibilityRecords(limit ? Number(limit) : 50);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลเอกสารและผลการสกัดโครงสร้างเชิงลึก (Deep Structured Profile & Provenance)' })
  @ApiResponse({ status: 200, description: 'รายละเอียดเอกสารสำเร็จ' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/provenance')
  @ApiOperation({ summary: 'ดึงรายการความเชื่อมโยงของข้อมูลที่สกัดได้กับตำแหน่งข้อความในไฟล์จริง (Field Provenance)' })
  @ApiResponse({ status: 200, description: 'รายการ Provenance สำเร็จ' })
  getProvenance(@Param('id') id: string) {
    return this.documentsService.getDocumentProvenance(id);
  }

  @Get(':id/quality')
  @ApiOperation({ summary: 'ดึงผลการประเมินคุณภาพข้อมูลเอกสาร 4 ระดับ (Quality Dashboard)' })
  @ApiResponse({ status: 200, description: 'ผลประเมินคุณภาพสำเร็จ' })
  getQuality(@Param('id') id: string) {
    return this.documentsService.getDocumentQuality(id);
  }

  @Get(':id/eligibility')
  @ApiOperation({ summary: 'ประเมินสถานะความพร้อมในการนำไปฝึกสอน AI (Training Eligibility Gate)' })
  @ApiResponse({ status: 200, description: 'ผลการประเมินสิทธิ์การฝึกสอน' })
  evaluateEligibility(@Param('id') id: string) {
    return this.eligibilityService.evaluateEligibility(id);
  }

  @Post(':id/eligibility')
  @ApiOperation({ summary: 'อัปเดตสถานะ Training Eligibility ด้วยตนเอง' })
  updateEligibility(
    @Param('id') id: string,
    @Body('status') status: any,
    @Body('reason') reason?: string,
    @Req() req?: any,
  ) {
    return this.eligibilityService.updateEligibilityStatus(id, status, reason, req?.user?.id);
  }

  @Post(':id/reclassify')
  @ApiOperation({ summary: 'ปรับแก้หมวดหมู่เอกสารโดยมนุษย์ (Human Reclassification with Audit Trail)' })
  reclassify(
    @Param('id') id: string,
    @Body() dto: ReclassifyDocumentDto,
    @Req() req: any,
  ) {
    return this.documentsService.reclassifyDocument(id, dto, req?.user?.id);
  }

  @Delete('synthetic/clear')
  @ApiOperation({ summary: 'ลบเอกสารเรซูเมสังเคราะห์ทั้งหมดออกจากระบบเพื่อเตรียมสร้างใหม่' })
  @ApiResponse({ status: 200, description: 'ล้างเอกสารสังเคราะห์สำเร็จ' })
  clearSyntheticDocuments(@Query('includeReal') includeReal?: string) {
    return this.documentsService.clearSyntheticDocuments(includeReal === 'true');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบเอกสารเรซูเมออกจากระบบ (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'ลบเอกสารสำเร็จ' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Get(':id/raw')
  @ApiOperation({ summary: 'ดาวน์โหลดหรือเปิดดูไฟล์เอกสารต้นฉบับจาก MinIO แบบ Private Authorized Stream' })
  async getRawDocument(@Param('id') id: string, @Res() res: Response) {
    try {
      const docResult = await this.documentsService.findOne(id);
      const doc = docResult.data;
      const stream = await this.documentsService.getRawDocumentStream(id);
      const contentType = doc.detectedMimeType || (doc.fileType === 'DOCX'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/pdf');

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
  @ApiOperation({ summary: 'อัปโหลดเอกสารเข้าระบบอย่างปลอดภัย (PDF, DOCX, XLSX, PPTX, PNG, JPG)' })
  @ApiResponse({ status: 201, description: 'อัปโหลดและสกัดข้อมูลเอกสารสำเร็จ' })
  uploadDocument(
    @UploadedFile() file: any,
    @Body() body: { sourceType?: string; consentId?: string; fileName?: string },
    @Req() req: any,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('กรุณาเลือกไฟล์เอกสารก่อนเริ่มนำเข้า');
    }
    const userIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    return this.documentsService.uploadDocument(
      {
        fileName: body.fileName || file?.originalname,
        fileSizeBytes: file?.size,
        buffer: file?.buffer,
      },
      body.sourceType,
      body.consentId,
      userIp,
    );
  }
}
