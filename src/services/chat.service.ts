import { Brackets } from "typeorm";
import { dataSource } from "../configs/dbConfig";
import { Chat } from "../entity/Chat";
import { Department } from "../entity/Department";
import { Message } from "../entity/Message";
import { User } from "../entity/User";
import { sendEmail } from "../configs/emailService";

export const getChatsByDepartmentService = async (
	deptId: number,
	userId: number
): Promise<{
	statusCode: number;
	chats?: Chat[] | null;
	message: string;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const allChats = await chatRepository.createQueryBuilder('chat')
			.leftJoinAndSelect('chat.department', 'department')
			.leftJoinAndSelect('chat.customer', 'customer')
			.leftJoinAndSelect('chat.representative', 'representative')
			.leftJoinAndSelect('chat.messages', 'messages')
			.where('department.id = :deptId', { deptId })
			.andWhere(new Brackets(qb => {
				qb.where('chat.status = :statusInit', { statusInit: 'Init' })
					.orWhere(new Brackets(subQb => {
						subQb.where('chat.status = :statusInprog', { statusInprog: 'Inprog' })
							.andWhere('representative.id = :userId', { userId });
					}));
			}))
			.getMany();


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
			chat.status = "Inprog";
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

export const getAllMessagesByChatService = async (
	chatId: number
): Promise<{
	statusCode: number;
	messages?: Message[] | null;
	message: string;
}> => {
	try {
		const messageRepository = dataSource.getRepository(Message);
		const allMessages = await messageRepository.find({
			where: {
				chat: { id: chatId },
			}
		});

		return {
			statusCode: 201,
			messages: allMessages,
			message: "All Chat messages fetched successfully",
		};
	} catch (err) {
		console.error("Error getting Group", err);
		throw new Error("Error getting Group");
	}
}

export const changeChatDepartmentService = async (
	chatId: number,
	deptId: number
): Promise<{
	statusCode: number;
	message: string;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const chat = await chatRepository.findOne({
			where: {
				id: chatId,
			},
			relations: ["department", "customer", "representative", "messages"],
		});
		const departmentRepository = dataSource.getRepository(Department);
		const department = await departmentRepository.findOne({
			where: {
				id: deptId,
			},
		});

		if (chat) {
			chat.department = department;
			chat.representative = null;
			await chatRepository.save(chat);
		}

		return {
			statusCode: 201,
			message: "Chat department changed successfully",
		};
	} catch (err) {
		console.error("Error getting Group", err);
		throw new Error("Error getting Group");
	}
}

export const generateChatHistory = async (
	chatId: number
): Promise<{
	statusCode: number;
	message: string;
	chats?: Chat | null;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const chat = await chatRepository.findOne({
			where: {
				id: chatId,
			},
			relations: ["department", "customer", "representative", "messages"],
		});

		if (chat) {
			chat.status = "Closed";
			await chatRepository.save(chat);
		}

		//send email to customer
		//send email to representative


		return {
			statusCode: 201,
			message: "Chat history generated successfully",
			chats: chat,
		};
	} catch (err) {
		console.error("Error getting Group", err);
		throw new Error("Error getting Group");
	}
}

export const sendChatHistoryByEmail = async (
	chatId: number,
	customerEmail: string
): Promise<{
	statusCode: number;
	message: string;
	chat: Chat | null;
}> => {
	try {
		const chatRepository = dataSource.getRepository(Chat);
		const chat = await chatRepository.findOne({
			where: {
				id: chatId,
			},
			relations: ["department", "customer", "representative", "messages"],
		});

		if (chat) {
			// Generate chat history content
			let chatHistory = "";
			chat.messages.forEach((message) => {
				chatHistory += `${message.from_customer ? chat.customer : chat.representative}: ${message.message_text}\n`;
			});

			// Send email to customer
			await sendEmail({
				from: "sample@email.com",
				to: customerEmail,
				subject: "Chat History",
				text: chatHistory,
			});
		}

		return {
			statusCode: 201,
			message: "Chat history sent to customer successfully",
			chat: chat,
		};
	} catch (err) {
		console.error("Error sending chat history", err);
		throw new Error("Error sending chat history");
	}
};
