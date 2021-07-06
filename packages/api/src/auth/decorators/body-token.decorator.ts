import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BodyToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.body.refresh_token;
    return token || '';
  },
);
