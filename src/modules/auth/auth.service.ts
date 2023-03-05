import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserDto } from '../../dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: { email: user.email },
    });

    let newUser = userExists;
    if (!userExists) {
      newUser = await this.prisma.user.create({
        data: user,
      });
    }

    return {
      user: newUser,
      accessToken: this.jwtService.sign({ id: newUser.id }),
    };
  }
}
