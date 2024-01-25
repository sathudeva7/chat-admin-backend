import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Department } from "./Department";
import { User } from "./User";
import { Message } from "./Message";
import { Customer } from "./Customer";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Department, (department) => department.chats)
  department!: Department;

  @ManyToOne(() => Customer) // Change to a ManyToOne relationship with Customer
  customer!: Customer;

  @Column()
  status!: string;

  @ManyToOne(() => User, (user) => user.chats)
  representative!: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages!: Message[];
}
