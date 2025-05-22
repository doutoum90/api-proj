import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entities';
import { compare, hash } from 'bcrypt';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import { StdioNull } from 'child_process';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.ADMIN_REFRESH_SECRET
      });
      
      const admin = await this.adminRepository.findOne({
        where: { id: payload.sub, refreshToken }
      });

      if (!admin) throw new UnauthorizedException();

      const newPayload: JwtPayload = {
        sub: admin.id,
        email: admin.email,
        role: 'admin'
      };

      return {
        access_token: this.jwtService.sign(newPayload, {
          secret: process.env.ADMIN_JWT_SECRET,
          expiresIn: process.env.ADMIN_JWT_EXPIRATION
        })
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findById(id: number): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { id } });
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) return null;

    const isPasswordValid = await compare(password, admin.password);
    return isPasswordValid ? admin : null;
  }

  async login(admin: Admin): Promise<{ access_token: string }> {
    const payload = { 
      sub: admin.id,
      email: admin.email,
      role: 'admin'
    };
    
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ADMIN_JWT_SECRET,
        expiresIn: process.env.ADMIN_JWT_EXPIRATION || '1h'
      }),
    };
  }

  
  async register(adminData: AdminRegisterDto): Promise<Admin> {
    try {
      const existingAdmin = await this.adminRepository.findOne({ 
        where: { email: adminData.email } 
      });

      if (existingAdmin) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await hash(adminData.password, 10);
      
      const newAdmin = this.adminRepository.create({
        ...adminData,
        password: hashedPassword
      });

      return await this.adminRepository.save(newAdmin);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Admin already exists');
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }
}