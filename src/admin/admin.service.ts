import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entities';
import { AdminUser } from './dto/admin-user';
import { compare } from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) { }

  findById(id: number) {
    console.log('id');
    return this.adminRepository.findOne({ where: { id } });
  }

  async validateAdmin(email: string, pass: string): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (admin && (await compare(pass, admin.password))) {
      const { password: _, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(admin: any) {
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: 'admin' // Ajout d'un rôle spécifique
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ADMIN_JWT_SECRET,
        expiresIn: '1h'
      }),
    };
  }

  async register(userData: AdminUser){
    // code à faire
  }
}