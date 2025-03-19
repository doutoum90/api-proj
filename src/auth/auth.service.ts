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
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const trialStartDate = new Date();
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
      typeAbonnement: registerDto.typeAbonnement || 'Essentiel',
      trialStartDate,
      trialActive: true,
    });
    const accessPayload = {
      email: user.email,
      sub: user.id,
      typeAbonnement: user.typeAbonnement,
      trialActive: user.trialActive,
      type: 'access',
    };
    const refreshPayload = { sub: user.id, type: 'refresh' };

    return {
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: this.jwtService.sign(refreshPayload, { expiresIn: '7d' }),
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    // Vérifier la période d'essai
    const trialStatus = this.checkTrialPeriod(user);
    if (!trialStatus.isActive && !trialStatus.isSubscribed) {
      throw new UnauthorizedException('Période d\'essai terminée. Veuillez souscrire à un abonnement.');
    }

    const accessPayload = {
      email: user.email,
      sub: user.id,
      typeAbonnement: user.typeAbonnement,
      trialActive: user.trialActive,
      type: 'access',
    };
    const refreshPayload = { sub: user.id, type: 'refresh' };

    return {
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: this.jwtService.sign(refreshPayload, { expiresIn: '7d' }),
      user,
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
  private checkTrialPeriod(user: User): { isActive: boolean; isSubscribed: boolean } {
    const now = new Date();
    const trialEndDate = new Date(user.trialStartDate?.toISOString() || now.toISOString());
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 jours d'essai

    const isTrialActive = user.trialActive && now <= trialEndDate;
    if (!isTrialActive && user.trialActive) {
      // Désactiver l'essai si expiré
      this.userService.updateUser(user.id, { trialActive: false });
    }

    return {
      isActive: isTrialActive,
      isSubscribed: !user.trialActive, // Considéré comme abonné si l'essai est terminé
    };
  }
}