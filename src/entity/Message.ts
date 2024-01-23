import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne
   } from "typeorm";
   import { Chat } from "./Chat";
   import { User } from "./User";
   
   @Entity()
   export class Message {
   
	  @PrimaryGeneratedColumn()
	  id!: number;
   
	  @ManyToOne(() => Chat, chat => chat.messages)
	  chat!: Chat;
   
	  @ManyToOne(() => User)
	  representative!: User;
   
	  @Column("text")
	  message_text!: string;
   
	  @CreateDateColumn({ type: "timestamp" })
	  created_at!: Date;
   }
   