import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const cookies = request.cookies;
      const tempUser = cookies['tempUser'];

      if (tempUser) {
        return null;
      }

      throw new Error('Unauthorized access');
    }

    return user;
  }
}
