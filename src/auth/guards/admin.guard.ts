import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserModel } from "../../user/user.model";

export class AdminGuard implements CanActivate{
  constructor(private reflector:Reflector) {}
  canActivate(context: ExecutionContext): boolean{
    const  request: {user:UserModel} = context.switchToHttp().getRequest<{user:UserModel}>()
    const user:UserModel = request.user
    console.log(user)
    if (!user.isAdmin) throw new ForbiddenException('Ви не являєтесь Адміном')

    return user.isAdmin
  }

}