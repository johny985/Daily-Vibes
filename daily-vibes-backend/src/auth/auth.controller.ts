import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Response,
} from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const { access_token } = await this.authService.login(req.user);
    console.log('Access Token:', access_token);

    //TODO: Set secure to true in production
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      path: '/',
      // sameSite: 'lax',
    });

    return res.status(200).json({ message: 'Login successful' });
  }

  @Post('logout')
  async logout(@Request() req, @Response() res) {
    if (req.logout) {
      req.logout();
    }

    res.clearCookie('access_token', {
      path: '/',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
