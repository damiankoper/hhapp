import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Token } from './decorators/token.decorator';
import { CreateSessionDTO } from './dto/create-session.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('session')
@ApiTags('session')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  public async login(@Body() dto: CreateSessionDTO) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    if (user) {
      return await this.authService.login(user, dto.rememberMe);
    } else {
      throw new NotFoundException();
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async renew(@Token() token: string) {
    return await this.authService.renew(token);
  }
}
