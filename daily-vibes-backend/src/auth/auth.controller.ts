import {
  Controller,
  Request,
  Post,
  UseGuards,
  Response,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { access_token } = await this.authService.login(req.user);
    console.log('Access Token:', access_token);

    return {
      message: 'Login successful',
      username: req.user.email,
      access_token,
    };
  }

  @Post('logout')
  async logout(@Request() req) {
    if (req.logout) {
      req.logout();
    }

    return { message: 'Logged out successfully' };
  }

  @Post('temp-user')
  async setTempUser(@Request() req, @Response() res) {
    const { access_token } = await this.authService.login({
      email: 'tempUser',
      id: 9999999,
    });

    return res.status(200).json({ message: 'Login successful', access_token });
  }

  @Get('verify')
  verifyToken(@Req() request: any) {
    const token = request.cookies.access_token;
    if (!token) throw new UnauthorizedException('No token provided');

    const decoded = this.authService.verifyToken(token);
    return { message: 'Token verified', username: decoded?.email };
  }
}
