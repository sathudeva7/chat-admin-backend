import express from "express";
import {
  register,
  login,
  setPassword,
} from "../../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/password-set", setPassword);

export default authRouter;
