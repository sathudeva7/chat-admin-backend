import { Request, Response } from 'express';
import { User } from '../entity/User';
import { createDepartment, getAllDepartments } from '../services/department.service';

// Create a new department
export async function create(req: Request, res: Response) {
    const { name } = req.body;

    try {
        const user = req.user as User;

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Only Admins are allowed" });
        }

        const { statusCode, message, department } = await createDepartment(name);

        return res.status(statusCode).json({ message, department });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating department.', error });
    }
}

// Get all departments
export async function all(req: Request, res: Response) {

    try {
        const { statusCode, message, department } = await getAllDepartments();

        return res.status(statusCode).json({ message, department });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving departments.', error });
    }
}
