import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import passport from "passport";
import { dataSource } from '../configs/dbConfig';
import { loginUser, registerUser } from '../services/auth.service';
import { JWT_SECRET } from '../configs/envConfig';

// Register User
export async function register(req: Request, res: Response) {
    const { username, password, email, departmentId, role, status } = req.body;

    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required fields" });
        }
        const { statusCode, message, user } = await registerUser(username, password, email, departmentId, role, status);
        return res.status(statusCode).json({ message, user });
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user.', error });
    }
}

// Login User
export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required fields" });
        }

        const { statusCode, message,user, token } = await loginUser(email, password);

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false, // TODO: Set to true when using HTTPS
        });

        return res.status(statusCode).json({ message, success: true, user });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in.', error });
    }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate("jwt", { session: false }, (err: Error, user: User) => {
    if (err) {
      next(err);
      return;
    }

    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (decoded.exp && Date.now() > decoded.exp * 1000) {
      return res
        .status(401)
        .json({ error: "Token expired, please log in again" });
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorised" });
    } else {
      req.user = user;
      return next();
    }
  })(req, res, next);
};

// Set Password
export async function setPassword(req: Request, res: Response) {
    const { userId, newPassword } = req.body;
    const userRepository = dataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await userRepository.save(user);

        return res.json({ message: 'Password set successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error setting password.', error });
    }
}
