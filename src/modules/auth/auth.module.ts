import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './utils/google.strategy';
import { PrismaService } from '../../database/prisma.service';
import { SessionSerializer } from './utils/serializer';

@Module({
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    PrismaService,
    SessionSerializer,
    {
      provide: 'AuthService',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
