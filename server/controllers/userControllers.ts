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
        return res
          .status(500)
          .json({ error: "Dosya yüklenirken bir hata oluştu." });
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
      .json({ message: "Kullanıcı başarıyla kaydedildi.", success: true });
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
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    console.log("Token:", token);
    console.log("Expires:", expiresAt);

    const result = await query(
      "INSERT INTO tokens (token, expires_at) VALUES ($1, $2) RETURNING *",
      [token, expiresAt]
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
        expires_at: expiresAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const selectedUser = await query("SELECT * FROM users WHERE id = $1", [id]);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const user = selectedUser.rows[0];
    const image = user.image || user.imageurl;
    const userData = {
      ...user,
      image: image
        ? image.startsWith("http")
          ? image
          : `${baseUrl}${image}`
        : null,
      imageUrl: undefined,
    };
    console.log("User:", userData);
    res.status(200).json({ success: true, user: {
      id: userData.id,
      fullname: userData.fullname,
      image: userData.image,
      username: userData.username,
      email: userData.email,
      date: userData.date,
      terms: userData.terms,
      token: userData.token,
    } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    let imageUrl = null;
    const { fullname, username, email } = req.body;
    const { id } = req.params;
    console.log("user id:", id);
    console.log("user update body:", fullname, username, email);
    if (req.file) {
      try {
        console.log("req.file:", req.file);
        console.log(
          "Received file:",
          req.file.originalname,
          req.file.mimetype,
          req.file.size
        );
        imageUrl = await uploadFile(req.file);
        console.log("File uploaded successfully:", imageUrl);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Dosya yüklenirken bir hata oluştu." });
      }
    }

    const selectedUser = await query("SELECT * FROM users WHERE id = $1", [id]);
    if (selectedUser.rowCount === 0) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı." });
    }
    const user = selectedUser.rows[0];
    console.log("Selected user:", user);

    const updatedUser = await query(
      "UPDATE users SET fullname = $1, username = $2, email = $3, imageurl = $4 WHERE id = $5 RETURNING *",
      [fullname, username, email, imageUrl, id]
    );

    if (updatedUser.rowCount === 0) {
      return res
        .status(400)
        .json({ error: "Kullanıcı bilgileri güncellenemedi." });
    }

    console.log("Updated user:", updatedUser.rows[0]);
    console.log(user.imageurl);
    res.status(200).json({
      message: "Kullanıcı bilgileri güncellendi.",
      success: true,
      user: {
        fullname: user.fullname,
        image: user.imageurl,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isTokenValid = async (token: string): Promise<boolean> => {
  const result = await query(
    "SELECT * FROM tokens WHERE token = $1 AND expires_at > NOW()",
    [token]
  );
  return result.rowCount! > 0;
};
