import { SetMetadata } from '@nestjs/common';
import { CustomDecorator } from '@nestjs/common';

export const DontNeedAuth = (): CustomDecorator =>
  SetMetadata('dontNeedAuth', true);
