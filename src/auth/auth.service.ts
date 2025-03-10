// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/rest-password.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userService.createUser({
      email: registerDto.email,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
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

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new Error('Invalid credentials');
  }
}