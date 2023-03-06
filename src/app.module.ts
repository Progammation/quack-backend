import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { CollectionsModule } from './modules/collections/collections.module';
import { LinksModule } from './modules/links/links.module';

@Module({
  imports: [AuthModule, PassportModule.register({ session: true }), CollectionsModule, LinksModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
