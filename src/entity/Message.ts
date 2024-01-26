import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne
} from "typeorm";
import { Chat } from "./Chat";
@Entity()
export class Message {

	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne(() => Chat, chat => chat.messages)
	chat!: Chat;

	@Column("boolean")
	from_customer!: boolean;

	@Column("text")
	message_text!: string;

	@CreateDateColumn({ type: "timestamp" })
	created_at!: Date;
}
