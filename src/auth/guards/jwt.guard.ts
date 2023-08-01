import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import { UserModel } from '../../user/user.model'
import {JwtService} from "@nestjs/jwt";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
              private readonly jwtService: JwtService,) {
  }

   async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const [type, token] = req.headers.authorization?.split(' ') ?? [];

      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException({message: 'Пользователь не авторизован'})
      }

      const user =  await this.jwtService.verifyAsync(token)
      const userDB = await this.UserModel.findById(user._id)
      console.log(userDB)
      req.user = userDB;
      return true;
    } catch (e) {
      throw new UnauthorizedException({message: 'Пользователь не авторизован'})
    }
  }

}