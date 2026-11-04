import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authentication & Identity (RBAC)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'เข้าสู่ระบบด้วยอีเมลและรหัสผ่านเพื่อรับ JWT Bearer Token' })
  @ApiResponse({ status: 200, description: 'เข้าสู่ระบบสำเร็จ' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'ลงทะเบียนผู้ใช้งานระบบคนใหม่' })
  @ApiResponse({ status: 201, description: 'ลงทะเบียนผู้ใช้สำเร็จ' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'ดึงข้อมูลผู้ใช้งานปัจจุบันจาก Token ที่ยืนยันตัวตนแล้ว' })
  @ApiResponse({ status: 200, description: 'ข้อมูลโปรไฟล์สำเร็จ' })
  getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id);
  }
}
