import {
    Controller,
    Post,
    UseGuards,
    Request,
    Get,
    Body,
    UnauthorizedException,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { AdminAuthGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';

declare global {
    namespace Express { 
        interface Request {
            user?: {
                sub: string;
            };
        }
    }
}

@Controller('api/admin/auth')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @UseGuards(AdminAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req) {
        return this.adminService.login(req.user);
    }

    @Get('me')
    @UseGuards(AdminAuthGuard)
    getProfile(@Request() req) {
        return {
            id: req.user.sub,
            email: req.user.email,
            role: req.user.role
        };
    }

    @Get('verify')
    @UseGuards(AdminAuthGuard)
    verifyToken() {
        return { valid: true };
    }

    @Post('refresh')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        try {
            return await this.adminService.refreshToken(refreshTokenDto.refresh_token);
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    @UseGuards(AdminAuthGuard)
    @Post('register')
    async register(@Body() adminData: AdminRegisterDto) {
        return this.adminService.register(adminData);
    }
}