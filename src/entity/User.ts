import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany
   } from "typeorm";
import { Chat } from "./Chat";
import { UserDepartment } from "./UserDepartment";

   
   @Entity()
   export class User {
   
	  @PrimaryGeneratedColumn()
	  id!: number;
   
	  @Column()
	  username!: string;
   
	  @Column({select: false})
	  password!: string;
   
	  @Column({ unique: true })
	  email!: string;
   
	  @OneToMany(() => UserDepartment, userDepartment => userDepartment.department)
       userDepartments!: UserDepartment[];
   
	  @Column()
	  role!: string;
   
	  @Column()
	  status!: string;
   
	  @CreateDateColumn({ type: "timestamp" })
	  created_at!: Date;
   
	  @OneToMany(() => Chat, chat => chat.representative)
	  chats!: Chat[];
   }
   