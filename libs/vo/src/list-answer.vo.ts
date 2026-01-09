import { ApiProperty } from '@nestjs/swagger';
import { Answer } from '@app/entity';

export class ListAnswerVo {
  @ApiProperty({ description: '回答列表' })
  answers: Answer[];
}
