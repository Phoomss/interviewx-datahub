import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SEED_INDUSTRIES,
  SEED_INTERVIEW_CATEGORIES,
  SEED_SENIORITY_LEVELS,
  SEED_SKILL_CATEGORIES,
} from './seed-data';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { CreateInterviewCategoryDto } from './dto/create-interview-category.dto';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class TaxonomyService implements OnModuleInit {
  private readonly logger = new Logger(TaxonomyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedTaxonomyIfEmpty();
  }

  async seedTaxonomyIfEmpty() {
    try {
      const industryCount = await this.prisma.industry.count();
      if (industryCount === 0) {
        this.logger.log('Seeding initial industries and professions...');
        for (const ind of SEED_INDUSTRIES) {
          const createdIndustry = await this.prisma.industry.create({
            data: {
              key: ind.key,
              name: ind.name,
              nameTh: ind.nameTh,
              description: ind.description,
              icon: ind.icon,
              isCustom: false,
            },
          });

          for (const prof of ind.professions) {
            await this.prisma.profession.create({
              data: {
                industryId: createdIndustry.id,
                key: prof.key,
                name: prof.name,
                nameTh: prof.nameTh,
                description: prof.description,
                suggestedSkills: prof.suggestedSkills,
                professionSpecificFields: prof.professionSpecificFields || {},
                isCustom: false,
              },
            });
          }
        }
        this.logger.log('Industries and professions seeded successfully.');
      }

      const catCount = await this.prisma.interviewCategory.count();
      if (catCount === 0) {
        this.logger.log('Seeding interview categories...');
        for (const cat of SEED_INTERVIEW_CATEGORIES) {
          await this.prisma.interviewCategory.create({
            data: {
              key: cat.key,
              name: cat.name,
              nameTh: cat.nameTh,
              description: cat.description,
              subcategories: cat.subcategories,
              isCustom: false,
            },
          });
        }
        this.logger.log('Interview categories seeded successfully.');
      }

      const seniorityCount = await this.prisma.seniorityLevel.count();
      if (seniorityCount === 0) {
        this.logger.log('Seeding seniority levels...');
        for (const sen of SEED_SENIORITY_LEVELS) {
          await this.prisma.seniorityLevel.create({
            data: {
              category: sen.category,
              key: sen.key,
              name: sen.name,
              nameTh: sen.nameTh,
              minYearsExp: sen.minYearsExp,
              maxYearsExp: sen.maxYearsExp,
              isCustom: false,
            },
          });
        }
        this.logger.log('Seniority levels seeded successfully.');
      }

      const skillCatCount = await this.prisma.skillCategory.count();
      if (skillCatCount === 0) {
        this.logger.log('Seeding skill taxonomy...');
        for (const sc of SEED_SKILL_CATEGORIES) {
          const createdCat = await this.prisma.skillCategory.create({
            data: {
              key: sc.key,
              name: sc.name,
              nameTh: sc.nameTh,
            },
          });

          for (const s of sc.skills) {
            await this.prisma.skill.create({
              data: {
                categoryId: createdCat.id,
                name: s.name,
                nameTh: s.nameTh,
                description: s.description || '',
                proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                isCustom: false,
              },
            });
          }
        }
        this.logger.log('Skill taxonomy seeded successfully.');
      }
    } catch (err: any) {
      this.logger.error(`Error during taxonomy seeding: ${err.message}`, err.stack);
    }
  }

  async getAllTaxonomy() {
    const [industries, interviewCategories, seniorityLevels, skillCategories] = await Promise.all([
      this.prisma.industry.findMany({
        include: {
          professions: {
            orderBy: { name: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.interviewCategory.findMany({
        orderBy: { name: 'asc' },
      }),
      this.prisma.seniorityLevel.findMany({
        orderBy: { minYearsExp: 'asc' },
      }),
      this.prisma.skillCategory.findMany({
        include: {
          skills: {
            orderBy: { name: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      industries,
      interviewCategories,
      seniorityLevels,
      skillCategories,
    };
  }

  async getIndustries() {
    return this.prisma.industry.findMany({
      include: {
        professions: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createIndustry(dto: CreateIndustryDto) {
    return this.prisma.industry.create({
      data: {
        key: dto.key.toLowerCase().trim().replace(/\s+/g, '_'),
        name: dto.name,
        nameTh: dto.nameTh,
        description: dto.description,
        icon: dto.icon || 'Folder',
        isCustom: true,
      },
      include: {
        professions: true,
      },
    });
  }

  async getProfessions(industryIdOrKey?: string) {
    if (!industryIdOrKey) {
      return this.prisma.profession.findMany({
        include: { industry: true },
        orderBy: { name: 'asc' },
      });
    }

    return this.prisma.profession.findMany({
      where: {
        OR: [
          { industryId: industryIdOrKey },
          { industry: { key: industryIdOrKey } },
        ],
      },
      include: { industry: true },
      orderBy: { name: 'asc' },
    });
  }

  async createProfession(dto: CreateProfessionDto) {
    // Resolve industryId by ID or Key
    let industry = await this.prisma.industry.findFirst({
      where: {
        OR: [
          { id: dto.industryId },
          { key: dto.industryId },
        ],
      },
    });

    if (!industry) {
      throw new Error(`Industry with ID or key '${dto.industryId}' not found.`);
    }

    return this.prisma.profession.create({
      data: {
        industryId: industry.id,
        key: dto.key.toLowerCase().trim().replace(/\s+/g, '_'),
        name: dto.name,
        nameTh: dto.nameTh,
        description: dto.description,
        suggestedSkills: dto.suggestedSkills || [],
        professionSpecificFields: dto.professionSpecificFields || {},
        isCustom: true,
      },
      include: {
        industry: true,
      },
    });
  }

  async getInterviewCategories() {
    return this.prisma.interviewCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createInterviewCategory(dto: CreateInterviewCategoryDto) {
    return this.prisma.interviewCategory.create({
      data: {
        key: dto.key.toLowerCase().trim().replace(/\s+/g, '_'),
        name: dto.name,
        nameTh: dto.nameTh,
        description: dto.description,
        subcategories: dto.subcategories || [],
        isCustom: true,
      },
    });
  }

  async getSeniorityLevels(category?: string) {
    return this.prisma.seniorityLevel.findMany({
      where: category ? { category } : undefined,
      orderBy: { minYearsExp: 'asc' },
    });
  }

  async getSkillCategories() {
    return this.prisma.skillCategory.findMany({
      include: {
        skills: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createSkill(dto: CreateSkillDto) {
    let cat = await this.prisma.skillCategory.findFirst({
      where: {
        OR: [
          { id: dto.categoryId },
          { key: dto.categoryId },
        ],
      },
    });

    if (!cat) {
      throw new Error(`Skill category '${dto.categoryId}' not found.`);
    }

    return this.prisma.skill.create({
      data: {
        categoryId: cat.id,
        name: dto.name,
        nameTh: dto.nameTh,
        description: dto.description,
        proficiencyLevels: dto.proficiencyLevels || ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        isCustom: true,
      },
      include: {
        category: true,
      },
    });
  }
}
