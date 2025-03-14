// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/rest-password.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
      name: registerDto.name,
      lastname: registerDto.lastname,
      dateOfBirth: registerDto.dateOfBirth,
      profession: registerDto.profession,
      skills: registerDto.skills,
      typeAbonnement: registerDto.typeAbonnement
    });
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string, refresh_token: string, user: User }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const accessPayload = {
      email: user.email,
      sub: user.id,
      type: 'access'
    };

    const refreshPayload = {
      sub: user.id,
      type: 'refresh'
    };

    return {
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: this.jwtService.sign(refreshPayload, {
        expiresIn: '7d' // Durée plus longue pour le refresh token
      }),
      user
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    const resetToken = this.jwtService.sign({ sub: user?.id || 0 }, { expiresIn: '1h' });
    await this.userService.setResetToken(user?.id || 0, resetToken);
    // Envoyer l'email avec le token ici
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<UpdateUserDto> {
    const { token, newPassword } = resetPasswordDto;
    const payload = this.jwtService.verify(token);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userService.updatePassword(payload.sub, hashedPassword);
  }

  async refresh(request: Request) {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    const payload = this.jwtService.verify(token, { ignoreExpiration: false });

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');
    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        type: 'access'
      }, { expiresIn: '15m' })
    };
  }

  async verifyToken(req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new Error('Invalid credentials');
  }
}