import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { CollectionsService } from '../collections/collections.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';

@Controller(':username/collections/:collectionId/links')
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly collectionsService: CollectionsService,
  ) {}
  async usernameExists(username: string) {
    return this.collectionsService.findUserByUsername(username);
  }
  async collectionExits(collectionId: number, username: string) {
    return this.collectionsService.findOneById({
      id: collectionId,
      username,
    });
  }

  async linkExists(linkId: number, collectionId: number) {
    return this.linksService.findOne({
      id: linkId,
      collectionId: collectionId,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('username') username: string,
    @Param('collectionId') collectionId: string,
    @Body() createLinkDto: CreateLinkDto,
    @Req() req: Request,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (req.user['id'] !== usernameExists.id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const collectionExists = await this.collectionExits(
      +collectionId,
      username,
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    return this.linksService.create({
      name: createLinkDto.name,
      url: createLinkDto.url,
      collectionId: +collectionId,
    });
  }

  @Get()
  @UseGuards(OptionalJwtGuard)
  async findAll(
    @Param('username') username: string,
    @Param('collectionId') collectionId: string,
    @Req() req: Request,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const collectionExists = await this.collectionExits(
      +collectionId,
      username,
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    if (collectionExists.visibility === 'PRIVATE') {
      if (!req.user)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      else if (req.user['id'] !== usernameExists.id) {
        const isCollectionSharedWithUser =
          await this.linksService.isCollectionSharedWithUser(
            +collectionId,
            req.user['id'],
          );
        if (!isCollectionSharedWithUser)
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    return this.linksService.findAll(+collectionId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  async findOne(
    @Param('username') username: string,
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const collectionExists = await this.collectionExits(
      +collectionId,
      username,
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    if (collectionExists.visibility === 'PRIVATE') {
      if (!req.user)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      else if (req.user['id'] !== usernameExists.id) {
        const isCollectionSharedWithUser =
          await this.linksService.isCollectionSharedWithUser(
            +collectionId,
            req.user['id'],
          );
        if (!isCollectionSharedWithUser)
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const linkExists = await this.linkExists(+id, +collectionId);
    if (!linkExists)
      throw new HttpException('Link does not exist', HttpStatus.BAD_REQUEST);

    return linkExists;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('username') username: string,
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (req.user['id'] !== usernameExists.id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const collectionExists = await this.collectionExits(
      +collectionId,
      username,
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    const linkExists = await this.linkExists(+id, +collectionId);
    if (!linkExists)
      throw new HttpException('Link does not exist', HttpStatus.BAD_REQUEST);

    return this.linksService.update(+id, {
      name: updateLinkDto.name,
      url: updateLinkDto.url,
      collectionId: +collectionId,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('username') username: string,
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (req.user['id'] !== usernameExists.id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const collectionExists = await this.collectionExits(
      +collectionId,
      username,
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    const linkExists = await this.linkExists(+id, +collectionId);
    if (!linkExists)
      throw new HttpException('Link does not exist', HttpStatus.BAD_REQUEST);

    return this.linksService.remove(+id);
  }

  @Post(':id/clicked')
  @UseGuards(OptionalJwtGuard)
  async clicked(
    @Param('username') username: string,
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const usernameExists = await this.usernameExists(username);
    if (!usernameExists)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const collectionExists = await this.collectionExits(
      +collectionId,
      username,
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    if (collectionExists.visibility === 'PRIVATE') {
      if (!req.user)
        throw new HttpException('Unauthorized1', HttpStatus.UNAUTHORIZED);
      else if (req.user['id'] !== usernameExists.id) {
        const isCollectionSharedWithUser =
          await this.linksService.isCollectionSharedWithUser(
            +collectionId,
            req.user['id'],
          );
        if (!isCollectionSharedWithUser)
          throw new HttpException('Unauthorized2', HttpStatus.UNAUTHORIZED);
      }
    }

    const linkExists = await this.linkExists(+id, +collectionId);
    if (!linkExists)
      throw new HttpException('Link does not exist', HttpStatus.BAD_REQUEST);

    return this.linksService.clicked(+id);
  }
}
