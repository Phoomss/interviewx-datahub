import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { ReviewActionStatus } from './dto/submit-review.dto';

describe('DocumentsService - Ingestion, Review & PDPA Compliance', () => {
  let service: DocumentsService;
  const mockPrisma: any = {
    document: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    consentRecord: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
  };
  const mockStorage: any = {
    uploadRawDocument: jest.fn().mockResolvedValue(undefined),
    getRawDocumentStream: jest.fn(),
  };
  const mockConfig: any = {
    get: jest.fn().mockReturnValue(''),
  };

  beforeEach(() => {
    service = new DocumentsService(mockPrisma, mockStorage, mockConfig);
  });

  it('should throw BadRequestException if real data is uploaded without Consent ID (PDPA)', async () => {
    await expect(
      service.uploadDocument(
        { fileName: 'candidate.pdf', buffer: Buffer.from('dummy') },
        'REAL_AUTHORIZED',
        undefined, // missing consent ID
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if buffer is empty or missing', async () => {
    await expect(
      service.uploadDocument(
        { fileName: 'candidate.pdf', buffer: Buffer.alloc(0) },
        'SYNTHETIC',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update status and review corrections in memory and database', async () => {
    const docId = 'doc-001-demo';
    const reviewResult = await service.submitReview(docId, {
      status: ReviewActionStatus.APPROVED,
      corrections: { skills: ['Updated Skill'] },
      reviewNotes: 'Verified by reviewer',
    });

    expect(reviewResult.success).toBe(true);
    expect(reviewResult.data.status).toBe(ReviewActionStatus.APPROVED);

    const updatedDoc = await service.findOne(docId);
    expect(updatedDoc.data.status).toBe(ReviewActionStatus.APPROVED);
  });

  it('should soft-delete document when remove() is called', async () => {
    const docId = 'doc-001-demo';
    const res = await service.remove(docId);
    expect(res.success).toBe(true);
  });

  it('should clear synthetic documents when clearSyntheticDocuments() is called', async () => {
    const res = await service.clearSyntheticDocuments(false);
    expect(res.success).toBe(true);
  });
});
