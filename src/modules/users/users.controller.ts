import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const emailExists = await this.usersService.findUserByEmail(
      createUserDto.email,
    );
    if (emailExists)
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

    const usernameExists = await this.usersService.findUserByUsername(
      createUserDto.username.trim().toLowerCase(),
    );
    if (usernameExists)
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.usersService.create({
      name: createUserDto.name,
      username: createUserDto.username.trim().toLowerCase(),
      email: createUserDto.email,
      profilePicture: createUserDto.profilePicture,
    });

    return {
      user,
      accessToken: this.jwtService.sign({ id: user.id }),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: Request) {
    return this.usersService.findOneById(req.user['id']);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const usernameExists = await this.usersService.findUserByUsername(
      updateUserDto.username.trim().toLowerCase(),
    );
    if (usernameExists && usernameExists.id !== req.user['id'])
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );

    return this.usersService.update(req.user['id'], {
      username: updateUserDto.username.trim().toLowerCase(),
    });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: Request) {
    return this.usersService.remove(req.user['id']);
  }
}
