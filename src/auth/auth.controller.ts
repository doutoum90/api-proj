import { Controller, Post, Body, Res, Req, Get, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/rest-password.dto';
import { Request } from 'express';
import { LoginResponseDto } from './dto/login-response.dto';

const logger = new Logger('AuthController');

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    logger.log('Login attempt');
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Res() res) {
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('refresh')
  async refresh(@Req() refreshDto: Request) {
    return this.authService.refresh(refreshDto);
  }

  @Get('verify')
  async verifyToken(@Req() req: Request) {
    return this.authService.verifyToken(req);
  }
}
