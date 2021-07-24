import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if ('constraint' in exception && (exception as any).constraint) {
      const e = new ConflictException();
      return response.status(e.getStatus()).json({
        message: e.message,
        statusCode: e.getStatus(),
      });
    }

    return response.status(500).json({
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}
