import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UserModel } from '../user/user.model'
import { AuthDto } from './dto/auth.dto'
import { hash, genSalt, compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModeL: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const user = await this.UserModeL.findOne({ email: dto.email })
    if (user)
      throw new BadRequestException('Користувач з таким email вже існує')

    const salt = await genSalt(10)
    const hashPassword = await hash(dto.password, salt)
    const newUser = new this.UserModeL({
      email: dto.email,
      password: hashPassword,
    })

    const tokens  = await this.createTokenPair(String(newUser._id))

    await newUser.save()
    return {
      user: this.returnUserFields(newUser),
      ...tokens
    }
  }

  async login(dto: AuthDto) {
    const user = await this.UserModeL.findOne({ email: dto.email })
    if (!user)
      throw new UnauthorizedException('Користувача з таким email не знайдено')

    const isValidPassword = await compare(dto.password, user.password)
    if (!isValidPassword) throw new UnauthorizedException('Невірний пароль')

    const tokens  = await this.createTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async createTokenPair(userId: string) {
    const data = { _id: userId }
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    })
    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    })
    return { refreshToken, accessToken }
  }

  returnUserFields (user:UserModel){
    return{
      _id:user._id,
      email:user.email,
      isAdmin:user.isAdmin
    }
  }
}
