import { Request, Response } from "express";
import crypto from "crypto";
import { query } from "../utils/db";
import { createUserTable } from "../helpers/create-user-table";
import { uploadFile } from "../helpers/upload-file";
import { deleteOldImage } from "../helpers/delete-old-file";

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

    await query(
      "INSERT INTO users (fullname, username, email, password, terms) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [fullname, username, email, hashedPassword, terms]
    );
    return res
      .status(201)
      .json({ message: "Kullanıcı başarıyla kaydedildi.", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
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

    if (user.password !== hashedPassword) {
      return res.status(400).json({ error: "Hatalı sifre." });
    }

    const token = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

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

    return res.status(200).json({
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
    return res.status(500).json({ error: "Internal server error" });
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

    return res.status(200).json({
      success: true,
      user: {
        id: userData.id,
        fullname: userData.fullname,
        image: userData.image,
        username: userData.username,
        email: userData.email,
        date: userData.date,
        terms: userData.terms,
        token: userData.token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    let imageUrl = null;
    const { fullname, username, email } = req.body;
    const { id } = req.params;

    const selectedUser = await query("SELECT * FROM users WHERE id = $1", [id]);
    if (selectedUser.rowCount === 0) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı." });
    }
    const user = selectedUser.rows[0];

    if (req.file) {
      try {
        await deleteOldImage(user.imageurl);

        imageUrl = await uploadFile(req.file);

        await query("UPDATE users SET imageurl = $1 WHERE id = $2", [
          imageUrl,
          id,
        ]);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Dosya yüklenirken bir hata oluştu." });
      }
    }

    const updatedUser = await query(
      "UPDATE users SET fullname = $1, username = $2, email = $3 WHERE id = $4 RETURNING *",
      [fullname, username, email, id]
    );

    if (updatedUser.rowCount === 0) {
      return res
        .status(400)
        .json({ error: "Kullanıcı bilgileri güncellenemedi." });
    }

    console.log("Updated user:", updatedUser.rows[0]);
    console.log(user.imageurl);
    return res.status(200).json({
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
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const selectedUser = await query("SELECT * FROM users WHERE id = $1", [id]);

    if (selectedUser.rowCount === 0) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı." });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(oldPassword)
      .digest("hex");

    if (selectedUser.rows[0].password !== hashedPassword) {
      return res.status(400).json({ error: "Eski şifre hatalı." });
    }

    const hashedNewPassword = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");
    await query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      id,
    ]);

    return res
      .status(200)
      .json({ success: true, message: "Şifre güncellendi." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query("SELECT * FROM posts WHERE user_id = $1", [id]);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const userPosts = result.rows.map((post) => {
      const imageUrl = post.imageurl || post.imageUrl;
      return {
        ...post,
        imageUrl: imageUrl
          ? imageUrl.startsWith("http")
            ? imageUrl
            : `${baseUrl}${imageUrl}`
          : null,
        imageurl: undefined,
      };
    });
    const postsWithCategories = await Promise.all(
      userPosts.map(async (post) => {
        const category = await query(
          "SELECT name FROM categories WHERE id = $1",
          [post.category_id]
        );
        return { ...post, category: category.rows[0].name };
      })
    );

    return res.status(200).json({ data: postsWithCategories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserPost = async (req: Request, res: Response) => {
  try {
    let imageUrl = null;
    const { id } = req.params;
    const { title, subtitle, category, category_id, content, user_id } =
      req.body;

    const selectedPost = await query("SELECT * FROM posts WHERE id = $1", [id]);
    const post = selectedPost.rows[0];
    if (post.rowCount === 0) {
      return res.status(400).json({ error: "Post bulunamadı." });
    }
    if (req.file) {
      try {
        await deleteOldImage(post.imageurl);
        imageUrl = await uploadFile(req.file);

        await query("UPDATE posts SET imageUrl = $1 WHERE id = $2", [
          imageUrl,
          id,
        ]);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Dosya yüklenirken bir hata oluştu." });
      }
    } else {
      imageUrl = post.imageurl;
    }

    const updatePost = await query(
      "UPDATE posts SET title = $1, subtitle = $2, category_id = $3, content = $4, imageurl = $5 WHERE id = $6",
      [title, subtitle, category_id, content, imageUrl, id]
    );

    if (updatePost.rowCount === 0) {
      return res.status(400).json({ error: "Post güncellenemedi." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Gönderi güncellendi." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUserPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await query("SELECT * FROM posts WHERE id = $1", [id]);
    if (post.rowCount === 0) {
      return res.status(400).json({ error: "Post bulunamadı." });
    }

    const userPost = await query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );

    if (userPost.rowCount === 0) {
      return res.status(400).json({ error: "Post silinemedi." });
    }
    if (post.rows[0].imageurl) {
      const imageUrl = post.rows[0].imageurl;
      await deleteOldImage(imageUrl);
    }

    res.status(200).json({ success: true, message: "Gönderi silindi." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isTokenValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    const result = await query(
      "SELECT * FROM tokens WHERE token = $1 AND expires_at > NOW()",
      [token]
    );
    const isValid = result.rowCount! > 0;
    res.json({ isValid });
  } catch (error) {
    console.error("Token kontrol hatası:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
