import { dataSource } from "../configs/dbConfig";
import { Chat } from "../entity/Chat";
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
		// const userRepository = dataSource.getRepository(User);
		const chatRepository = dataSource.getRepository(Chat);
		const messageCount = await chatRepository.createQueryBuilder('chat')
			.select('department.id', 'departmentId')
			.addSelect("SUM(CASE WHEN chat.status = 'Init' THEN 1 ELSE 0 END)", 'initChatCount')
			.addSelect("SUM(CASE WHEN chat.status = 'Inprog' THEN 1 ELSE 0 END)", 'inprogChatCount')
			.leftJoin('chat.department', 'department')
			.where('chat.status IN (:...statuses)', { statuses: ['Init', 'Inprog'] })
			.groupBy('department.id')
			.getRawMany();

		const user = await dataSource.query(`
    SELECT 
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
    WHERE 
        "user"."id" = $1
    GROUP BY 
        "user"."id"
`, [id]);

		const output = user[0].departments.map((department: any) => {
			const departmentId = department.id;
			const initChatCount = messageCount.find((item: any) => item.departmentId === departmentId)?.initChatCount;
			const inprogChatCount = messageCount.find((item: any) => item.departmentId === departmentId)?.inprogChatCount;
			return {
				...department,
				initChatCount: initChatCount || 0,
				inprogChatCount: inprogChatCount || 0,
			};
		});

		user[0].departments = output;


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

export const endChat = async (id: number): Promise<{
	statusCode: number;
	message: string;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const chat = await chatRepository.findOne({ where: { id } });

		if (!chat) {
			return {
				statusCode: 404,
				message: "Chat not found.",
			};
		}

		chat.status = "Closed";
		await chatRepository.save(chat);

		return {
			statusCode: 200,
			message: "Chat ended successfully",
		};
	} catch (err) {
		console.error("Error ending Chat", err);
		throw new Error("Error ending Chat");
	}
}