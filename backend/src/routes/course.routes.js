import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateCourse, getMyCourse } from "../controllers/course.controller.js";

const router = Router();

router.post("/generate", requireAuth, generateCourse);
router.get("/my-course", requireAuth, getMyCourse);

export default router;
