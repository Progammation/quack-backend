import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, PassportModule.register({ session: true })],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
