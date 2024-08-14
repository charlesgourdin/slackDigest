import * as express from "express";
import ResumeRouter from "./resume.route";

const router = express.Router();

router.use("/resume", ResumeRouter);

export default router;