import { dataSource } from "../configs/dbConfig";
import { Chat } from "../entity/Chat";
import { Department } from "../entity/Department";
import { User } from "../entity/User";

export const getAdminById = async (
	id: number
): Promise<{
	statusCode: number;
	user?: User[] | null;
	message: string;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const departmentRepository = dataSource.getRepository(Department);
		const messageCount = await chatRepository.createQueryBuilder('chat')
			.select('department.id', 'departmentId')
			.addSelect("SUM(CASE WHEN chat.status = 'Init' THEN 1 ELSE 0 END)", 'initChatCount')
			.addSelect("SUM(CASE WHEN chat.status = 'Inprog' THEN 1 ELSE 0 END)", 'inprogChatCount')
			.leftJoin('chat.department', 'department')
			.where('chat.status IN (:...statuses)', { statuses: ['Init', 'Inprog'] })
			.groupBy('department.id')
			.getRawMany();

			console.log(messageCount);
		
		const userRepository = dataSource.getRepository(User);

		//get user by id
		const user = await userRepository.find({
			where: { id: id }
		});

		const departments = await departmentRepository.find();

		const chatMessageCount = departments.map((department: any) => {
			const departmentId = department.id;
			const initChatCount = messageCount.find((item: any) => item.departmentId === departmentId)?.initChatCount;
			const inprogChatCount = messageCount.find((item: any) => item.departmentId === departmentId)?.inprogChatCount;
			return {
				...department,
				initChatCount: initChatCount || 0,
				inprogChatCount: inprogChatCount || 0,
			};
		})
		
console.log("user", user, chatMessageCount);
          const output = {
			...user[0],
			user_id: user[0].id,
			departments: chatMessageCount,
		}


		if (!user) {
			return {
				statusCode: 404,
				message: "User not found.",
			};
		}

		return {
			statusCode: 200,
			user: [output],
			message: "User fetched successfully",
		};
	} catch (err) {
		console.error("Error getting User", err);
		throw new Error("Error getting User");
	}
};

export const getAllChatService = async (
): Promise<{
	statusCode: number;
	chats?: Chat[] | null;
	message: string;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const allChats = await chatRepository.find();

		return {
			statusCode: 201,
			chats: allChats,
			message: "All Chat messages fetched successfully",
		};
	} catch (err) {
		console.error("Error getting Group", err);
		throw new Error("Error getting Group");
	}
}
