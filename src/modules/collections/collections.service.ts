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

  async findAllPublic(username: string) {
    return this.prismaService.collection.findMany({
      where: { user: { username }, visibility: 'PUBLIC' },
      include: {
        links: {
          select: {
            id: true,
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { views: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { views: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAll(username: string) {
    return this.prismaService.collection.findMany({
      where: {
        user: { username },
      },
      include: {
        links: {
          select: {
            id: true,
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { views: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { views: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findCollectionsSharedWithUser(username: string, userId: number) {
    return this.prismaService.privateCollectionSharedWith.findMany({
      where: {
        collection: { user: { username } },
        sharedWithId: userId,
      },
    });
  }

  async findOneById({ id, username }: { id: number; username: string }) {
    return this.prismaService.collection.findFirst({
      where: { id, user: { username } },
    });
  }

  async findOneBySlug({ slug, username }: { slug: string; username: string }) {
    return this.prismaService.collection.findFirst({
      where: { slug, user: { username } },
      include: {
        links: {
          select: {
            id: true,
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { views: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { views: true } },
      },
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

  async findUserByUsername(username: string) {
    return this.prismaService.user.findFirst({
      where: { username },
    });
  }

  findUsersByEmail(emails: string[]) {
    return this.prismaService.user.findMany({
      where: { email: { in: emails } },
    });
  }

  findUsersAlreadySharedWith(id: number) {
    return this.prismaService.privateCollectionSharedWith.findMany({
      where: { collectionId: id },
      select: { sharedWithId: true },
    });
  }

  shareCollectionWith(id: number, ids: number[]) {
    return this.prismaService.privateCollectionSharedWith.createMany({
      data: ids.map((userId) => ({
        collectionId: id,
        sharedWithId: userId,
      })),
    });
  }

  async unShareCollectionWith(id: number, ids: number[]) {
    return this.prismaService.privateCollectionSharedWith.deleteMany({
      where: {
        collectionId: id,
        sharedWithId: { in: ids },
      },
    });
  }
}
