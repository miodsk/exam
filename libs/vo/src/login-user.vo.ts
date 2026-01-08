import { ApiProperty } from '@nestjs/swagger';
import { User } from '@app/entity';

export class LoginVo {
  @ApiProperty({ description: '用户信息' })
  user: User;

  @ApiProperty({ description: 'JWT 访问令牌' })
  token: string;
}
