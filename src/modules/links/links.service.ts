import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LinksService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createLinkDto: CreateLinkDto) {
    return this.prismaService.link.create({
      data: createLinkDto,
    });
  }

  findAll(collectionId: number) {
    return this.prismaService.link.findMany({
      where: { collectionId },
      include: { _count: { select: { views: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne({ id, collectionId }: { id: number; collectionId: number }) {
    return this.prismaService.link.findFirst({
      where: { id, collectionId },
      include: { _count: { select: { views: true } } },
    });
  }

  update(id: number, updateLinkDto: UpdateLinkDto) {
    return this.prismaService.link.update({
      where: { id },
      data: updateLinkDto,
    });
  }

  remove(id: number) {
    return this.prismaService.link.delete({
      where: { id },
    });
  }

  clicked(id: number) {
    return this.prismaService.viewLink.create({
      data: { linkId: id },
    });
  }

  isCollectionSharedWithUser(collectionId: number, userId: number) {
    return this.prismaService.collectionSharedWith.findFirst({
      where: { collectionId, sharedWithId: userId },
    });
  }
}
