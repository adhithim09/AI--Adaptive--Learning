import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { generate, submit } from "../controllers/assessment.controller.js";

const router = Router();

router.get("/generate", requireAuth, generate);
router.post("/submit", requireAuth, submit);

export default router;

