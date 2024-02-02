import express from "express";
import { requireAuth } from "../../controllers/auth.controller";
import { endChatController, getAllUsersController, getUserByIdController } from "../../controllers/userController";

const userRouter = express.Router();

userRouter.get("/user/:id",requireAuth, getUserByIdController);
userRouter.get("/all",requireAuth, getAllUsersController);
userRouter.put("/endchat/:id", endChatController)

export default userRouter;
