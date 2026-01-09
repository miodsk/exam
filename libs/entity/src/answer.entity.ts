import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity'; // 假设你的 User 实体路径
import { Exam } from './exam.entity'; // 假设你的 Exam 实体路径

@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column()
  score: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  // 对应 Prisma 的 answererId
  @Column()
  answererId: number;

  // 对应 Prisma 的 answerer User @relation...
  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: 'answererId' })
  answerer: User;

  // 对应 Prisma 的 examId
  @Column()
  examId: number;

  // 对应 Prisma 的 exam Exam @relation...
  @ManyToOne(() => Exam, (exam) => exam.answers)
  @JoinColumn({ name: 'examId' })
  exam: Exam;
}
