import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Department } from "./Department";

@Entity()
export class UserDepartment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.userDepartments)
    @JoinColumn()
    user!: User;

    @ManyToOne(() => Department, department => department.userDepartments)
    @JoinColumn()
    department!: Department;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
}
