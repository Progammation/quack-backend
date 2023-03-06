import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import slugify from 'slugify';

@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async create(
    @Body() createCollectionDto: CreateCollectionDto,
    @Req() req: Request,
  ) {
    const slug = slugify(createCollectionDto.name);
    const slugExists = await this.collectionsService.findOneBySlug({
      slug,
      userId: req.user['id'],
    });

    if (slugExists)
      throw new HttpException(
        'Collection name already exists',
        HttpStatus.BAD_REQUEST,
      );

    return this.collectionsService.create({
      name: createCollectionDto.name,
      bio: createCollectionDto.bio,
      userId: req.user['id'],
      slug,
    });
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.collectionsService.findAll(req.user['id']);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Req() req: Request) {
    const collection = await this.collectionsService.findOneBySlug({
      slug,
      userId: req.user['id'],
    });

    if (collection) this.collectionsService.addView(collection.id);

    return collection;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @Req() req: Request,
  ) {
    const collection = await this.collectionsService.findOneById({
      id: +id,
      userId: req.user['id'],
    });

    if (collection) {
      let slug;
      if (updateCollectionDto.name) {
        slug = slugify(updateCollectionDto.name);
        const slugExists = await this.collectionsService.findOneBySlug({
          slug,
          userId: req.user['id'],
        });

        if (slugExists && slugExists.id !== +id)
          throw new HttpException(
            'Collection name already exists',
            HttpStatus.BAD_REQUEST,
          );
      }

      return this.collectionsService.update(+id, {
        name: updateCollectionDto.name,
        bio: updateCollectionDto.bio,
        slug,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request) {
    const collection = await this.collectionsService.findOneById({
      id: +id,
      userId: req.user['id'],
    });

    if (collection) return this.collectionsService.remove(+id);
  }
}
