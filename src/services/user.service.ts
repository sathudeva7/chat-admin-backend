import { dataSource } from "../configs/dbConfig";
import { User } from "../entity/User";

// Get user by ID
export const getUserById = async (
	id: number
): Promise<{
	statusCode: number;
	user?: User | null;
	message: string;
}> => {
	try {
		const userRepository = dataSource.getRepository(User);
		const user = await userRepository.createQueryBuilder("department")
			.leftJoinAndSelect("department.userDepartments", "userDepartment")
			.leftJoinAndSelect("userDepartment.department", "user")
			.where("user.id = :id", { id })
			.getOne();

		if (!user) {
			return {
				statusCode: 404,
				message: "User not found.",
			};
		}

		return {
			statusCode: 200,
			user: user,
			message: "User fetched successfully",
		};
	} catch (err) {
		console.error("Error getting User", err);
		throw new Error("Error getting User");
	}
};

// Get all users
export const getAllUsers = async (): Promise<{
	statusCode: number;
	users?: User[] | null;
	message: string;
}> => {
	try {

		const allUsers = await dataSource
			.query(`SELECT 
    "user"."id" AS user_id,
    "user"."username" AS username,
    "user"."email" AS email,
    json_agg(json_build_object('id', "department"."id", 'name', "department"."name")) AS departments
FROM 
    "user"
JOIN 
    "user_department" ON "user"."id" = "user_department"."userId"
JOIN 
    "department" ON "user_department"."departmentId" = "department"."id"
GROUP BY 
    "user"."id"`);


		return {
			statusCode: 200,
			users: allUsers,
			message: "All Users fetched successfully",
		};
	} catch (err) {
		console.error("Error getting Users", err);
		throw new Error("Error getting Users");
	}
};
