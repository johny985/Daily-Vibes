import { Controller, Request, Post, UseGuards, Response } from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const { access_token } = await this.authService.login(req.user);
    console.log('Access Token:', access_token);

    //TODO: Set secure to true in production, httpOnly to true in production
    res.cookie('access_token', access_token, {
      httpOnly: false,
      secure: false,
      path: '/',
      sameSite: 'lax',
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    if (req.logout) {
      req.logout();
    }

    res.clearCookie('access_token', {
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }

  //TODO: Fix the name, cookie expiracy time
  @Post('temp-user')
  async setTempUser(@Request() req, @Response() res) {
    const tempUser = true;

    res.cookie('tempUser', tempUser, {
      httpOnly: false,
      secure: false,
      path: '/',
      sameSite: 'lax',
      // maxAge: 1000 * 4,
    });

    return res.status(200).json({ message: 'Login successful' });
  }
}
