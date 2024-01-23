import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn
   } from "typeorm";

   @Entity()
   export class Customer {

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	email!: string;

	@Column()
	name!: string;

	@Column()
	mobileNo!: string;

	@CreateDateColumn({ type: "timestamp" })
	created_at!: Date;
}
