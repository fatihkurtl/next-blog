import { Request, Response } from "express";
import { query } from "../utils/db";
import { createPostTable } from "../helpers/create-post-table";
import { uploadFile } from "../helpers/upload-file";

interface BlogPost {
  id: number;
  title: string;
  subTitle: string;
  category_id: number;
  imageUrl: string;
  content: string;
  date: string;
  author: string;
}

export const getPosts = async (req: Request, res: Response) => {
  try {
    const result = await query("SELECT * FROM posts ORDER BY date DESC");
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const posts: BlogPost[] = result.rows.map((post) => {
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
      posts.map(async (post) => {
        const category = await query(
          "SELECT name FROM categories WHERE id = $1",
          [post.category_id]
        );
        return { ...post, category: category.rows[0].name };
      })
    );
    res.status(200).json({ data: postsWithCategories });
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query("SELECT * FROM posts WHERE id = $1", [id]);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const post = result.rows[0];
    const imageUrl = post.imageurl || post.imageUrl;
    const postData = {
      ...post,
      imageUrl: imageUrl
        ? imageUrl.startsWith("http")
          ? imageUrl
          : `${baseUrl}${imageUrl}`
        : null,
      imageurl: undefined,
    };
    const category = await query("SELECT name FROM categories WHERE id = $1", [
      post.category_id,
    ]);
    postData.category = category.rows[0].name;
    return res.status(200).json({ data: postData });
  } catch (error) {
    console.error("Error in getPostById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    await createPostTable();
    let imageUrl = null;
    const { title, subtitle, category, content, author, user_id } = req.body;

    if (req.file) {
      try {
        imageUrl = await uploadFile(req.file);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Dosya yüklenirken bir hata oluştu." });
      }
    }

    const selectedCategory = await query(
      "SELECT * FROM categories WHERE name = $1",
      [category]
    );
    let categoryId;
    if (selectedCategory.rowCount === 0) {
      const insertResult = await query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [category]
      );
      categoryId = insertResult.rows[0].id;
    } else {
      categoryId = selectedCategory.rows[0].id;
    }

    const result = await query(
      "INSERT INTO posts (title, subTitle, category_id, imageUrl, content, author, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, subtitle, categoryId, imageUrl, content, author, user_id]
    );
    const newPost: BlogPost = result.rows[0];
    res
      .status(201)
      .json({
        message: "Gönderi başarıyla oluşturuldu",
        success: true,
        data: newPost,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
