import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import { dataSource } from "./configs/dbConfig";
import authRouter from "./routes/auth/auth.route";
import departmentRouter from "./routes/department/department.route";
import passport from "passport";
import "./configs/passport";
import userRouter from "./routes/user/user.route";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.all('*', function (req, res) {
   res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
 res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
});
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/users", userRouter);

export const startServer = async (port: number): Promise<Express> => {
  try {
    await dataSource.initialize();
    console.log("DB connection is successful");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

    return app;
  } catch (err) {
    console.log("DB connection was not successful", err);
    throw err;
  }
};

export default startServer;
