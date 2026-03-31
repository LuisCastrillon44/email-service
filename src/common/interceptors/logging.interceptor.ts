import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type = context.getType();
    const now = Date.now();

    if (type === 'http') {
      const req = context.switchToHttp().getRequest();
      const method = req.method;
      const url = req.url;
      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.log(
              `[HTTP] ${method} ${url} - ${Date.now() - now}ms`,
            ),
          ),
        );
    } else if (type === 'rpc') {
      const rpcCtx = context.switchToRpc().getContext();
      const pattern = rpcCtx.getPattern ? rpcCtx.getPattern() : 'Unknown Pattern';
      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.log(
              `[RPC] Pattern: ${pattern} - ${Date.now() - now}ms`,
            ),
          ),
        );
    }

    return next.handle();
  }
}
