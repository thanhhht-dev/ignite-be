import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class JsendExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (status >= 400 && status < 500) {
        // fail case
        response.status(status).json({
          status: 'fail',
          data:
            typeof errorResponse === 'string'
              ? { message: errorResponse }
              : errorResponse,
        });
      } else {
        // error case
        response.status(status).json({
          status: 'error',
          message:
            typeof errorResponse === 'string'
              ? errorResponse
              : (errorResponse as any).message || 'Internal server error',
        });
      }
    } else {
      // unknown error
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
}
