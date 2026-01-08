import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto, LoginUserDto } from '@app/dto';
import { EmailService } from '@app/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { DontNeedAuth } from '@app/decorator/decorator';
import { UpdateUserPasswordDto } from '@app/dto';
import { LoginVo } from '@app/vo/login-user.vo';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Get('userInfo')
  async getUserInfo(@Query('username') username: string) {
    return await this.userService.getUserByUsername(username);
  }

  @DontNeedAuth()
  @Post('register')
  async register(@Body() userInfo: RegisterUserDto) {
    return await this.userService.register(userInfo);
  }

  @DontNeedAuth()
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @DontNeedAuth()
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto): Promise<LoginVo> {
    const user = await this.userService.login(loginUser);
    return {
      user,
      token: this.jwtService.sign(
        {
          username: user.username,
          sub: user.id,
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }

  @Post('update_password')
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return this.userService.updatePassword(passwordDto);
  }

  @DontNeedAuth()
  @Get('updatePassword-captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      5 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '修改密码验证码',
      html: `<p>你的修改密码验证码是 ${code}</p>`,
    });
    return '发送成功';
  }
}
