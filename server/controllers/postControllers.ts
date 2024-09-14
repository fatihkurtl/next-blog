import { Request, Response } from 'express';
import { query } from  '../utils/db';
import { createPostTable } from '../helpers/create-post-table';
import { uploadFile } from '../helpers/upload-file';

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
  
//   const blogPosts: BlogPost[] = [
//     { id: 1, title: "Next.js'e Giriş", subTitle: "Next.js'in temel özelliklerini ve avantajlarını keşfedin.", imageUrl: "https://picsum.photos/seed/nextjs/400/300", content: "post 1 content", date: "2024-03-01", author: "Ali Yılmaz" },
//     { id: 2, title: "Bootstrap ile Responsive Tasarım", subTitle: "Bootstrap grid sistemini kullanarak mobil uyumlu web siteleri oluşturun.", imageUrl: "https://picsum.photos/seed/bootstrap/400/300", content: "post 2 content", date: "2024-03-05", author: "Ayşe Demir" },
//     { id: 3, title: "TypeScript ve React", subTitle: "React projelerinizde TypeScript kullanmanın faydalarını öğrenin.", imageUrl: "https://picsum.photos/seed/typescript/400/300", content: "post 3 content", date: "2024-03-10", author: "Mehmet Kaya" },
//     { id: 4, title: "CSS Grid Layout", subTitle: "Modern web tasarımında CSS Grid Layout kullanımı.", imageUrl: "https://picsum.photos/seed/cssgrid/400/300", content: "post 4 content", date: "2024-03-15", author: "Zeynep Şahin" },
//     { id: 5, title: "JavaScript ES6+ Özellikleri", subTitle: "JavaScript'in modern özelliklerini keşfedin ve kodunuzu geliştirin.", imageUrl: "https://picsum.photos/seed/es6/400/300", content: "post 5 content", date: "2024-03-20", author: "Emre Yıldız" },
//     { id: 6, title: "React Hooks Derinlemesine", subTitle: "React Hooks ile fonksiyonel komponent geliştirme.", imageUrl: "https://picsum.photos/seed/reacthooks/400/300", content: "post 6 content", date: "2024-03-25", author: "Selin Arslan" },
//   ];


export const getPosts = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM posts ORDER BY date DESC');
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const posts: BlogPost[] = result.rows.map(post => {
            const imageUrl = post.imageurl || post.imageUrl;
            return {
                ...post,
                imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`) : null,
                imageurl: undefined
            };
        });
        console.log('Posts:', posts);
        const postsWithCategories = await Promise.all(posts.map(async (post) => {
            const category = await query('SELECT name FROM categories WHERE id = $1', [post.category_id]);
            return { ...post, category: category.rows[0].name };
        }));
        console.log('Posts with categories:', postsWithCategories);
        res.status(200).json({ data: postsWithCategories });
    } catch (error) {
        console.error('Error in getPosts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM posts WHERE id = $1', [id]);
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const post = result.rows[0];
        const imageUrl = post.imageurl || post.imageUrl;
        const postData = {
            ...post,
            imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`) : null,
            imageurl: undefined
        };
        const category = await query('SELECT name FROM categories WHERE id = $1', [post.category_id]);
        postData.category = category.rows[0].name;
        console.log('Post:', postData);
        res.status(200).json({ data: postData });
    } catch (error) {
        console.error('Error in getPostById:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        await createPostTable();
        // const { title, subTitle, category, imageUrl, content, author } = req.body;
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request method:', req.method);
        console.log('Request file:', req.file);
        let imageUrl = null;
        const { title, subTitle, category, content, author } = req.body;

        if (req.file) {
            console.log('Received file:', req.file.originalname, req.file.mimetype, req.file.size);
            try {
                imageUrl = await uploadFile(req.file);
                console.log('File uploaded successfully:', imageUrl);
            } catch (error) {
                console.error(error);
            }
        }

        const selectedCategory = await query('SELECT * FROM categories WHERE name = $1', [category]);
        let categoryId;
        if (selectedCategory.rowCount === 0) {
            const insertResult = await query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [category]);
            categoryId = insertResult.rows[0].id;
        } else {
            categoryId = selectedCategory.rows[0].id;
        }

        const result = await query(
            'INSERT INTO posts (title, subTitle, category_id, imageUrl, content, author) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, subTitle, categoryId, imageUrl, content, author]
        );
        const newPost: BlogPost = result.rows[0];
        res.status(201).json({ message: 'Gönderi başarıyla oluşturuldu', 'success': true, data: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// module.exports = { getPosts };