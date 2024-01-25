import { dataSource } from "../configs/dbConfig";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";

export const getChatsByDepartmentService = async (
	deptId: number
): Promise<{
	statusCode: number;
	chats?: Chat[] | null;
	message: string;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const allChats = await chatRepository.find({
			where: {
				department: { id: deptId },
			},
			relations: ["department", "customer", "representative", "messages"],
		});

		return {
			statusCode: 201,
			chats: allChats,
			message: "All Departments fetched successfully",
		};
	} catch (err) {
		console.error("Error getting Group", err);
		throw new Error("Error getting Group");
	}
};

export const assignChatToAgentService = async (
    chatId: number,
    representativeId: number
): Promise<{
	statusCode: number;
	chat?: Chat | null;
	message: string;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const userRepository = dataSource.getRepository(User);
		const chat = await chatRepository.findOne({
			where: {
				id: chatId,
			},
			relations: ["department", "customer", "representative", "messages"],
		});

		if (chat) {
			const representative = await userRepository.findOne({
				where: {
					id: representativeId,
				},
			});
			chat.representative = representative;
			await chatRepository.save(chat);
		}

		return {
			statusCode: 201,
			chat: chat,
			message: "Chat assigned to representative successfully",
		};
	} catch (err) {
		console.error("Error getting Group", err);
		throw new Error("Error getting Group");
	}
}