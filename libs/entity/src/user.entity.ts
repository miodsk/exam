import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, // 1. 必须引入关系装饰器
} from 'typeorm';
import { Exam } from './exam.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;

  // 2. 修正关系定义：一个用户可以创建多张试卷
  // 第一个参数是目标实体，第二个参数是对方实体中对应本实体的字段名
  @OneToMany(() => Exam, (exam) => exam.createUser)
  exams: Exam[];

  @CreateDateColumn({
    name: 'create_time',
    type: 'timestamp',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
  })
  updateTime: Date;
}
