import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // 1. 必须引入这个装饰器
import * as typeorm from 'typeorm';
import { User } from '@app/entity';
import { LoginUserDto, RegisterUserDto, UpdateUserPasswordDto } from '@app/dto';
import { RedisService } from '@app/redis';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: typeorm.Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('用户不存在');
    } else {
      return user;
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new BadRequestException('用户不存在');
    } else {
      return user;
    }
  }

  async register(userInfo: RegisterUserDto) {
    const user = await this.userRepository.findOneBy({
      username: userInfo.username,
    });
    if (user) {
      throw new BadRequestException('用户名已存在');
    }
    const captcha = await this.redisService.get(`captcha_${userInfo.email}`);
    if (!captcha) {
      throw new BadRequestException('验证码已失效');
    }
    if (userInfo.captcha !== captcha) {
      throw new BadRequestException('验证码不正确');
    }
    const newUser = this.userRepository.create(userInfo);
    return await this.userRepository.save(newUser);
  }

  async login(loginInfo: LoginUserDto) {
    const user = await this.getUserByUsername(loginInfo.username);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.password !== loginInfo.password) {
      throw new BadRequestException('密码错误');
    }
    return user;
  }

  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: passwordDto.username,
    });
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    foundUser.password = passwordDto.password;

    try {
      await this.userRepository.save(foundUser);
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '密码修改失败';
    }
  }
}
