import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TaxonomyService } from './taxonomy.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { CreateInterviewCategoryDto } from './dto/create-interview-category.dto';
import { CreateSkillDto } from './dto/create-skill.dto';

@ApiTags('Multi-Industry Taxonomy & Ontology')
@Controller('taxonomy')
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูล Taxonomy ทั้งหมด (อุตสาหกรรม, อาชีพ, รูปแบบสัมภาษณ์, ระดับประสบการณ์, ทักษะ)' })
  @ApiResponse({ status: 200, description: 'ข้อมูล Taxonomy ครบวงจร' })
  getAllTaxonomy() {
    return this.taxonomyService.getAllTaxonomy();
  }

  @Get('industries')
  @ApiOperation({ summary: 'ดึงรายชื่อกลุ่มอุตสาหกรรมทั้งหมดพร้อมตำแหน่งงาน' })
  getIndustries() {
    return this.taxonomyService.getIndustries();
  }

  @Post('industries')
  @ApiOperation({ summary: 'เพิ่มกลุ่มอุตสาหกรรมใหม่เข้าระบบ (Dynamic Industry Addition)' })
  createIndustry(@Body() dto: CreateIndustryDto) {
    return this.taxonomyService.createIndustry(dto);
  }

  @Get('professions')
  @ApiOperation({ summary: 'ดึงรายชื่อตำแหน่งงานทั้งหมด หรือกรองตามอุตสาหกรรม' })
  @ApiQuery({ name: 'industryId', required: false, description: 'Industry Key or ID' })
  getProfessions(@Query('industryId') industryId?: string) {
    return this.taxonomyService.getProfessions(industryId);
  }

  @Post('professions')
  @ApiOperation({ summary: 'เพิ่มตำแหน่งงานใหม่เข้าระบบ (Dynamic Profession Addition)' })
  createProfession(@Body() dto: CreateProfessionDto) {
    return this.taxonomyService.createProfession(dto);
  }

  @Get('interview-categories')
  @ApiOperation({ summary: 'ดึงหมวดหมู่และรูปแบบการสัมภาษณ์ทั้งหมด (Job, Academic, Scholarship, ฯลฯ)' })
  getInterviewCategories() {
    return this.taxonomyService.getInterviewCategories();
  }

  @Post('interview-categories')
  @ApiOperation({ summary: 'เพิ่มรูปแบบการสัมภาษณ์ใหม่เข้าระบบ' })
  createInterviewCategory(@Body() dto: CreateInterviewCategoryDto) {
    return this.taxonomyService.createInterviewCategory(dto);
  }

  @Get('seniority-levels')
  @ApiOperation({ summary: 'ดึงระดับประสบการณ์และลำดับอาวุโส (Career, Academic, Healthcare)' })
  @ApiQuery({ name: 'category', required: false, enum: ['career', 'academic', 'healthcare_licensed'] })
  getSeniorityLevels(@Query('category') category?: string) {
    return this.taxonomyService.getSeniorityLevels(category);
  }

  @Get('skills')
  @ApiOperation({ summary: 'ดึงโครงสร้าง Taxonomy ทักษะทั้งหมด 8 หมวดหมู่' })
  getSkills() {
    return this.taxonomyService.getSkillCategories();
  }

  @Post('skills')
  @ApiOperation({ summary: 'เพิ่มทักษะใหม่เข้าระบบ' })
  createSkill(@Body() dto: CreateSkillDto) {
    return this.taxonomyService.createSkill(dto);
  }
}
