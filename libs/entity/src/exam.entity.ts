import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity'; // 确保路径正确

@Entity('exam')
export class Exam {
  @PrimaryGeneratedColumn({
    comment: '主键ID',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '试卷名称',
  })
  name: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_publish',
    comment: '是否发布',
  })
  isPublish: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_delete',
    comment: '是否逻辑删除',
  })
  isDelete: boolean;

  @Column({
    type: 'text',
    comment: '试卷内容',
  })
  content: string;

  @CreateDateColumn({
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date;

  // 外键 ID 列
  @Column({
    name: 'create_user_id',
    comment: '创建人ID',
  })
  createUserId: number;

  // 多对一关系：多个考试可以由一个用户创建
  @ManyToOne(() => User, (user) => user.exams)
  @JoinColumn({ name: 'create_user_id' })
  createUser: User;
}
