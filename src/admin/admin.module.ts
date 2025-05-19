import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entities';
import { AdminJwtStrategy } from '../auth/strategies/admin-jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    providers: [AdminService, AdminJwtStrategy],
    controllers: [AdminController],
})
export class AdminModule { }