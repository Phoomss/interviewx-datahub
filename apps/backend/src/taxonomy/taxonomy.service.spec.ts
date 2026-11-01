import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { TaxonomyService } from './taxonomy.service';
import { SEED_INDUSTRIES, SEED_INTERVIEW_CATEGORIES } from './seed-data';

describe('TaxonomyService - Multi-Industry & Dynamic Professions', () => {
  let service: TaxonomyService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      industry: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'ind-1', ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'ind-1', key: 'healthcare', name: 'Healthcare & Medical', professions: [] }])),
        findFirst: mock((args: any) => Promise.resolve({ id: 'ind-1', key: 'healthcare', name: 'Healthcare & Medical' })),
      },
      profession: {
        create: mock((args: any) => Promise.resolve({ id: 'prof-1', ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'prof-1', key: 'medical_doctor', name: 'Medical Doctor' }])),
        findFirst: mock(() => Promise.resolve({ id: 'prof-1', key: 'medical_doctor', name: 'Medical Doctor' })),
      },
      interviewCategory: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'cat-1', ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'cat-1', key: 'job', name: 'Job Interview' }])),
      },
      seniorityLevel: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'sen-1', ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'sen-1', category: 'career', name: 'Senior' }])),
      },
      skillCategory: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'sc-1', ...args.data })),
        findMany: mock(() => Promise.resolve([])),
      },
      skill: {
        create: mock((args: any) => Promise.resolve({ id: 's-1', ...args.data })),
      },
    };

    service = new TaxonomyService(mockPrisma);
  });

  it('should seed industries and professions when count is 0', async () => {
    await service.seedTaxonomyIfEmpty();
    expect(mockPrisma.industry.create).toHaveBeenCalled();
    expect(mockPrisma.profession.create).toHaveBeenCalled();
  });

  it('should create custom industry dynamically', async () => {
    const created = await service.createIndustry({
      key: 'biotech',
      name: 'Biotechnology',
      nameTh: 'เทคโนโลยีชีวภาพ',
      description: 'Life sciences and drug discovery',
    });
    expect(created.name).toBe('Biotechnology');
    expect(mockPrisma.industry.create).toHaveBeenCalled();
  });

  it('should create custom profession dynamically linked to industry', async () => {
    const created = await service.createProfession({
      industryId: 'healthcare',
      key: 'robotic_surgeon',
      name: 'Robotic Surgeon',
      nameTh: 'ศัลยแพทย์หุ่นยนต์',
      suggestedSkills: ['Da Vinci Surgical System', 'Laparoscopy'],
    });
    expect(created.name).toBe('Robotic Surgeon');
    expect(mockPrisma.profession.create).toHaveBeenCalled();
  });

  it('should retrieve all taxonomy aggregated entities', async () => {
    const result = await service.getAllTaxonomy();
    expect(result.industries).toBeDefined();
    expect(result.interviewCategories).toBeDefined();
    expect(result.seniorityLevels).toBeDefined();
    expect(result.skillCategories).toBeDefined();
  });
});
