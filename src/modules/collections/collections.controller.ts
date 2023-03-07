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

@Controller(':username/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  async usernameExists(username: string) {
    return this.collectionsService.findUserByUsername(username);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('username') username: string,
    @Body() createCollectionDto: CreateCollectionDto,
    @Req() req: Request,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (req.user['id'] !== usernameExists.id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const slug = slugify(createCollectionDto.name);
    const slugExists = await this.collectionsService.findOneBySlug({
      slug,
      username,
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
  async findAll(@Param('username') username: string) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return this.collectionsService.findAll(username);
  }

  @Get(':slug')
  async findOne(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const collection = await this.collectionsService.findOneBySlug({
      slug,
      username,
    });
    if (!collection)
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);

    this.collectionsService.addView(collection.id);
    return collection;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('username') username: string,
    @Param('id') id: number,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @Req() req: Request,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (req.user['id'] !== usernameExists.id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const collection = await this.collectionsService.findOneById({
      id: +id,
      username,
    });
    if (!collection)
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);

    let slug;
    if (updateCollectionDto.name) {
      slug = slugify(updateCollectionDto.name);
      const slugExists = await this.collectionsService.findOneBySlug({
        slug,
        username,
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('username') username: string,
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (req.user['id'] !== usernameExists.id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const collection = await this.collectionsService.findOneById({
      id: +id,
      username,
    });
    if (!collection)
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);

    return this.collectionsService.remove(+id);
  }
}
