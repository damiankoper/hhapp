import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcryptjs from 'bcryptjs';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private configsService: ConfigService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneWithPass(username);
    if (user) {
      const valid = await bcryptjs.compare(pass, user.password);
      if (valid) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async login(userId: number, rememberMe = false) {
    const payload = { sub: userId };
    const secretOptions = this.configsService.createJwtSecretOptions();
    return {
      access_token: this.jwtService.sign(payload, {
        secret: secretOptions.secret,
        expiresIn: secretOptions.secretExpiresIn,
      }),
      refresh_token: this.jwtService.sign(
        { ...payload, rememberMe },
        {
          secret: secretOptions.secretRefresh,
          expiresIn: rememberMe
            ? secretOptions.secretRefreshRememberExpiresIn
            : secretOptions.secretRefreshExpiresIn,
        },
      ),
    };
  }

  async refresh(token: string) {
    // TODO: User still exists check
    const payload = this.jwtService.decode(token);
    if (typeof payload == 'object') {
      return await this.login(payload.sub, payload.rememberMe);
    }
    throw new NotFoundException();
  }
}
