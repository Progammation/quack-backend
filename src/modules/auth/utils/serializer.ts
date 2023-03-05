import { AuthService } from '../auth.service';
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserDto } from '../../../dto/user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: UserDto, done: any) {
    done(null, user);
  }

  async deserializeUser(payload: UserDto, done: any) {
    const user = await this.authService.findUserById(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
