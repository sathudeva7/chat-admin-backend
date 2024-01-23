import express from "express";
import {
  create,
  all
} from "../../controllers/department.controller";
import { requireAuth } from "../../controllers/auth.controller";

const departmentRouter = express.Router();

departmentRouter.post("/create",requireAuth, create);
departmentRouter.get("/all",requireAuth, all);

export default departmentRouter;
