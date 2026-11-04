import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { TaxonomyService } from './taxonomy.service';
import { SEED_INDUSTRIES, SEED_CROSS_INDUSTRY_MAPPINGS, SEED_CONTEXT_FORMAT_MAPPINGS } from './seed-data';

describe('TaxonomyService - Multi-Industry & Dynamic Professions', () => {
  let service: TaxonomyService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      industry: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'ind-1', ...args.data })),
        update: mock((args: any) => Promise.resolve({ id: args.where.id, ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'ind-1', key: 'healthcare', name: 'Healthcare & Medical', professions: [] }])),
        findFirst: mock((args: any) => Promise.resolve({ id: 'ind-1', key: 'healthcare', name: 'Healthcare & Medical' })),
        findUnique: mock((args: any) => Promise.resolve(null)),
      },
      profession: {
        create: mock((args: any) => Promise.resolve({ id: 'prof-1', ...args.data })),
        update: mock((args: any) => Promise.resolve({ id: args.where.id, ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'prof-1', key: 'medical_doctor', name: 'Medical Doctor' }])),
        findFirst: mock(() => Promise.resolve({
          id: 'prof-1',
          key: 'medical_doctor',
          name: 'Medical Doctor',
          professionSkills: [{ skill: { id: 's-1', name: 'Diagnosis' }, isCore: true, relevance: 1.0 }],
        })),
        findUnique: mock((args: any) => Promise.resolve(null)),
      },
      industryProfession: {
        findUnique: mock(() => Promise.resolve(null)),
        create: mock((args: any) => Promise.resolve({ id: 'ip-1', ...args.data })),
        upsert: mock((args: any) => Promise.resolve({ id: 'ip-1', ...args.create })),
      },
      professionSkill: {
        findUnique: mock(() => Promise.resolve(null)),
        create: mock((args: any) => Promise.resolve({ id: 'ps-1', ...args.data })),
        upsert: mock((args: any) => Promise.resolve({ id: 'ps-1', ...args.create })),
      },
      professionInterviewCategory: {
        findUnique: mock(() => Promise.resolve(null)),
        create: mock((args: any) => Promise.resolve({ id: 'pic-1', ...args.data })),
        upsert: mock((args: any) => Promise.resolve({ id: 'pic-1', ...args.create })),
      },
      interviewCategoryFormat: {
        findUnique: mock(() => Promise.resolve(null)),
        create: mock((args: any) => Promise.resolve({ id: 'icf-1', ...args.data })),
        upsert: mock((args: any) => Promise.resolve({ id: 'icf-1', ...args.create })),
      },
      interviewCategory: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'cat-1', ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'cat-1', key: 'job', name: 'Job Interview' }])),
        findFirst: mock(() => Promise.resolve({
          id: 'cat-1',
          key: 'job',
          categoryFormats: [{ interviewFormat: { id: 'fmt-1', key: 'behavioral', name: 'Behavioral' } }],
        })),
        findUnique: mock(() => Promise.resolve(null)),
      },
      interviewFormat: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'fmt-1', ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'fmt-1', key: 'behavioral', name: 'Behavioral Interview' }])),
        findFirst: mock(() => Promise.resolve({ id: 'fmt-1', key: 'behavioral', name: 'Behavioral Interview' })),
        findUnique: mock(() => Promise.resolve(null)),
      },
      seniorityLevel: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'sen-1', ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 'sen-1', category: 'career', name: 'Senior' }])),
        findUnique: mock(() => Promise.resolve(null)),
      },
      skillCategory: {
        count: mock(() => Promise.resolve(0)),
        create: mock((args: any) => Promise.resolve({ id: 'sc-1', ...args.data })),
        findMany: mock(() => Promise.resolve([])),
        findUnique: mock(() => Promise.resolve(null)),
      },
      skill: {
        create: mock((args: any) => Promise.resolve({ id: 's-1', ...args.data })),
        update: mock((args: any) => Promise.resolve({ id: args.where.id, ...args.data })),
        findMany: mock(() => Promise.resolve([{ id: 's-1', name: 'Diagnosis' }])),
        findFirst: mock(() => Promise.resolve({ id: 's-1', name: 'Diagnosis' })),
        findUnique: mock(() => Promise.resolve(null)),
      },
    };

    service = new TaxonomyService(mockPrisma);
  });

  it('should seed industries, professions and M:N relations', async () => {
    await service.seedTaxonomyIfEmpty();
    expect(mockPrisma.industry.create).toHaveBeenCalled();
    expect(mockPrisma.profession.create).toHaveBeenCalled();
    expect(mockPrisma.industryProfession.create).toHaveBeenCalled();
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
    expect(mockPrisma.industryProfession.create).toHaveBeenCalled();
  });

  it('should link profession to additional industry (Many-to-Many)', async () => {
    const result = await service.linkIndustryProfession({
      professionKey: 'prof-1',
      industryKey: 'ind-1',
      isPrimary: false,
    });
    expect(result).toBeDefined();
    expect(mockPrisma.industryProfession.upsert).toHaveBeenCalled();
  });

  it('should link profession to skill (Many-to-Many)', async () => {
    const result = await service.linkProfessionSkill({
      professionKey: 'prof-1',
      skillIdentifier: 'Diagnosis',
      isCore: true,
      relevance: 1.0,
    });
    expect(result).toBeDefined();
    expect(mockPrisma.professionSkill.upsert).toHaveBeenCalled();
  });

  it('should link profession to interview context', async () => {
    const result = await service.linkProfessionContext({
      professionKey: 'prof-1',
      categoryKey: 'job',
      relevance: 1.0,
    });
    expect(result).toBeDefined();
    expect(mockPrisma.professionInterviewCategory.upsert).toHaveBeenCalled();
  });

  it('should link context to format', async () => {
    const result = await service.linkContextFormat({
      categoryKey: 'job',
      formatKey: 'behavioral',
    });
    expect(result).toBeDefined();
    expect(mockPrisma.interviewCategoryFormat.upsert).toHaveBeenCalled();
  });

  it('should retrieve skills by profession and formats by context', async () => {
    const skills = await service.getSkillsByProfession('prof-1');
    expect(skills.length).toBeGreaterThan(0);
    expect(skills[0].name).toBe('Diagnosis');

    const formats = await service.getFormatsByContext('job');
    expect(formats.length).toBeGreaterThan(0);
    expect(formats[0].key).toBe('behavioral');
  });

  it('should retrieve all taxonomy aggregated entities with M:N structures', async () => {
    const result = await service.getAllTaxonomy();
    expect(result.industries).toBeDefined();
    expect(result.interviewCategories).toBeDefined();
    expect(result.interviewFormats).toBeDefined();
    expect(result.seniorityLevels).toBeDefined();
    expect(result.skillCategories).toBeDefined();
  });

  it('should have all 15 mandatory industries and required taxonomies in seed data', () => {
    expect(SEED_INDUSTRIES.length).toBeGreaterThanOrEqual(15);
    const requiredIndustryKeys = [
      'tech',
      'finance',
      'healthcare',
      'engineering',
      'business',
      'education',
      'legal_gov',
      'design_media',
      'hospitality',
      'science_research',
      'agriculture_food',
      'logistics_supply',
      'architecture_const',
      'environment_energy',
      'social_nonprofit',
    ];
    for (const key of requiredIndustryKeys) {
      const found = SEED_INDUSTRIES.find((ind) => ind.key === key);
      expect(found).toBeDefined();
      expect(found?.professions.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('should have cross-industry mappings and context-format mappings configured', () => {
    expect(SEED_CROSS_INDUSTRY_MAPPINGS.length).toBeGreaterThanOrEqual(10);
    expect(SEED_CONTEXT_FORMAT_MAPPINGS.length).toBeGreaterThanOrEqual(10);
  });

  it('should soft delete industry and set deletedAt with version increment', async () => {
    const res = await service.softDeleteIndustry('healthcare');
    expect(res).toBeDefined();
    expect(mockPrisma.industry.update).toHaveBeenCalled();
  });

  it('should soft delete profession and set deletedAt with version increment', async () => {
    const res = await service.softDeleteProfession('medical_doctor');
    expect(res).toBeDefined();
    expect(mockPrisma.profession.update).toHaveBeenCalled();
  });

  it('should update profession and increment version', async () => {
    const res = await service.updateProfession('medical_doctor', {
      name: 'Senior Medical Doctor',
    });
    expect(res).toBeDefined();
    expect(mockPrisma.profession.update).toHaveBeenCalled();
  });

  it('should soft delete skill and set deletedAt with version increment', async () => {
    const res = await service.softDeleteSkill('Diagnosis');
    expect(res).toBeDefined();
    expect(mockPrisma.skill.update).toHaveBeenCalled();
  });
});
