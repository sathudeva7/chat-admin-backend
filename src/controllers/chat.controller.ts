import { Request, Response } from 'express';
import { assignChatToAgentService, changeChatDepartmentService, getAllMessagesByChatService, getChatsByDepartmentService, sendChatHistoryByEmail } from '../services/chat.service';

// Create a new department
export async function getChatsByDepartment(req: Request, res: Response) {
	const deptId = parseInt(req.params.deptId, 10);
    const userId = parseInt(req.params.userId, 10);

    try {
        const { statusCode, message, chats } = await getChatsByDepartmentService(deptId, userId);

        return res.status(statusCode).json({ message, chats });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating department.', error });
    }
}

export async function assignChatToAgent(req: Request, res: Response) {
    const chatId = parseInt(req.params.chatId, 10);
    const { representativeId } = req.body;

    try {
        const { statusCode, message, chat } = await assignChatToAgentService(chatId, representativeId);

        return res.status(statusCode).json({ message, chat });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating department.', error });
    }
}

export async function getMessagesByChat(req: Request, res: Response) {
    const chatId = parseInt(req.params.chatId, 10);

    try {
        const { statusCode, message, messages } = await getAllMessagesByChatService(chatId);

        return res.status(statusCode).json({ message, messages });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating department.', error });
    }
}

export async function changeChatDepartment(req: Request, res: Response) {
    const chatId = parseInt(req.params.chatId, 10);
    const deptId = parseInt(req.params.deptId, 10);
    try {
        const { statusCode, message } = await changeChatDepartmentService(chatId, deptId);

        return res.status(statusCode).json({ message });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating department.', error });
    }
}

export const getChatHistory = async (req: Request, res: Response) => {
    const chatId = parseInt(req.params.chatId, 10);
    const { email } = req.body;

    try {
        const { statusCode, message, chat } = await sendChatHistoryByEmail(chatId, email);

        return res.status(statusCode).json({ message, chat });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating department.', error });
    }
}

