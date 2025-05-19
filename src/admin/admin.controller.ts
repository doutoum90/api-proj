import { Controller, Post, UseGuards, Request, Get, Put, Body, Req } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';
import { AdminUser } from './dto/admin-user';

declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
            };
        }
    }
}

@Controller('api/admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Post('login')
    async login(@Request() req) {
        return this.adminService.login(req.body);
    }

    @UseGuards(AdminAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }


    @Put('subscription')
    async register(@Req() req, @Body() userData: AdminUser) {
        return this.adminService.register(userData);
    }
}