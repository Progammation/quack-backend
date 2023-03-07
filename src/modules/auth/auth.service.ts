import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserType } from '../../type/user.type';
import { JwtService } from '@nestjs/jwt';

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
}
