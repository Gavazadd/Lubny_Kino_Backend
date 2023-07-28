import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(4, {
    message: 'Пароль повинен бути більше 4 символів',
  })
  @MaxLength(18, {
    message: 'Пароль повинен бути менше 18 символів',
  })
  password: string
}
