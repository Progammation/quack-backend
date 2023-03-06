import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCollectionDto: CreateCollectionDto) {
    return this.prismaService.collection.create({
      data: createCollectionDto,
    });
  }

  async findAll(userId: number) {
    return this.prismaService.collection.findMany({
      where: { userId },
      include: { _count: { select: { views: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneById({ id, userId }: { id: number; userId: number }) {
    return this.prismaService.collection.findFirst({
      where: { id, userId },
      include: { _count: { select: { views: true } } },
    });
  }

  async findOneBySlug({ slug, userId }: { slug: string; userId: number }) {
    return this.prismaService.collection.findFirst({
      where: { slug, userId },
      include: { _count: { select: { views: true } } },
    });
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return this.prismaService.collection.update({
      where: { id },
      data: updateCollectionDto,
    });
  }

  async remove(id: number) {
    console.log(id);
    return this.prismaService.collection.delete({ where: { id } });
  }

  async addView(collectionId: number) {
    return this.prismaService.viewCollection.create({
      data: { collectionId },
    });
  }
}
