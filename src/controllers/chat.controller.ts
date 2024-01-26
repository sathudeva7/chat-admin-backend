import { Request, Response } from 'express';
import { assignChatToAgentService, getAllMessagesByChatService, getChatsByDepartmentService } from '../services/chat.service';

// Create a new department
export async function getChatsByDepartment(req: Request, res: Response) {
	const deptId = parseInt(req.params.deptId, 10);

    try {
        const { statusCode, message, chats } = await getChatsByDepartmentService(deptId);

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
