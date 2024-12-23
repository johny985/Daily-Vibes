import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, from, Observable, tap, throwError } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    req.queryRunner = qr;

    return next.handle().pipe(
      tap(() => {
        return qr.commitTransaction();
      }),
      catchError((error) => {
        return from(qr.rollbackTransaction()).pipe(
          mergeMap(() => throwError(() => error)),
        );
      }),
      finalize(() => {
        return qr.release();
      }),
    );
  }
}
