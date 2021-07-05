import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { Token } from './decorators/token.decorator';
import { CreateSessionDTO } from './dto/create-session.dto';
import { JwtAuthRefreshGuard } from './guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async me(@AuthUser() user: User) {
    return user;
  }

  @Post('login')
  public async login(@Body() dto: CreateSessionDTO) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    if (user) {
      return await this.authService.login(user.id, dto.rememberMe);
    } else {
      throw new NotFoundException();
    }
  }

  @Post('refresh')
  @UseGuards(JwtAuthRefreshGuard)
  @ApiBearerAuth()
  async refresh(@Token() token: string) {
    return await this.authService.refresh(token);
  }
}
