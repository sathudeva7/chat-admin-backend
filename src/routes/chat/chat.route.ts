import express from "express";
import { assignChatToAgent, changeChatDepartment, getChatsByDepartment, getMessagesByChat } from "../../controllers/chat.controller";

const chatRouter = express.Router();

chatRouter.get("/department/:deptId/:userId", getChatsByDepartment); 
chatRouter.put("/assign/:chatId", assignChatToAgent);
chatRouter.get("/messages/:chatId", getMessagesByChat);
chatRouter.put("/changeDepartment/:chatId/:deptId", changeChatDepartment);

export default chatRouter;