import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserType } from '../../type/user.type';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async loginIfUserExists(user: UserType) {
    const userExists = await this.prisma.user.findFirst({
      where: { email: user.email },
    });

    if (userExists)
      return {
        user: userExists,
        accessToken: this.jwtService.sign({ id: userExists.id }),
      };
  }

  async findUserById(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findUserByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }
}
