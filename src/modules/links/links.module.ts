import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { CollectionsService } from '../collections/collections.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [LinksController],
  providers: [LinksService, CollectionsService, PrismaService],
})
export class LinksModule {}
