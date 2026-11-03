import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { ForbiddenException } from '@nestjs/common';
import { PiiVaultService } from './pii-vault.service';

describe('PiiVaultService - Isolation, Encryption & Access Control', () => {
  let service: PiiVaultService;

  const mockPrisma: any = {
    piiVault: {
      upsert: mock().mockResolvedValue({ id: 'vault-1', subjectId: 'SUBJ-2026-9841' }),
      findUnique: mock(),
      updateMany: mock().mockResolvedValue({ count: 1 }),
    },
    piiAccessLog: {
      create: mock().mockResolvedValue({}),
      findMany: mock().mockResolvedValue([]),
    },
  };

  const mockConfig: any = {
    get: mock().mockReturnValue('interviewx_pii_vault_secure_test_key_32chars!'),
  };

  beforeEach(() => {
    service = new PiiVaultService(mockPrisma, mockConfig);
  });

  it('should encrypt and decrypt sensitive PII using AES-256-GCM', () => {
    const originalText = 'Somchai Prasert: 1-1004-99887-21-3';
    const encrypted = service.encrypt(originalText);

    expect(encrypted).not.toBe(originalText);
    expect(encrypted.includes(':')).toBe(true);

    const decrypted = service.decrypt(encrypted);
    expect(decrypted).toBe(originalText);
  });

  it('should generate pseudonymous subject IDs that do not expose PII', () => {
    const subjId = service.generatePseudonymousId();
    expect(subjId.startsWith('SUBJ-')).toBe(true);
    expect(subjId).not.toContain('@');
    expect(subjId.length).toBeGreaterThan(8);
  });

  it('should allow ADMIN to retrieve unmasked PII and record access log', async () => {
    mockPrisma.piiVault.findUnique.mockResolvedValue({
      id: 'vault-101',
      documentId: 'doc-101',
      subjectId: 'SUBJ-2026-0001',
      fullName: 'Dr. John Doe',
      email: 'john.doe@example.com',
      isPurged: false,
    });

    const result = await service.retrievePii('doc-101', 'ADMIN', 'admin-user-1', 'AUDIT_CHECK');

    expect(result.success).toBe(true);
    expect(result.data.fullName).toBe('Dr. John Doe');
    expect(mockPrisma.piiAccessLog.create).toHaveBeenCalled();
  });

  it('should reject ANNOTATOR or VIEWER from accessing PII Vault (403 Forbidden)', async () => {
    mockPrisma.piiVault.findUnique.mockResolvedValue({
      id: 'vault-102',
      documentId: 'doc-102',
      subjectId: 'SUBJ-2026-0002',
      fullName: 'Secret Candidate',
      isPurged: false,
    });

    await expect(
      service.retrievePii('doc-102', 'ANNOTATOR', 'annotator-user-1', 'VIEW'),
    ).rejects.toThrow(ForbiddenException);

    // Access log must be recorded even on rejection
    expect(mockPrisma.piiAccessLog.create).toHaveBeenCalled();
  });

  it('should purge PII when requested (Hard Delete / Right to be Forgotten)', async () => {
    const res = await service.purgePii('doc-103');
    expect(res.success).toBe(true);
    expect(mockPrisma.piiVault.updateMany).toHaveBeenCalled();
  });
});
