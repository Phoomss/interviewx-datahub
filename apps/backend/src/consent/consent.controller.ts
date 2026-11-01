import { Controller, Get, Post, Body, Param, Req, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UploadRealDocumentDto } from './dto/upload-real-document.dto';

@ApiTags('Consent & PII Vault (PDPA)')
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Post()
  @ApiOperation({ summary: 'บันทึกหนังสือแสดงความยินยอมการใช้ข้อมูล (Create Consent Agreement)' })
  @ApiResponse({ status: 201, description: 'บันทึกหนังสือยินยอมสำเร็จ' })
  createConsent(@Body() dto: CreateConsentDto) {
    return this.consentService.createConsent(dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการหนังสือยินยอมทั้งหมดในระบบ' })
  @ApiResponse({ status: 200, description: 'รายการหนังสือยินยอมสำเร็จ' })
  listConsents() {
    return this.consentService.listConsents();
  }

  @Post('onboard-real-cv')
  @ApiOperation({ summary: 'นำเข้าข้อมูลเรซูเมจริง (ตรวจสอบ Consent ID และแยกเก็บข้อมูลเข้า PiiVault)' })
  @ApiResponse({ status: 201, description: 'นำเข้าเรซูเมจริงสำเร็จ' })
  onboardRealDocument(@Body() dto: UploadRealDocumentDto, @Req() req: any) {
    const userIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    return this.consentService.onboardRealDocument(dto, userIp);
  }

  @Post(':id/revoke')
  @ApiOperation({ summary: 'เพิกถอนความยินยอมและทำลายข้อมูล PII แบบถาวร (PDPA Right to be Forgotten)' })
  @ApiResponse({ status: 200, description: 'เพิกถอนความยินยอมและทำลายข้อมูลสำเร็จ' })
  revokeConsent(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const userIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    return this.consentService.revokeConsent(id, reason, userIp);
  }

  @Get('pii-vault/:documentId')
  @ApiOperation({ summary: 'เข้าถึงข้อมูลใน PiiVault (จำกัดสิทธิ์เฉพาะ ADMIN เท่านั้น)' })
  @ApiHeader({ name: 'x-user-role', description: 'บทบาทของผู้ใช้ (เช่น ADMIN, ANNOTATOR)', required: false })
  getPiiVault(
    @Param('documentId') documentId: string,
    @Headers('x-user-role') userRole: string = 'ANNOTATOR',
  ) {
    return this.consentService.getPiiVault(documentId, userRole);
  }
}
