import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token non fourni');
        }

        const token = authHeader.split(' ')[1];

        try {
            const secret = this.configService.get<string>('JWT_SECRET');
            if (!secret) {
                throw new Error('JWT_SECRET non configuré');
            }

            console.log('Tentative de vérification du token:', {
                tokenStart: token.slice(0, 20) + '...',
                path: request.path,
                method: request.method
            });

            const payload = this.jwtService.verify(token, {
                secret,
                clockTolerance: 60 * 15, // 15 minutes de tolérance
                ignoreExpiration: false
            });

            console.log('Token vérifié avec succès:', {
                sub: payload.sub,
                email: payload.email,
                exp: new Date(payload.exp * 1000).toISOString(),
                path: request.path
            });

            request.user = payload;
            return true;
        } catch (error: any) {
            console.error('Échec vérification JWT:', {
                error: error.message,
                name: error.name,
                tokenStart: token?.slice(0, 20) + '...',
                path: request.path,
                method: request.method
            });
            throw new UnauthorizedException(`Erreur d'authentification: ${error.message}`);
        }
    }
}
