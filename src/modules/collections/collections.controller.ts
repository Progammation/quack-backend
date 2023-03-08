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
import { ShareCollectionWithDto } from './dto/share-collection-with.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';

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
      visibility: createCollectionDto.visibility?.trim().toUpperCase() as
        | 'PUBLIC'
        | 'PRIVATE'
        | 'UNLISTED',
    });
  }

  @Get()
  @UseGuards(OptionalJwtGuard)
  async findAll(@Param('username') username: string, @Req() req: Request) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (!req.user) return this.collectionsService.findAllPublic(username);
    else if (req.user['id'] === usernameExists.id)
      return this.collectionsService.findAll(username);

    const collectionsSharedWithUser =
      await this.collectionsService.findCollectionsSharedWithUser(
        username,
        req.user['id'],
      );
    const collectionsIdSharedWithUser = collectionsSharedWithUser.map(
      (collection) => collection.collectionId,
    );

    const collections = await this.collectionsService.findAll(username);

    return collections.filter((collection) => {
      if (collection.visibility === 'PUBLIC') return true;
      else if (collection.visibility === 'UNLISTED') return false;
      else if (collection.visibility === 'PRIVATE') {
        return collectionsIdSharedWithUser.includes(collection.id);
      }
    });
  }

  @Get(':slug')
  @UseGuards(OptionalJwtGuard)
  async findOne(
    @Param('username') username: string,
    @Param('slug') slug: string,
    @Req() req: Request,
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

    if (collection.visibility === 'PRIVATE') {
      if (!req.user)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      else if (req.user['id'] !== usernameExists.id) {
        const collectionsSharedWithUser =
          await this.collectionsService.findCollectionsSharedWithUser(
            username,
            req.user['id'],
          );
        const collectionsIdSharedWithUser = collectionsSharedWithUser.map(
          (collection) => collection.collectionId,
        );
        if (!collectionsIdSharedWithUser.includes(collection.id))
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

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
      visibility: updateCollectionDto.visibility?.trim().toUpperCase() as
        | 'PUBLIC'
        | 'PRIVATE'
        | 'UNLISTED',
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

  @Post(':id/shares')
  @UseGuards(JwtAuthGuard)
  async share(
    @Param('username') username: string,
    @Param('id') id: number,
    @Body() shareCollectionWithDto: ShareCollectionWithDto,
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

    const users = await this.collectionsService.findUsersByEmail(
      shareCollectionWithDto.emails,
    );
    if (users.length === 0)
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);

    const usersAlreadyShared =
      await this.collectionsService.findUsersAlreadySharedWith(+id);
    const usersAlreadySharedId = usersAlreadyShared.map(
      (user) => user.sharedWithId,
    );

    const usersToShare = users.filter(
      (user) => !usersAlreadySharedId.includes(user.id),
    );
    if (usersToShare.length === 0)
      throw new HttpException(
        'All users already shared with',
        HttpStatus.BAD_REQUEST,
      );

    return this.collectionsService.shareCollectionWith(
      +id,
      usersToShare.map((user) => user.id),
    );
  }

  @Delete(':id/shares')
  @UseGuards(JwtAuthGuard)
  async unShare(
    @Param('username') username: string,
    @Param('id') id: number,
    @Body() unShareCollectionWithDto: ShareCollectionWithDto,
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

    const users = await this.collectionsService.findUsersByEmail(
      unShareCollectionWithDto.emails,
    );
    if (users.length === 0)
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);

    const usersAlreadyShared =
      await this.collectionsService.findUsersAlreadySharedWith(+id);
    const usersAlreadySharedId = usersAlreadyShared.map(
      (user) => user.sharedWithId,
    );

    const usersToUnShare = users.filter((user) =>
      usersAlreadySharedId.includes(user.id),
    );
    if (usersToUnShare.length === 0)
      throw new HttpException(
        'This collection is not shared with any of the users',
        HttpStatus.BAD_REQUEST,
      );

    return this.collectionsService.unShareCollectionWith(
      +id,
      usersToUnShare.map((user) => user.id),
    );
  }
}
