import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addEmployee,
  edit,
  getAll,
  getOne,
  remove,
} from "../controllers/emploeers.js";

const router = express.Router();

router.get("/home", auth, getAll);

router.get("/:id", auth, getOne);

router.post("/add", auth, addEmployee);

router.delete("/remove/:id", auth, remove);

router.put("/edit/:id", auth, edit);

export default router;
