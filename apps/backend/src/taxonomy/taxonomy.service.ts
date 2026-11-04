import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SEED_INDUSTRIES,
  SEED_INTERVIEW_CATEGORIES,
  SEED_INTERVIEW_FORMATS,
  SEED_SENIORITY_LEVELS,
  SEED_SKILL_CATEGORIES,
  SEED_CROSS_INDUSTRY_MAPPINGS,
  SEED_CONTEXT_FORMAT_MAPPINGS,
} from './seed-data';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { CreateInterviewCategoryDto } from './dto/create-interview-category.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import {
  LinkIndustryProfessionDto,
  LinkProfessionSkillDto,
  LinkProfessionContextDto,
  LinkContextFormatDto,
} from './dto/taxonomy-relation.dto';

@Injectable()
export class TaxonomyService implements OnModuleInit {
  private readonly logger = new Logger(TaxonomyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedTaxonomyIfEmpty();
  }

  async seedTaxonomyIfEmpty() {
    try {
      this.logger.log('Starting Universal Taxonomy & Many-to-Many Ontology sync...');

      // 1. Sync & Upsert Industries & Primary Professions
      for (const ind of SEED_INDUSTRIES) {
        let dbIndustry = await this.prisma.industry.findUnique({
          where: { key: ind.key },
        });

        if (!dbIndustry) {
          dbIndustry = await this.prisma.industry.create({
            data: {
              key: ind.key,
              name: ind.name,
              nameTh: ind.nameTh,
              description: ind.description,
              icon: ind.icon,
              isCustom: false,
            },
          });
        }

        for (const prof of ind.professions) {
          let dbProf = await this.prisma.profession.findUnique({
            where: { key: prof.key },
          });

          if (!dbProf) {
            dbProf = await this.prisma.profession.create({
              data: {
                industryId: dbIndustry.id,
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

          // Link primary relation in IndustryProfession join table
          if (this.prisma.industryProfession) {
            const existingLink = await this.prisma.industryProfession.findUnique({
              where: {
                industryId_professionId: {
                  industryId: dbIndustry.id,
                  professionId: dbProf.id,
                },
              },
            });
            if (!existingLink) {
              await this.prisma.industryProfession.create({
                data: {
                  industryId: dbIndustry.id,
                  professionId: dbProf.id,
                  isPrimary: true,
                },
              });
            }
          }
        }
      }

      // 2. Cross-Industry Many-to-Many Associations
      if (this.prisma.industryProfession) {
        for (const mapping of SEED_CROSS_INDUSTRY_MAPPINGS) {
          const dbProf = await this.prisma.profession.findUnique({
            where: { key: mapping.professionKey },
          });
          if (!dbProf) continue;

          for (const indKey of mapping.industryKeys) {
            const dbInd = await this.prisma.industry.findUnique({
              where: { key: indKey },
            });
            if (!dbInd) continue;

            const existingLink = await this.prisma.industryProfession.findUnique({
              where: {
                industryId_professionId: {
                  industryId: dbInd.id,
                  professionId: dbProf.id,
                },
              },
            });
            if (!existingLink) {
              await this.prisma.industryProfession.create({
                data: {
                  industryId: dbInd.id,
                  professionId: dbProf.id,
                  isPrimary: false,
                },
              });
            }
          }
        }
      }

      // 3. Interview Categories (16 Contexts)
      for (const cat of SEED_INTERVIEW_CATEGORIES) {
        const existingCat = await this.prisma.interviewCategory.findUnique({
          where: { key: cat.key },
        });
        if (!existingCat) {
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
      }

      // 4. Interview Formats (15 Formats)
      if (this.prisma.interviewFormat) {
        for (const fmt of SEED_INTERVIEW_FORMATS) {
          const existingFmt = await this.prisma.interviewFormat.findUnique({
            where: { key: fmt.key },
          });
          if (!existingFmt) {
            await this.prisma.interviewFormat.create({
              data: {
                key: fmt.key,
                name: fmt.name,
                nameTh: fmt.nameTh,
                description: fmt.description,
                isCustom: false,
              },
            });
          }
        }
      }

      // 5. Context to Format Many-to-Many Associations
      if (this.prisma.interviewCategoryFormat) {
        for (const map of SEED_CONTEXT_FORMAT_MAPPINGS) {
          const dbCat = await this.prisma.interviewCategory.findUnique({
            where: { key: map.categoryKey },
          });
          if (!dbCat) continue;

          for (const fmtKey of map.formatKeys) {
            const dbFmt = await this.prisma.interviewFormat.findUnique({
              where: { key: fmtKey },
            });
            if (!dbFmt) continue;

            const existing = await this.prisma.interviewCategoryFormat.findUnique({
              where: {
                interviewCategoryId_interviewFormatId: {
                  interviewCategoryId: dbCat.id,
                  interviewFormatId: dbFmt.id,
                },
              },
            });
            if (!existing) {
              await this.prisma.interviewCategoryFormat.create({
                data: {
                  interviewCategoryId: dbCat.id,
                  interviewFormatId: dbFmt.id,
                },
              });
            }
          }
        }
      }

      // 6. Seniority Levels (20 Tiers)
      for (const sen of SEED_SENIORITY_LEVELS) {
        const existingSen = await this.prisma.seniorityLevel.findUnique({
          where: { key: sen.key },
        });
        if (!existingSen) {
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
      }

      // 7. Skill Categories (15 Domains) & Skills
      for (const sc of SEED_SKILL_CATEGORIES) {
        let dbCat = await this.prisma.skillCategory.findUnique({
          where: { key: sc.key },
        });
        if (!dbCat) {
          dbCat = await this.prisma.skillCategory.create({
            data: {
              key: sc.key,
              name: sc.name,
              nameTh: sc.nameTh,
            },
          });
        }

        for (const s of sc.skills) {
          const existingSkill = await this.prisma.skill.findUnique({
            where: {
              categoryId_name: {
                categoryId: dbCat.id,
                name: s.name,
              },
            },
          });
          if (!existingSkill) {
            await this.prisma.skill.create({
              data: {
                categoryId: dbCat.id,
                name: s.name,
                nameTh: s.nameTh,
                description: s.description || '',
                proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                isCustom: false,
              },
            });
          }
        }
      }

      // 8. Profession to Skills Many-to-Many Associations
      if (this.prisma.professionSkill) {
        const allProfs = await this.prisma.profession.findMany({
          select: { id: true, suggestedSkills: true },
        });
        const allSkills = await this.prisma.skill.findMany({
          select: { id: true, name: true },
        });
        const skillNameMap = new Map(allSkills.map((sk) => [sk.name.toLowerCase().trim(), sk.id]));

        for (const p of allProfs) {
          const suggested = Array.isArray(p.suggestedSkills) ? p.suggestedSkills : [];
          for (const sName of suggested) {
            const skillId = skillNameMap.get(String(sName).toLowerCase().trim());
            if (skillId) {
              const existing = await this.prisma.professionSkill.findUnique({
                where: {
                  professionId_skillId: {
                    professionId: p.id,
                    skillId: skillId,
                  },
                },
              });
              if (!existing) {
                await this.prisma.professionSkill.create({
                  data: {
                    professionId: p.id,
                    skillId: skillId,
                    isCore: true,
                    relevance: 1.0,
                  },
                });
              }
            }
          }
        }
      }

      // 9. Profession to Interview Contexts Many-to-Many Associations
      if (this.prisma.professionInterviewCategory) {
        const allProfs = await this.prisma.profession.findMany({
          select: { id: true, key: true },
        });
        const allCats = await this.prisma.interviewCategory.findMany({
          select: { id: true, key: true },
        });
        const catMap = new Map(allCats.map((c) => [c.key, c.id]));

        for (const p of allProfs) {
          const targetContexts = ['job', 'internship', 'career_promotion', 'general_competency'];

          if (
            ['academic_researcher', 'university_lecturer', 'research_assistant', 'teaching_assistant', 'medical_researcher'].includes(
              p.key
            )
          ) {
            targetContexts.push(
              'research_position',
              'research_proposal_defense',
              'thesis_defense',
              'dissertation_defense',
              'scholarship',
              'fellowship'
            );
          }
          if (
            ['physician', 'nurse', 'pharmacist', 'civil_engineer', 'electrical_engineer', 'auditor', 'lawyer'].includes(
              p.key
            )
          ) {
            targetContexts.push('professional_certification');
          }
          if (['product_manager', 'hospital_administrator', 'financial_controller'].includes(p.key)) {
            targetContexts.push('leadership_assessment');
          }

          for (const cKey of targetContexts) {
            const cId = catMap.get(cKey);
            if (cId) {
              const existing = await this.prisma.professionInterviewCategory.findUnique({
                where: {
                  professionId_interviewCategoryId: {
                    professionId: p.id,
                    interviewCategoryId: cId,
                  },
                },
              });
              if (!existing) {
                await this.prisma.professionInterviewCategory.create({
                  data: {
                    professionId: p.id,
                    interviewCategoryId: cId,
                    relevance: 1.0,
                  },
                });
              }
            }
          }
        }
      }

      this.logger.log('Universal Taxonomy & Many-to-Many Ontology sync completed successfully.');
    } catch (err: any) {
      this.logger.error(`Error during taxonomy seeding: ${err.message}`, err.stack);
    }
  }

  async getAllTaxonomy() {
    let interviewFormats: any[] = [];
    try {
      if (this.prisma.interviewFormat) {
        interviewFormats = await this.prisma.interviewFormat.findMany({
          orderBy: { name: 'asc' },
        });
      }
    } catch {
      interviewFormats = SEED_INTERVIEW_FORMATS;
    }
    if (!interviewFormats || interviewFormats.length === 0) {
      interviewFormats = SEED_INTERVIEW_FORMATS;
    }

    const [industries, interviewCategories, seniorityLevels, skillCategories] = await Promise.all([
      this.prisma.industry.findMany({
        include: {
          professions: {
            orderBy: { name: 'asc' },
          },
          industryProfessions: {
            include: {
              profession: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.interviewCategory.findMany({
        include: {
          categoryFormats: {
            include: {
              interviewFormat: true,
            },
          },
        },
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
      interviewFormats,
      seniorityLevels,
      skillCategories,
    };
  }

  async getIndustries() {
    return this.prisma.industry.findMany({
      where: { deletedAt: null },
      include: {
        professions: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
        industryProfessions: {
          include: {
            profession: true,
          },
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
        include: {
          industry: true,
          industryProfessions: {
            include: { industry: true },
          },
        },
        orderBy: { name: 'asc' },
      });
    }

    return this.prisma.profession.findMany({
      where: {
        OR: [
          { industryId: industryIdOrKey },
          { industry: { key: industryIdOrKey } },
          {
            industryProfessions: {
              some: {
                OR: [
                  { industryId: industryIdOrKey },
                  { industry: { key: industryIdOrKey } },
                ],
              },
            },
          },
        ],
      },
      include: {
        industry: true,
        industryProfessions: {
          include: { industry: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getProfessionsByIndustry(industryIdOrKey: string) {
    return this.getProfessions(industryIdOrKey);
  }

  async getProfessionsByContext(categoryIdOrKey: string) {
    return this.prisma.profession.findMany({
      where: {
        interviewCategories: {
          some: {
            OR: [
              { interviewCategoryId: categoryIdOrKey },
              { interviewCategory: { key: categoryIdOrKey } },
            ],
          },
        },
      },
      include: {
        industry: true,
        interviewCategories: {
          include: { interviewCategory: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getSkillsByProfession(professionIdOrKey: string) {
    const prof = await this.prisma.profession.findFirst({
      where: {
        OR: [{ id: professionIdOrKey }, { key: professionIdOrKey }],
      },
      include: {
        professionSkills: {
          include: { skill: true },
        },
      },
    });

    if (!prof) {
      throw new NotFoundException(`Profession '${professionIdOrKey}' not found.`);
    }

    return prof.professionSkills.map((ps) => ({
      ...ps.skill,
      isCore: ps.isCore,
      relevance: ps.relevance,
    }));
  }

  async getFormatsByContext(categoryIdOrKey: string) {
    const cat = await this.prisma.interviewCategory.findFirst({
      where: {
        OR: [{ id: categoryIdOrKey }, { key: categoryIdOrKey }],
      },
      include: {
        categoryFormats: {
          include: { interviewFormat: true },
        },
      },
    });

    if (!cat) {
      throw new NotFoundException(`Interview category '${categoryIdOrKey}' not found.`);
    }

    return cat.categoryFormats.map((cf) => cf.interviewFormat);
  }

  async createProfession(dto: CreateProfessionDto) {
    // Resolve primary industry
    let industry = await this.prisma.industry.findFirst({
      where: {
        OR: [{ id: dto.industryId }, { key: dto.industryId }],
      },
    });

    if (!industry) {
      throw new Error(`Industry with ID or key '${dto.industryId}' not found.`);
    }

    const cleanKey = dto.key.toLowerCase().trim().replace(/\s+/g, '_');

    const createdProf = await this.prisma.profession.create({
      data: {
        industryId: industry.id,
        key: cleanKey,
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

    // Create primary IndustryProfession link
    if (this.prisma.industryProfession) {
      await this.prisma.industryProfession.create({
        data: {
          industryId: industry.id,
          professionId: createdProf.id,
          isPrimary: true,
        },
      });

      // Handle additional industries if provided
      if (Array.isArray(dto.additionalIndustryIds)) {
        for (const addId of dto.additionalIndustryIds) {
          const addInd = await this.prisma.industry.findFirst({
            where: { OR: [{ id: addId }, { key: addId }] },
          });
          if (addInd && addInd.id !== industry.id) {
            await this.prisma.industryProfession.create({
              data: {
                industryId: addInd.id,
                professionId: createdProf.id,
                isPrimary: false,
              },
            });
          }
        }
      }
    }

    return createdProf;
  }

  async linkIndustryProfession(dto: LinkIndustryProfessionDto) {
    const prof = await this.prisma.profession.findFirst({
      where: { OR: [{ id: dto.professionKey }, { key: dto.professionKey }] },
    });
    if (!prof) throw new NotFoundException(`Profession '${dto.professionKey}' not found.`);

    const ind = await this.prisma.industry.findFirst({
      where: { OR: [{ id: dto.industryKey }, { key: dto.industryKey }] },
    });
    if (!ind) throw new NotFoundException(`Industry '${dto.industryKey}' not found.`);

    return this.prisma.industryProfession.upsert({
      where: {
        industryId_professionId: {
          industryId: ind.id,
          professionId: prof.id,
        },
      },
      update: {
        isPrimary: dto.isPrimary ?? false,
      },
      create: {
        industryId: ind.id,
        professionId: prof.id,
        isPrimary: dto.isPrimary ?? false,
      },
      include: {
        industry: true,
        profession: true,
      },
    });
  }

  async linkProfessionSkill(dto: LinkProfessionSkillDto) {
    const prof = await this.prisma.profession.findFirst({
      where: { OR: [{ id: dto.professionKey }, { key: dto.professionKey }] },
    });
    if (!prof) throw new NotFoundException(`Profession '${dto.professionKey}' not found.`);

    const skill = await this.prisma.skill.findFirst({
      where: {
        OR: [
          { id: dto.skillIdentifier },
          { name: { equals: dto.skillIdentifier, mode: 'insensitive' } },
        ],
      },
    });
    if (!skill) throw new NotFoundException(`Skill '${dto.skillIdentifier}' not found.`);

    return this.prisma.professionSkill.upsert({
      where: {
        professionId_skillId: {
          professionId: prof.id,
          skillId: skill.id,
        },
      },
      update: {
        isCore: dto.isCore ?? true,
        relevance: dto.relevance ?? 1.0,
      },
      create: {
        professionId: prof.id,
        skillId: skill.id,
        isCore: dto.isCore ?? true,
        relevance: dto.relevance ?? 1.0,
      },
      include: {
        profession: true,
        skill: true,
      },
    });
  }

  async linkProfessionContext(dto: LinkProfessionContextDto) {
    const prof = await this.prisma.profession.findFirst({
      where: { OR: [{ id: dto.professionKey }, { key: dto.professionKey }] },
    });
    if (!prof) throw new NotFoundException(`Profession '${dto.professionKey}' not found.`);

    const cat = await this.prisma.interviewCategory.findFirst({
      where: { OR: [{ id: dto.categoryKey }, { key: dto.categoryKey }] },
    });
    if (!cat) throw new NotFoundException(`Interview category '${dto.categoryKey}' not found.`);

    return this.prisma.professionInterviewCategory.upsert({
      where: {
        professionId_interviewCategoryId: {
          professionId: prof.id,
          interviewCategoryId: cat.id,
        },
      },
      update: {
        relevance: dto.relevance ?? 1.0,
      },
      create: {
        professionId: prof.id,
        interviewCategoryId: cat.id,
        relevance: dto.relevance ?? 1.0,
      },
      include: {
        profession: true,
        interviewCategory: true,
      },
    });
  }

  async linkContextFormat(dto: LinkContextFormatDto) {
    const cat = await this.prisma.interviewCategory.findFirst({
      where: { OR: [{ id: dto.categoryKey }, { key: dto.categoryKey }] },
    });
    if (!cat) throw new NotFoundException(`Interview category '${dto.categoryKey}' not found.`);

    const fmt = await this.prisma.interviewFormat.findFirst({
      where: { OR: [{ id: dto.formatKey }, { key: dto.formatKey }] },
    });
    if (!fmt) throw new NotFoundException(`Interview format '${dto.formatKey}' not found.`);

    return this.prisma.interviewCategoryFormat.upsert({
      where: {
        interviewCategoryId_interviewFormatId: {
          interviewCategoryId: cat.id,
          interviewFormatId: fmt.id,
        },
      },
      update: {},
      create: {
        interviewCategoryId: cat.id,
        interviewFormatId: fmt.id,
      },
      include: {
        interviewCategory: true,
        interviewFormat: true,
      },
    });
  }

  async getInterviewCategories() {
    return this.prisma.interviewCategory.findMany({
      include: {
        categoryFormats: {
          include: { interviewFormat: true },
        },
      },
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

  async getInterviewFormats() {
    try {
      if (this.prisma.interviewFormat) {
        const formats = await this.prisma.interviewFormat.findMany({
          orderBy: { name: 'asc' },
        });
        if (formats && formats.length > 0) return formats;
      }
    } catch {}
    return SEED_INTERVIEW_FORMATS;
  }

  async createInterviewFormat(dto: { key: string; name: string; nameTh?: string; description?: string }) {
    try {
      if (this.prisma.interviewFormat) {
        return await this.prisma.interviewFormat.create({
          data: {
            key: dto.key.toLowerCase().trim().replace(/\s+/g, '_'),
            name: dto.name,
            nameTh: dto.nameTh,
            description: dto.description,
            isCustom: true,
          },
        });
      }
    } catch {}
    return {
      id: `fmt-${Date.now()}`,
      key: dto.key,
      name: dto.name,
      nameTh: dto.nameTh,
      description: dto.description,
      isCustom: true,
    };
  }

  async getSeniorityLevels(category?: string) {
    return this.prisma.seniorityLevel.findMany({
      where: category ? { category } : undefined,
      orderBy: { minYearsExp: 'asc' },
    });
  }

  async getSkillCategories() {
    return this.prisma.skillCategory.findMany({
      where: { deletedAt: null },
      include: {
        skills: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createSkill(dto: CreateSkillDto) {
    let cat = await this.prisma.skillCategory.findFirst({
      where: {
        OR: [{ id: dto.categoryId }, { key: dto.categoryId }],
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

  async softDeleteIndustry(keyOrId: string) {
    const existing = await this.prisma.industry.findFirst({
      where: { OR: [{ id: keyOrId }, { key: keyOrId }] },
    });
    if (!existing) {
      throw new NotFoundException(`Industry '${keyOrId}' not found.`);
    }
    return this.prisma.industry.update({
      where: { id: existing.id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });
  }

  async softDeleteProfession(keyOrId: string) {
    const existing = await this.prisma.profession.findFirst({
      where: { OR: [{ id: keyOrId }, { key: keyOrId }] },
    });
    if (!existing) {
      throw new NotFoundException(`Profession '${keyOrId}' not found.`);
    }
    return this.prisma.profession.update({
      where: { id: existing.id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });
  }

  async softDeleteSkill(skillIdOrName: string) {
    const existing = await this.prisma.skill.findFirst({
      where: { OR: [{ id: skillIdOrName }, { name: skillIdOrName }] },
    });
    if (!existing) {
      throw new NotFoundException(`Skill '${skillIdOrName}' not found.`);
    }
    return this.prisma.skill.update({
      where: { id: existing.id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });
  }

  async updateProfession(keyOrId: string, data: Partial<CreateProfessionDto>) {
    const existing = await this.prisma.profession.findFirst({
      where: { OR: [{ id: keyOrId }, { key: keyOrId }] },
    });
    if (!existing) {
      throw new NotFoundException(`Profession '${keyOrId}' not found.`);
    }
    return this.prisma.profession.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        nameTh: data.nameTh,
        description: data.description,
        suggestedSkills: data.suggestedSkills,
        version: { increment: 1 },
      },
    });
  }
}
