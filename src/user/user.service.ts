import { Injectable } from '@nestjs/common'
import { ModelType } from "@typegoose/typegoose/lib/types";
import { UserModel } from "./user.model";
import { InjectModel } from "nestjs-typegoose";

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly userModel:ModelType<UserModel>) {}

  async byId() {
    return { email: 'testing' }
  }
}
