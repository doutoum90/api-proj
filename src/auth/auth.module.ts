import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserAuthGuard } from './guards/user-auth.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET manquant dans .env !');
        }
        const refreshSecret = config.get<string>('JWT_REFRESH_SECRET');
        if (!refreshSecret) {
          throw new Error('JWT_REFRESH_SECRET manquant dans .env !');
        }
        return {
          secret,
          signOptions: { expiresIn: '15m' }
        };
      },
      inject: [ConfigService]
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, UserAuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, UserAuthGuard],
})
export class AuthModule { }
