import express from "express";
import { requireAuth } from "../../controllers/auth.controller";
import { getAllUsersController, getUserByIdController } from "../../controllers/userController";

const userRouter = express.Router();

userRouter.get("/user/:id",requireAuth, getUserByIdController);
userRouter.get("/all",requireAuth, getAllUsersController);

export default userRouter;
