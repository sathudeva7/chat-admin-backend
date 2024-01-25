import express from "express";
import { create } from "../../controllers/customer.controller";

const customerRouter = express.Router();

customerRouter.post("/create", create);

export default customerRouter;
