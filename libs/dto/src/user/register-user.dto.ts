import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 20, { message: '用户名长度需在 3 到 20 个字符之间' })
  readonly username: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度至少为 6 位' })
  // 注意：虽然数据库限制 50，但注册时应允许用户输入，之后再加密
  readonly password: string;

  @IsEmail({}, { message: '请输入正确的邮箱格式' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  readonly email: string;

  @IsString({ message: '验证码必须是字符串' })
  @IsNotEmpty({ message: '验证码不能为空' })
  readonly captcha: string;
}
