import express from "express";
import {
  saveUser,
  loginUser,
  updateUser,
  getUser,
  updateUserPassword,
  getUserPosts,
  deleteUserPost,
  updateUserPost,
  isTokenValid,
} from "../controllers/userControllers";

const router = express.Router();

router.post("/register", saveUser);
router.post("/login", loginUser);
router.put("/update/:id", updateUser);
router.get("/:id", getUser);
router.put("/update/password/:id", updateUserPassword);
router.get("/posts/:id", getUserPosts);
router.put("/update/posts/:id", updateUserPost);
router.delete("/delete/posts/:id", deleteUserPost);

router.post("/isTokenValid", isTokenValid);

export default router;
