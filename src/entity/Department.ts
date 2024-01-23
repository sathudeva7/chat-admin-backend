import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany
   } from "typeorm";
import { Chat } from "./Chat";
import { UserDepartment } from "./UserDepartment";
   
   @Entity()
   export class Department {
   
	  @PrimaryGeneratedColumn()
	  id!: number;
   
	  @Column()
	  name!: string;
   
	  @CreateDateColumn({ type: "timestamp" })
	  created_at!: Date;
   
	  @OneToMany(() => UserDepartment, userDepartment => userDepartment.user)
       userDepartments!: UserDepartment[];

	  @OneToMany(() => Chat, chat => chat.department)
       chats!: Chat[];
   }
   