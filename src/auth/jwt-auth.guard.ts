import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

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

            const payload = this.jwtService.verify(token, {
                secret,
                clockTolerance: 30,
                ignoreExpiration: false
            });

            request.user = payload;
            return true;
        } catch (error: any) {
            console.error(`Échec vérification JWT: ${error.message}`, {
                token: token?.slice(0, 20) + '...'
            });
            throw new UnauthorizedException(`Erreur d'authentification: ${error.message}`);
        }
    }
}
