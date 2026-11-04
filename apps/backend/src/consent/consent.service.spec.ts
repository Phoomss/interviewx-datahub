import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { AuthorizationDecisionService } from './authorization-decision.service';
import { PiiVaultService } from './pii-vault.service';

describe('ConsentService & Authorization Decision Engine', () => {
  let consentService: ConsentService;
  let authDecisionService: AuthorizationDecisionService;
  let piiVaultService: PiiVaultService;

  const mockPrisma: any = {
    consentRecord: {
      findUnique: mock(),
      findFirst: mock(),
      findMany: mock().mockResolvedValue([]),
      create: mock(),
      update: mock(),
      upsert: mock().mockResolvedValue({}),
    },
    consentHistory: {
      create: mock().mockResolvedValue({}),
    },
    processingAuthorizationLog: {
      create: mock().mockResolvedValue({}),
      findMany: mock().mockResolvedValue([]),
    },
    document: {
      findUnique: mock(),
      update: mock().mockResolvedValue({}),
    },
    piiVault: {
      upsert: mock().mockResolvedValue({ id: 'vault-1', subjectId: 'SUBJ-2026-9841' }),
      findUnique: mock(),
      updateMany: mock().mockResolvedValue({ count: 1 }),
      deleteMany: mock().mockResolvedValue({ count: 1 }),
    },
    piiAccessLog: {
      create: mock().mockResolvedValue({}),
      findMany: mock().mockResolvedValue([]),
    },
    subject: {
      upsert: mock().mockResolvedValue({ id: 'subj-1', subjectIdentifier: 'SUBJ-2026-9841' }),
      findUnique: mock(),
      updateMany: mock().mockResolvedValue({ count: 1 }),
    },
    datasetExport: {
      findMany: mock().mockResolvedValue([]),
    },
    auditLog: {
      create: mock().mockResolvedValue({}),
    },
    $transaction: mock().mockImplementation((cb) => cb(mockPrisma)),
  };

  const mockMinio: any = {
    uploadRawDocument: mock().mockResolvedValue(undefined),
  };

  const mockConfig: any = {
    get: mock().mockReturnValue('super_secret_jwt_key_32bytes_sample!'),
  };

  beforeEach(() => {
    piiVaultService = new PiiVaultService(mockPrisma, mockConfig);
    authDecisionService = new AuthorizationDecisionService(mockPrisma);
    consentService = new ConsentService(mockPrisma, mockMinio, authDecisionService, piiVaultService);
  });

  it('should authorize valid consent for permitted purpose and category', async () => {
    mockPrisma.consentRecord.findUnique.mockResolvedValue({
      id: 'consent-valid-01',
      subjectIdentifier: 'SUBJ-2026-0001',
      status: 'ACTIVE',
      isActive: true,
      permittedPurposes: ['DOCUMENT_EXTRACTION', 'AI_MODEL_TRAINING'],
      permittedDataCategories: ['RESUME', 'ACADEMIC_CV'],
      permittedProcessingActivities: ['PARSING', 'DEEP_EXTRACTION', 'DATASET_EXPORT'],
      expiresAt: new Date(Date.now() + 86400000), // tomorrow
      withdrawnAt: null,
    });

    const decision = await authDecisionService.evaluateAuthorization({
      consentId: 'consent-valid-01',
      purpose: 'AI_MODEL_TRAINING',
      activity: 'DATASET_EXPORT',
      dataCategory: 'RESUME',
    });

    expect(decision.isAuthorized).toBe(true);
    expect(decision.decisionCode).toBe('PERMITTED');
  });

  it('should deny authorization when purpose is not permitted (Purpose Limitation)', async () => {
    mockPrisma.consentRecord.findUnique.mockResolvedValue({
      id: 'consent-limited-01',
      subjectIdentifier: 'SUBJ-2026-0002',
      status: 'ACTIVE',
      isActive: true,
      permittedPurposes: ['DOCUMENT_EXTRACTION', 'PROFILE_MANAGEMENT'], // NO AI_MODEL_TRAINING
      permittedDataCategories: ['RESUME'],
      permittedProcessingActivities: ['PARSING'],
      expiresAt: new Date(Date.now() + 86400000),
      withdrawnAt: null,
    });

    const decision = await authDecisionService.evaluateAuthorization({
      consentId: 'consent-limited-01',
      purpose: 'AI_MODEL_TRAINING',
      activity: 'DATASET_EXPORT',
      dataCategory: 'RESUME',
    });

    expect(decision.isAuthorized).toBe(false);
    expect(decision.decisionCode).toBe('PURPOSE_NOT_GRANTED');
  });

  it('should deny authorization when consent has expired', async () => {
    mockPrisma.consentRecord.findUnique.mockResolvedValue({
      id: 'consent-expired-01',
      subjectIdentifier: 'SUBJ-2026-0003',
      status: 'ACTIVE',
      isActive: true,
      permittedPurposes: ['DOCUMENT_EXTRACTION'],
      expiresAt: new Date(Date.now() - 86400000), // expired yesterday
      withdrawnAt: null,
    });

    const decision = await authDecisionService.evaluateAuthorization({
      consentId: 'consent-expired-01',
      purpose: 'DOCUMENT_EXTRACTION',
      activity: 'PARSING',
    });

    expect(decision.isAuthorized).toBe(false);
    expect(decision.decisionCode).toBe('CONSENT_EXPIRED');
  });

  it('should deny authorization when consent is withdrawn', async () => {
    mockPrisma.consentRecord.findUnique.mockResolvedValue({
      id: 'consent-withdrawn-01',
      subjectIdentifier: 'SUBJ-2026-0004',
      status: 'WITHDRAWN',
      isActive: false,
      withdrawnAt: new Date(),
    });

    const decision = await authDecisionService.evaluateAuthorization({
      consentId: 'consent-withdrawn-01',
      purpose: 'DOCUMENT_EXTRACTION',
      activity: 'PARSING',
    });

    expect(decision.isAuthorized).toBe(false);
    expect(decision.decisionCode).toBe('CONSENT_WITHDRAWN');
  });

  it('should deny authorization when document category is restricted', async () => {
    mockPrisma.consentRecord.findUnique.mockResolvedValue({
      id: 'consent-cat-01',
      subjectIdentifier: 'SUBJ-2026-0005',
      status: 'ACTIVE',
      isActive: true,
      permittedPurposes: ['DOCUMENT_EXTRACTION'],
      permittedDataCategories: ['TRANSCRIPT'], // Only transcripts, not Resumes
      permittedProcessingActivities: ['PARSING'],
      expiresAt: new Date(Date.now() + 86400000),
    });

    const decision = await authDecisionService.evaluateAuthorization({
      consentId: 'consent-cat-01',
      purpose: 'DOCUMENT_EXTRACTION',
      activity: 'PARSING',
      dataCategory: 'RESUME',
    });

    expect(decision.isAuthorized).toBe(false);
    expect(decision.decisionCode).toBe('CATEGORY_RESTRICTED');
  });

  it('should throw ForbiddenException on enforceAuthorization when unauthorized', async () => {
    mockPrisma.consentRecord.findUnique.mockResolvedValue({
      id: 'consent-cat-02',
      status: 'WITHDRAWN',
      isActive: false,
    });

    await expect(
      authDecisionService.enforceAuthorization({
        consentId: 'consent-cat-02',
        purpose: 'AI_MODEL_TRAINING',
        activity: 'DATASET_EXPORT',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should create immutable consent history and audit trail when revoking consent', async () => {
    mockPrisma.consentRecord.findUnique.mockResolvedValue({
      id: 'consent-revoke-01',
      subjectIdentifier: 'SUBJ-2026-9999',
      status: 'ACTIVE',
      isActive: true,
      documents: [{ id: 'doc-real-1' }, { id: 'doc-real-2' }],
    });
    mockPrisma.consentRecord.update.mockResolvedValue({});

    const result = await consentService.revokeConsent('consent-revoke-01', 'User requested data erasure');

    expect(result.success).toBe(true);
    expect(mockPrisma.consentHistory.create).toHaveBeenCalled();
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
  });
});
