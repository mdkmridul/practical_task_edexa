import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Action } from './actions.enum';
import { ACTIONS_KEY } from './actions.decorator';

@Injectable()
export class ActionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAction = this.reflector.getAllAndOverride<Action[]>(
      ACTIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredAction) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const actions = user._doc.actions;

    const permission = actions?.includes(requiredAction[0]) ? true : false;
    return permission;
  }
}
