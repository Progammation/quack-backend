import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserDto } from '../../dto/user.dto';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: number): Promise<UserDto | null> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    return user ? user : null;
  }

  async findUserByEmail(email: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user ? user : null;
  }

  async createUser(user: UserDto): Promise<UserDto> {
    console.log(user);
    return this.prisma.user.create({
      data: user,
    });
  }
}
