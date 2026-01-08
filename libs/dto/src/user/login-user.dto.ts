import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from '@app/dto';

export class LoginUserDto extends PickType(RegisterUserDto, [
  'username',
  'password',
] as const) {}
