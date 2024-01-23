import { dataSource } from "../configs/dbConfig";
import { JWT_SECRET } from "../configs/envConfig";
import { Department } from "../entity/Department";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserDepartment } from "../entity/UserDepartment";

export const registerUser = async (
	username: string,
	password: string,
	email: string,
	departmentId: [Department["id"]],
	role: string,
	status: string
): Promise<{
	statusCode: number;
	message: string;
	user?: User | null;
}> => {
	try {
		const userRepository = dataSource.getRepository(User);
		const departmentRepository = dataSource.getRepository(Department);

		const existingUser: User | null = await userRepository.findOne({
			where: { email: email },
		});

		if (existingUser != null) {
			return { statusCode: 409, message: "Email already exists" };
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user instance
		const user = userRepository.create({
			username,
			password: hashedPassword,
			email,
			role,
			status
		});

		// Save user to database
		await userRepository.save(user);

		for (const id of departmentId) {
			const department = await departmentRepository.findOneBy({ id: id });
			if (department) {
				const userDepartment = new UserDepartment();
				userDepartment.user = user;
				userDepartment.department = department;
				await dataSource.manager.save(userDepartment);
			}
		}
		return {
			statusCode: 201,
			message: "Registration successful",
			user: user,
		};
	} catch (error) {
		console.error("Error executing registration", error);
		return { statusCode: 500, message: "Internal server error" };
	}
}

export const loginUser = async (
	email: string,
	password: string,
): Promise<{ statusCode: number; message: string; token?: string }> => {
	try {
		const userRepository = dataSource.getRepository(User);
		const user = await userRepository
			.createQueryBuilder("user")
			.addSelect("user.password")
			.where({ email: email })
			.getOne();

		if (!user) {
			return { statusCode: 401, message: "Invalid email or password" };
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return { statusCode: 401, message: "Invalid email or password" };
		}

		const token = jwt.sign({ userId: user.id }, JWT_SECRET ?? "", {
			expiresIn: "10h", // To-Do: Change value in production
		});

		return { statusCode: 200, message: "Login successful", token };
	} catch (error) {
		console.error("Error executing login", error);
		return { statusCode: 500, message: "Internal server error" };
	}
};