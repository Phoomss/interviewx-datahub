import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TaxonomyService } from './taxonomy.service';
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

  @Get('professions/by-industry/:industryKey')
  @ApiOperation({ summary: 'ดึงตำแหน่งงานทั้งหมดในกลุ่มอุตสาหกรรม (รองรับ Many-to-Many)' })
  @ApiParam({ name: 'industryKey', description: 'Industry Key or ID' })
  getProfessionsByIndustry(@Param('industryKey') industryKey: string) {
    return this.taxonomyService.getProfessionsByIndustry(industryKey);
  }

  @Get('professions/by-context/:categoryKey')
  @ApiOperation({ summary: 'ดึงตำแหน่งงานที่เข้าร่วมในบริบทการสัมภาษณ์ที่ระบุ' })
  @ApiParam({ name: 'categoryKey', description: 'Interview Category Key or ID' })
  getProfessionsByContext(@Param('categoryKey') categoryKey: string) {
    return this.taxonomyService.getProfessionsByContext(categoryKey);
  }

  @Get('skills/by-profession/:professionKey')
  @ApiOperation({ summary: 'ดึงทักษะที่เกี่ยวข้องกับตำแหน่งงาน (Many-to-Many Profession Skills)' })
  @ApiParam({ name: 'professionKey', description: 'Profession Key or ID' })
  getSkillsByProfession(@Param('professionKey') professionKey: string) {
    return this.taxonomyService.getSkillsByProfession(professionKey);
  }

  @Get('formats/by-context/:categoryKey')
  @ApiOperation({ summary: 'ดึงรูปแบบการสัมภาษณ์ที่รองรับในบริบทสัมภาษณ์' })
  @ApiParam({ name: 'categoryKey', description: 'Interview Category Key or ID' })
  getFormatsByContext(@Param('categoryKey') categoryKey: string) {
    return this.taxonomyService.getFormatsByContext(categoryKey);
  }

  @Post('professions')
  @ApiOperation({ summary: 'เพิ่มตำแหน่งงานใหม่เข้าระบบ (Dynamic Profession Addition)' })
  createProfession(@Body() dto: CreateProfessionDto) {
    return this.taxonomyService.createProfession(dto);
  }

  // ==========================================
  // Many-to-Many Dynamic Linking Endpoints
  // ==========================================

  @Post('link/industry-profession')
  @ApiOperation({ summary: 'เชื่อมโยงตำแหน่งงานเข้ากับอุตสาหกรรม (Many-to-Many Association)' })
  linkIndustryProfession(@Body() dto: LinkIndustryProfessionDto) {
    return this.taxonomyService.linkIndustryProfession(dto);
  }

  @Post('link/profession-skill')
  @ApiOperation({ summary: 'เชื่อมโยงทักษะเข้ากับตำแหน่งงาน (Many-to-Many Association)' })
  linkProfessionSkill(@Body() dto: LinkProfessionSkillDto) {
    return this.taxonomyService.linkProfessionSkill(dto);
  }

  @Post('link/profession-context')
  @ApiOperation({ summary: 'เชื่อมโยงตำแหน่งงานเข้ากับบริบทการสัมภาษณ์' })
  linkProfessionContext(@Body() dto: LinkProfessionContextDto) {
    return this.taxonomyService.linkProfessionContext(dto);
  }

  @Post('link/context-format')
  @ApiOperation({ summary: 'เชื่อมโยงบริบทการสัมภาษณ์เข้ากับรูปแบบการสัมภาษณ์' })
  linkContextFormat(@Body() dto: LinkContextFormatDto) {
    return this.taxonomyService.linkContextFormat(dto);
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

  @Get('interview-formats')
  @ApiOperation({ summary: 'ดึงรายชื่อรูปแบบการสัมภาษณ์ 15 รูปแบบ (Structured, Behavioral, Technical, Case, Oral Exam ฯลฯ)' })
  getInterviewFormats() {
    return this.taxonomyService.getInterviewFormats();
  }

  @Post('interview-formats')
  @ApiOperation({ summary: 'เพิ่มรูปแบบการสัมภาษณ์ใหม่ (Dynamic Interview Format Addition)' })
  createInterviewFormat(@Body() dto: { key: string; name: string; nameTh?: string; description?: string }) {
    return this.taxonomyService.createInterviewFormat(dto);
  }

  @Get('seniority-levels')
  @ApiOperation({ summary: 'ดึงระดับประสบการณ์และลำดับอาวุโส (Career, Academic, Healthcare)' })
  @ApiQuery({ name: 'category', required: false, enum: ['career', 'academic', 'healthcare_licensed'] })
  getSeniorityLevels(@Query('category') category?: string) {
    return this.taxonomyService.getSeniorityLevels(category);
  }

  @Get('skills')
  @ApiOperation({ summary: 'ดึงโครงสร้าง Taxonomy ทักษะทั้งหมด 15 หมวดหมู่' })
  getSkills() {
    return this.taxonomyService.getSkillCategories();
  }

  @Post('skills')
  @ApiOperation({ summary: 'เพิ่มทักษะใหม่เข้าระบบ' })
  createSkill(@Body() dto: CreateSkillDto) {
    return this.taxonomyService.createSkill(dto);
  }
}
