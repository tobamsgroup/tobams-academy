import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  message: string;
  meta?: Record<string, unknown>;
  error: null;
}

type InterceptorInput<T> =
  | T
  | {
      data: T;
      message?: string;
      meta?: Record<string, unknown>;
    };

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    _ctx: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: InterceptorInput<T>) => {
        const isWrapped =
          typeof data === 'object' && data !== null && 'data' in data;

        const value = isWrapped ? data.data : data;

        return {
          data: value,
          message: isWrapped ? (data.message ?? 'Success') : 'Success',
          meta: isWrapped ? data.meta : undefined,
          error: null,
        };
      }),
    );
  }
}
