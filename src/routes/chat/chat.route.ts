import express from "express";
import { assignChatToAgent, getChatsByDepartment, getMessagesByChat } from "../../controllers/chat.controller";

const chatRouter = express.Router();

chatRouter.get("/department/:deptId", getChatsByDepartment); 
chatRouter.put("/assign/:chatId", assignChatToAgent);
chatRouter.get("/messages/:chatId", getMessagesByChat);

export default chatRouter;