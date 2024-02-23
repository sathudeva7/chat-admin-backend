import { Request, Response } from 'express';
import { endChat, getAllUsers, getUserById } from '../services/user.service';
import { User } from '../entity/User';
import { getAdminById } from '../services/admin.service';

// Get a user by ID
export async function getUserByIdController(req: Request, res: Response) {
	const id = parseInt(req.params.id, 10);

	if (isNaN(id)) {
	    return res.status(400).json({ message: 'Invalid user ID.' });
	}

    try {
        const userData = req.user as User;

        if (userData.role == 'admin') {
            const { statusCode, message, user } = await getAdminById(id);
            return res.status(statusCode).json({ message,success: true, user });
        } else {
            const { statusCode, message, user } = await getUserById(id);
            return res.status(statusCode).json({ message,success: true, user });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving user.', error });
    }
}

// Get all users
export async function getAllUsersController(req: Request, res: Response) {
    try {
        const { statusCode, message, users } = await getAllUsers();

        return res.status(statusCode).json({ message, users });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving users.', error });
    }
}

export async function endChatController(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);

	if (isNaN(id)) {
	    return res.status(400).json({ message: 'Invalid chat ID.' });
	}
        const { statusCode, message } = await endChat(id);

        return res.status(statusCode).json({ message });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving users.', error });
    }
}