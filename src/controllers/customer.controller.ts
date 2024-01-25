import { Request, Response } from 'express';
import { createCustomer } from '../services/customer.service';

// Create a new department
export async function create(req: Request, res: Response) {
	const { email, name, mobileNo, dept_id } = req.body;

    try {
        const { statusCode, message, customer, chat } = await createCustomer(name, email, mobileNo, dept_id);

        return res.status(statusCode).json({ message, customer, chat });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating department.', error });
    }
}