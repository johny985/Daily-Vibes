import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const qr: QueryRunner = this.dataSource.createQueryRunner();

    return from(qr.connect()).pipe(
      mergeMap(() => from(qr.startTransaction())),
      mergeMap(() => {
        req.queryRunner = qr;
        return next.handle();
      }),
      mergeMap(async (result) => {
        await qr.commitTransaction();
        return result;
      }),
      catchError(async (error) => {
        try {
          await qr.rollbackTransaction();
        } catch (rollbackError) {
          console.error('Rollback failed:', rollbackError);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        qr.release();
      }),
    );
  }
}
