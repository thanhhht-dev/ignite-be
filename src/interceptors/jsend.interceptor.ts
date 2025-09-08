import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class JsendInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Nếu controller trả về { status, ... } thì không wrap lại nữa
        if (data && data.status) return data;

        return {
          status: 'success',
          // statusCode: context.switchToHttp().getResponse().statusCode,
          data,
        };
      }),
    );
  }
}
