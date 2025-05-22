import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entities';
import { AdminJwtStrategy } from '../auth/strategies/admin-jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        JwtModule.register({
            secret: process.env.ADMIN_JWT_SECRET,
            signOptions: { expiresIn: process.env.ADMIN_JWT_EXPIRATION || '1h' },
        }),
    ],
    providers: [AdminService, AdminJwtStrategy],
    controllers: [AdminController],
})
export class AdminModule { }