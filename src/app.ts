import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import { dataSource } from "./configs/dbConfig";
import authRouter from "./routes/auth/auth.route";
import departmentRouter from "./routes/department/department.route";
import passport from "passport";
import "./configs/passport";
import userRouter from "./routes/user/user.route";
import customerRouter from "./routes/customer/customer.route";
import chatRouter from "./routes/chat/chat.route";
const { Server } = require("socket.io");
const http = require('http');
const socketHandler = require('./socket/socketHandler');

export const app = express();
app.use(cors({ credentials: true, origin: "*" }))
app.use(cookieParser());
app.use(bodyParser.json());


app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/users", userRouter);
app.use('/api/customer', customerRouter);
app.use('/api/chats', chatRouter);
 dataSource.initialize();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);
  
  socketHandler(io, socket);
});
server.listen(3001, () => {
  console.log("listening on *:3001");
});
