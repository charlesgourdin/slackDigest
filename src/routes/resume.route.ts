import express  from "express";

import { ResumeController } from "../controllers/resume.controller";

const router = express.Router();

const resumeController = new ResumeController();

router.post("/", resumeController.resume);

export default router;