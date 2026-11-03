import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { TrainingEligibilityService } from './training-eligibility.service';
import { AuthorizationDecisionService } from '../consent/authorization-decision.service';

describe('TrainingEligibilityService - Model Training Gatekeeper', () => {
  let service: TrainingEligibilityService;

  const mockPrisma: any = {
    document: {
      findUnique: mock(),
      update: mock().mockResolvedValue({}),
      findMany: mock().mockResolvedValue([]),
    },
    consentRecord: {
      findUnique: mock(),
    },
    processingAuthorizationLog: {
      create: mock().mockResolvedValue({}),
    },
  };

  beforeEach(() => {
    const authService = new AuthorizationDecisionService(mockPrisma);
    service = new TrainingEligibilityService(mockPrisma, authService);
  });

  it('should approve synthetic data for model training automatically', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({
      id: 'doc-synth-01',
      isSynthetic: true,
      status: 'PARSED',
    });

    const res = await service.evaluateEligibility('doc-synth-01');
    expect(res.isEligibleForTraining).toBe(true);
    expect(res.status).toBe('APPROVED_FOR_TRAINING');
  });

  it('should restrict real document if Consent ID is missing', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({
      id: 'doc-real-no-consent',
      isSynthetic: false,
      consentId: null,
      consent: null,
    });

    const res = await service.evaluateEligibility('doc-real-no-consent');
    expect(res.isEligibleForTraining).toBe(false);
    expect(res.status).toBe('RESTRICTED');
  });

  it('should restrict document if consent has been withdrawn', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({
      id: 'doc-real-revoked',
      isSynthetic: false,
      consentId: 'consent-revoked',
      consent: {
        id: 'consent-revoked',
        status: 'WITHDRAWN',
        isActive: false,
        withdrawnAt: new Date(),
      },
    });

    const res = await service.evaluateEligibility('doc-real-revoked');
    expect(res.isEligibleForTraining).toBe(false);
    expect(res.status).toBe('CONSENT_WITHDRAWN');
  });

  it('should approve for Profile Management but NOT for AI Training when training purpose is absent', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({
      id: 'doc-profile-only',
      isSynthetic: false,
      consentId: 'consent-profile-only',
      consent: {
        id: 'consent-profile-only',
        status: 'ACTIVE',
        isActive: true,
        permittedPurposes: ['DOCUMENT_EXTRACTION', 'PROFILE_MANAGEMENT'], // No AI_MODEL_TRAINING
      },
      status: 'APPROVED',
      reviews: [{ status: 'APPROVED' }],
    });

    const res = await service.evaluateEligibility('doc-profile-only');
    expect(res.isEligibleForProfileManagement).toBe(true);
    expect(res.isEligibleForTraining).toBe(false);
    expect(res.status).toBe('APPROVED_FOR_PROFILE_MANAGEMENT');
  });

  it('should require Human Review before approving real document for AI Training', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({
      id: 'doc-needs-review',
      isSynthetic: false,
      consentId: 'consent-training',
      consent: {
        id: 'consent-training',
        status: 'ACTIVE',
        isActive: true,
        permittedPurposes: ['AI_MODEL_TRAINING', 'DOCUMENT_EXTRACTION'],
      },
      status: 'PARSED', // NOT yet approved by human
      reviews: [],
    });

    const res = await service.evaluateEligibility('doc-needs-review');
    expect(res.isEligibleForTraining).toBe(false);
    expect(res.status).toBe('AWAITING_REVIEW');
  });

  it('should approve for AI Training when consent includes training, human approved, and quality passes', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({
      id: 'doc-ready-for-training',
      isSynthetic: false,
      consentId: 'consent-training-full',
      consent: {
        id: 'consent-training-full',
        status: 'ACTIVE',
        isActive: true,
        permittedPurposes: ['AI_MODEL_TRAINING', 'DOCUMENT_EXTRACTION', 'PROFILE_MANAGEMENT'],
      },
      status: 'APPROVED',
      reviews: [{ status: 'APPROVED' }],
      qualityValidation: { overallScore: 0.92 },
    });

    const res = await service.evaluateEligibility('doc-ready-for-training');
    expect(res.isEligibleForTraining).toBe(true);
    expect(res.status).toBe('APPROVED_FOR_TRAINING');
  });
});
