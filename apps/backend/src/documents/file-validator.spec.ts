import { describe, it, expect } from 'bun:test';
import { BadRequestException } from '@nestjs/common';
import { FileValidatorUtil } from './file-validator.util';

describe('FileValidatorUtil - Real Document Ingestion Security', () => {
  it('should validate authentic PDF with valid %PDF- magic bytes', () => {
    // 25 50 44 46 2D is '%PDF-'
    const pdfBuffer = Buffer.from('%PDF-1.7 standard document test content');
    const result = FileValidatorUtil.validateSignatureAndIntegrity(pdfBuffer, 'resume.pdf');

    expect(result.isValid).toBe(true);
    expect(result.detectedMimeType).toBe('application/pdf');
    expect(result.fileExtension).toBe('pdf');
    expect(result.checksumSha256).toBeDefined();
    expect(result.malwareStatus).toBe('CLEAN');
  });

  it('should validate authentic DOCX with PK zip magic bytes', () => {
    // 50 4B 03 04 is 'PK\x03\x04'
    const docxHeader = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]);
    const result = FileValidatorUtil.validateSignatureAndIntegrity(docxHeader, 'cv.docx');

    expect(result.isValid).toBe(true);
    expect(result.detectedMimeType).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    expect(result.fileExtension).toBe('docx');
  });

  it('should validate authentic PNG with PNG magic signature', () => {
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    const result = FileValidatorUtil.validateSignatureAndIntegrity(pngHeader, 'certificate.png');

    expect(result.isValid).toBe(true);
    expect(result.detectedMimeType).toBe('image/png');
  });

  it('should reject spoofed extension (e.g. text file renamed to .pdf)', () => {
    const fakePdf = Buffer.from('Just plain text without PDF magic signature');
    expect(() => {
      FileValidatorUtil.validateSignatureAndIntegrity(fakePdf, 'fake.pdf');
    }).toThrow(BadRequestException);
  });

  it('should reject executable files disguised as documents (MZ PE Header)', () => {
    // 4D 5A is 'MZ' Windows PE executable header
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    expect(() => {
      FileValidatorUtil.validateSignatureAndIntegrity(exeBuffer, 'trojan.pdf');
    }).toThrow(BadRequestException);
  });

  it('should reject empty zero-byte files', () => {
    expect(() => {
      FileValidatorUtil.validateSignatureAndIntegrity(Buffer.alloc(0), 'empty.pdf');
    }).toThrow(BadRequestException);
  });
});
