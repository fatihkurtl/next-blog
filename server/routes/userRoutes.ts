import express from "express";
import {
  saveUser,
  loginUser,
  updateUser,
  getUser,
} from "../controllers/userControllers";

const router = express.Router();

router.post("/register", saveUser);
router.post("/login", loginUser);
router.put("/update/:id", updateUser);
router.get("/:id", getUser);

export default router;
