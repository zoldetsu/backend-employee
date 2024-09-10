import express from "express";
import { login, register, poster, getMe } from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.get("/current", auth, poster);

router.get("/me", auth, getMe);

export default router;
