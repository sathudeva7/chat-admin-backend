import express from "express";
import { assignChatToAgent, getChatsByDepartment } from "../../controllers/chat.controller";

const chatRouter = express.Router();

chatRouter.get("/department/:deptId", getChatsByDepartment); 
chatRouter.put("/assign/:chatId", assignChatToAgent);

export default chatRouter;