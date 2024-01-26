import { Request, Response } from 'express';
import { getAllUsers, getUserById } from '../services/user.service';

// Get a user by ID
export async function getUserByIdController(req: Request, res: Response) {
	const id = parseInt(req.params.id, 10);

	if (isNaN(id)) {
	    return res.status(400).json({ message: 'Invalid user ID.' });
	}

    try {
        const { statusCode, message, user } = await getUserById(id);

        return res.status(statusCode).json({ message,success: true, user });
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