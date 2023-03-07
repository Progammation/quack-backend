import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from './guards/google.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    //
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request) {
    return {
      ...req.user,
    };
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const emailExists = await this.authService.findUserByEmail(
      createUserDto.email,
    );
    if (emailExists)
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

    const usernameExists = await this.authService.findUserByUsername(
      createUserDto.username.trim().toLowerCase(),
    );
    if (usernameExists)
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.authService.createUser({
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
}
