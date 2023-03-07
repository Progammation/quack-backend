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

@Controller('collections/:collectionId/links')
@UseGuards(JwtAuthGuard)
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly collectionsService: CollectionsService,
  ) {}

  async collectionExits(collectionId: number, userId: number) {
    return this.collectionsService.findOneById({
      id: collectionId,
      userId,
    });
  }

  async linkExists(linkId: number, collectionId: number) {
    return this.linksService.findOne({
      id: linkId,
      collectionId: collectionId,
    });
  }

  @Post()
  async create(
    @Param('collectionId') collectionId: string,
    @Body() createLinkDto: CreateLinkDto,
    @Req() req: Request,
  ) {
    const collectionExists = await this.collectionExits(
      +collectionId,
      req.user['id'],
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
  async findAll(
    @Param('collectionId') collectionId: string,
    @Req() req: Request,
  ) {
    const collectionExists = await this.collectionExits(
      +collectionId,
      req.user['id'],
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    return this.linksService.findAll(+collectionId);
  }

  @Get(':id')
  async findOne(
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const collectionExists = await this.collectionExits(
      +collectionId,
      req.user['id'],
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    const linkExists = await this.linkExists(+id, +collectionId);
    if (!linkExists)
      throw new HttpException('Link does not exist', HttpStatus.BAD_REQUEST);

    return linkExists;
  }

  @Patch(':id')
  async update(
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    const collectionExists = await this.collectionExits(
      +collectionId,
      req.user['id'],
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
  async remove(
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const collectionExists = await this.collectionExits(
      +collectionId,
      req.user['id'],
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

  @Get(':id/clicked')
  async clicked(
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const collectionExists = await this.collectionExits(
      +collectionId,
      req.user['id'],
    );
    if (!collectionExists)
      throw new HttpException(
        'Collection does not exist',
        HttpStatus.BAD_REQUEST,
      );

    const linkExists = await this.linkExists(+id, +collectionId);
    if (!linkExists)
      throw new HttpException('Link does not exist', HttpStatus.BAD_REQUEST);

    return this.linksService.clicked(+id);
  }
}
