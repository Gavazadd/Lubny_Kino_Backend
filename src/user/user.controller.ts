import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../auth/decorators/auth.decorator";



@Controller('user')
export class UserController {
  constructor(private readonly userService:UserService) {}

  @Get('profile')
  @Auth("admin")
  async getProfile(){
    return this.userService.byId()
  }
}
