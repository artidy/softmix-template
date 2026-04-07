import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { isArray } from 'lodash';

type CheckErrors = {
  statusCode: string;
  message: [] | string;
  error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const errorResponse = exception.getResponse() as CheckErrors;
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message = isArray(errorResponse.message) ?
      errorResponse.message.join(', ') :
      errorResponse.message ??
      exception.message;
    const body = request.body;

    if (status !== 304) {
      Logger.error(`Код ошибки: ${status}, описание: ${message}`);

      if (exception instanceof UnauthorizedException && exception.message === 'Token has expired') {
        message = 'Token has expired';
      }
    }

    response
      .status(status)
      .json({
        statusCode: status,
        message,
        date: new Date().toISOString(),
        resource: request.url,
        sourceData: body
      });
  }
}
