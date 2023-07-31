import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypegooseModule } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
    ConfigModule,
    AuthModule,
    JwtModule
  ],
  providers: [UserService,],
  controllers: [UserController],
})
export class UserModule {}
