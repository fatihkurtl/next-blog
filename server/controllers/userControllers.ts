import { Request, Response } from "express";
import crypto from "crypto";
import { query } from "../utils/db";
import { createUserTable } from "../helpers/create-user-table";
import { uploadFile } from "../helpers/upload-file";

interface User {
  id: number;
  fullname: string;
  image: string | null;
  token_id: number | null;
  username: string;
  email: string;
  date: string;
  terms: boolean;
}

export const saveUser = async (req: Request, res: Response) => {
  try {
    await createUserTable();
    let imageUrl = null;

    const { fullname, username, email, password, terms } = req.body;
    if (req.file) {
      console.log(
        "Received file:",
        req.file.originalname,
        req.file.mimetype,
        req.file.size
      );
      try {
        imageUrl = await uploadFile(req.file);
        console.log("File uploaded successfully:", imageUrl);
      } catch (error) {
        console.error(error);
      }
    }

    const selectedUser = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const selectedUsername = await query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (selectedUser.rowCount !== 0 || selectedUsername.rowCount !== 0) {
      return res.status(400).json({
        error: "Bu kullanıcı adı ya da e-posta adresi zaten kayıtlı.",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    console.log("Hashed password:", hashedPassword);

    const result = await query(
      "INSERT INTO users (fullname, username, email, password, terms) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [fullname, username, email, hashedPassword, terms]
    );
    const newUser: User = result.rows[0];
    console.log("User created:", newUser);
    res
      .status(201)
      .json({ message: "Kullanıcı başarıyla kaydedildi", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "E-posta adresi ve şifre gereklidir." });
    }

    const selectedUser = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (selectedUser.rowCount === 0) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı." });
    }

    const user = selectedUser.rows[0];

    if (user.token_id) {
        await query("UPDATE users SET token_id = NULL WHERE id = $1", [user.id]);
        await query("DELETE FROM tokens WHERE id = $1", [user.token_id]);
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    console.log("Hashed password:", hashedPassword);
    if (user.password !== hashedPassword) {
      return res.status(400).json({ error: "Hatalı sifre." });
    }

    const token = crypto.randomBytes(64).toString("hex");
    console.log("Token:", token);
    const result = await query(
      "INSERT INTO tokens (token) VALUES ($1) RETURNING *",
      [token]
    );
    const tokenId = result.rows[0].id;

    await query("UPDATE users SET token_id = $1 WHERE id = $2", [
      tokenId,
      user.id,
    ]);

    console.log("User logged in:", user);

    res.status(200).json({
      success: true,
      message: "Giriş başarılı.",
      user: {
        id: user.id,
        fullname: user.fullname,
        image: user.image,
        username: user.username,
        email: user.email,
        date: user.date,
        terms: user.terms,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
