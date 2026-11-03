import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';

export interface FileValidationResult {
  isValid: boolean;
  detectedMimeType: string;
  fileExtension: string;
  checksumSha256: string;
  fileSizeBytes: number;
  malwareStatus: 'CLEAN' | 'INFECTED' | 'SUSPICIOUS';
  errorMessage?: string;
}

export class FileValidatorUtil {
  /**
   * ตรวจสอบความถูกต้องของไฟล์ผ่าน Magic Bytes / File Signatures อย่างแท้จริง
   * ป้องกันการปลอมแปลงนามสกุลไฟล์ (MIME Spoofing)
   */
  static validateSignatureAndIntegrity(
    buffer: Buffer,
    originalFilename: string,
    maxSizeBytes: number = 25 * 1024 * 1024, // 25MB
  ): FileValidationResult {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('ไฟล์ที่อัปโหลดมีขนาด 0 ไบต์ หรือไม่มีเนื้อหา');
    }

    if (buffer.length > maxSizeBytes) {
      throw new BadRequestException(`ขนาดไฟล์เกินขีดจำกัดสูงสุด (${Math.round(maxSizeBytes / (1024 * 1024))}MB)`);
    }

    const checksumSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const ext = originalFilename.split('.').pop()?.toLowerCase() || '';

    // Check magic bytes
    let detectedMime = 'application/octet-stream';
    let isValidType = false;

    // PDF Magic Bytes: %PDF- (25 50 44 46)
    if (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      detectedMime = 'application/pdf';
      isValidType = true;
    }
    // Office Open XML (DOCX, XLSX, PPTX) Magic Bytes: PK\x03\x04 (50 4B 03 04)
    else if (
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    ) {
      if (ext === 'xlsx') {
        detectedMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (ext === 'pptx') {
        detectedMime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      } else {
        detectedMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
      isValidType = true;
    }
    // PNG Magic Bytes: \x89PNG\r\n\x1a\n (89 50 4E 47)
    else if (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      detectedMime = 'image/png';
      isValidType = true;
    }
    // JPEG/JPG Magic Bytes: FF D8 FF
    else if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      detectedMime = 'image/jpeg';
      isValidType = true;
    }

    if (!isValidType) {
      throw new BadRequestException(
        `รูปแบบไฟล์หรือ Signature ไม่ถูกต้อง ระบบรองรับเฉพาะ PDF, DOCX, XLSX, PPTX, PNG, JPEG เท่านั้น (ตรวจพบนามสกุล .${ext})`,
      );
    }

    // Malware scanning simulation / signature check (e.g. EICAR test string or executable headers MZ)
    let malwareStatus: 'CLEAN' | 'INFECTED' | 'SUSPICIOUS' = 'CLEAN';
    const firstChars = buffer.subarray(0, 100).toString('ascii');
    if (firstChars.includes('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*')) {
      malwareStatus = 'INFECTED';
      throw new BadRequestException('ระบบตรวจพบมัลแวร์ในไฟล์ที่อัปโหลด ปฏิเสธการประมวลผลทันที');
    }

    // Check executable PE header MZ (4D 5A) inside disguised file
    if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
      malwareStatus = 'SUSPICIOUS';
      throw new BadRequestException('ระบบตรวจพบ executable binary แฝงในไฟล์ ปฏิเสธการประมวลผลเพื่อความปลอดภัย');
    }

    return {
      isValid: true,
      detectedMimeType: detectedMime,
      fileExtension: ext,
      checksumSha256,
      fileSizeBytes: buffer.length,
      malwareStatus,
    };
  }
}
