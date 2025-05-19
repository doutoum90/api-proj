import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AdminService } from '../../admin/admin.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ADMIN_JWT_SECRET, // Secret différent
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const admin = await this.adminService.findById(payload.sub);
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Admin non autorisé');
    }
    return admin;
  }
}