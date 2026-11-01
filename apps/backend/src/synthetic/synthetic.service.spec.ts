import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { SyntheticService } from './synthetic.service';

describe('SyntheticService - Universal Multi-Industry Generator', () => {
  let service: SyntheticService;
  let mockPrisma: any;
  let mockConfig: any;
  let mockDocsService: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findFirst: mock(() => Promise.resolve({ id: 'user-admin', email: 'admin@interviewx.ai' })),
        create: mock((args: any) => Promise.resolve({ id: 'user-admin', ...args.data })),
      },
      industry: {
        findFirst: mock(() => Promise.resolve({ id: 'ind-1', key: 'healthcare', name: 'Healthcare & Medical' })),
      },
      profession: {
        findFirst: mock(() => Promise.resolve({ id: 'prof-1', key: 'medical_doctor', name: 'Medical Doctor', suggestedSkills: ['Clinical Care'] })),
      },
      syntheticJob: {
        create: mock((args: any) => Promise.resolve({ id: 'job-1', ...args.data })),
        update: mock((args: any) => Promise.resolve({ id: 'job-1', ...args.data })),
        findMany: mock(() => Promise.resolve([])),
        findUnique: mock(() => Promise.resolve(null)),
      },
      datasetRecord: {
        create: mock((args: any) => Promise.resolve({ id: 'rec-1', ...args.data })),
        findMany: mock(() => Promise.resolve([])),
        count: mock(() => Promise.resolve(0)),
        findUnique: mock(() => Promise.resolve(null)),
        update: mock((args: any) => Promise.resolve({ id: 'rec-1', ...args.data })),
      },
      document: {
        create: mock((args: any) => Promise.resolve({ id: 'doc-1', ...args.data })),
      },
    };

    mockConfig = {
      get: mock((key: string, defaultVal: string) => defaultVal),
    };

    mockDocsService = {
      inMemoryDocs: [],
    };

    service = new SyntheticService(mockPrisma, mockConfig, mockDocsService);
  });

  it('should list dataset records with filters and pagination', async () => {
    const res = await service.listDatasetRecords({
      datasetType: 'profile',
      page: 1,
      limit: 10,
    });
    expect(res.page).toBe(1);
    expect(res.limit).toBe(10);
    expect(mockPrisma.datasetRecord.findMany).toHaveBeenCalled();
  });

  it('should update dataset record quality review status (Human-in-the-loop)', async () => {
    mockPrisma.datasetRecord.update = mock(() => Promise.resolve({
      id: 'rec-1',
      qualityStatus: 'VERIFIED',
      validationResult: { qualityStatus: 'VERIFIED', reviewNotes: 'Approved by clinical specialist' },
    }));

    const updated = await service.updateDatasetRecordQuality('rec-1', {
      qualityStatus: 'VERIFIED',
      reviewNotes: 'Approved by clinical specialist',
    });

    expect(updated.qualityStatus).toBe('VERIFIED');
    expect(mockPrisma.datasetRecord.update).toHaveBeenCalled();
  });
});
