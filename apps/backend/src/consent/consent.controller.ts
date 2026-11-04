import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Headers,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ConsentService } from './consent.service';
import { AuthorizationDecisionService } from './authorization-decision.service';
import { PiiVaultService } from './pii-vault.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UploadRealDocumentDto } from './dto/upload-real-document.dto';
import { CheckAuthorizationDto } from './dto/check-authorization.dto';

@ApiTags('Consent & PII Vault (PDPA & Data Governance)')
@Controller(['consent', 'consents'])
export class ConsentController {
  constructor(
    private readonly consentService: ConsentService,
    private readonly authDecisionService: AuthorizationDecisionService,
    private readonly piiVaultService: PiiVaultService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'บันทึกหนังสือแสดงความยินยอมฉบับใหม่ (Create Consent Agreement)' })
  @ApiResponse({ status: 201, description: 'บันทึกหนังสือยินยอมสำเร็จ' })
  createConsent(@Body() dto: CreateConsentDto, @Req() req: any) {
    const userIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    return this.consentService.createConsent(dto, req.user?.id, userIp);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการหนังสือยินยอมทั้งหมดในระบบ' })
  @ApiResponse({ status: 200, description: 'รายการหนังสือยินยอมสำเร็จ' })
  listConsents() {
    return this.consentService.listConsents();
  }

  @Get('authorization/logs')
  @ApiOperation({ summary: 'ดึงรายการประวัติการตรวจสอบสิทธิ์การประมวลผล (Authorization Decision Logs)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAuthorizationLogs(@Query('limit') limit?: number) {
    return this.authDecisionService.getAuthorizationLogs(limit ? Number(limit) : 50);
  }

  @Post('authorization/check')
  @ApiOperation({ summary: 'ตรวจสอบสิทธิ์การประมวลผลตามวัตถุประสงค์ (Purpose Limitation Check)' })
  @ApiResponse({ status: 200, description: 'ผลการตรวจสอบสิทธิ์' })
  checkAuthorization(@Body() dto: CheckAuthorizationDto, @Req() req: any) {
    const userIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    return this.authDecisionService.evaluateAuthorization(dto, req.user?.id, userIp);
  }

  @Get('pii-vault/access-logs')
  @ApiOperation({ summary: 'ดึงประวัติการเข้าถึง PII Vault (Access Audit Trail)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getPiiAccessLogs(@Query('limit') limit?: number) {
    return this.piiVaultService.getAccessLogs(limit ? Number(limit) : 50);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงรายละเอียดหนังสือยินยอมรายฉบับ พร้อมประวัติการเปลี่ยนแปลง' })
  @ApiResponse({ status: 200, description: 'รายละเอียดหนังสือยินยอม' })
  getConsent(@Param('id') id: string) {
    return this.consentService.getConsent(id);
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
    return this.consentService.revokeConsent(id, reason, req.user?.id, userIp);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('pii-vault/:documentId')
  @ApiOperation({ summary: 'เข้าถึงข้อมูลใน PiiVault (จำกัดสิทธิ์เฉพาะ ADMIN เท่านั้น ยืนยันผ่าน JWT Bearer Token)' })
  getPiiVault(
    @Param('documentId') documentId: string,
    @Req() req: any,
  ) {
    const userIp = req?.ip || req?.connection?.remoteAddress || '127.0.0.1';
    const userRole = req.user?.role || 'ANNOTATOR';
    const userId = req.user?.id;
    return this.consentService.getPiiVault(documentId, userRole, userId, userIp);
  }
}
