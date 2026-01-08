import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const dontNeedAuth: boolean = this.reflector.getAllAndOverride<boolean>(
      'dontNeedAuth',
      [context.getHandler(), context.getClass()],
    );
    if (dontNeedAuth) {
      return true;
    }
    return super.canActivate(context);
  }
}
