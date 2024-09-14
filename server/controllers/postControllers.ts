import { Request, Response } from 'express';
import { query } from  '../utils/db';
import { createPostTable } from '../helpers/create-post-table';

interface BlogPost {
    id: number;
    title: string;
    subTitle: string;
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
    // res.status(200).json({ data: blogPosts });
    try {
        const result = await query('SELECT * FROM posts ORDER BY date DESC');
        const posts: BlogPost[] = result.rows;
        res.status(200).json({ data: posts });
    } catch (error) {
        console.error(error);
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
        console.log(req.files);
        let imageUrl = null;

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const file = req.files[0] as Express.Multer.File;
            console.log('Received file:', file.originalname, file.mimetype, file.size);
            // Burada dosyayı işleyebilir veya bir CDN'e yükleyebilirsiniz
            // Şimdilik sadece dosya adını kaydedelim
            imageUrl = file.originalname;
            console.log('Image URL:', imageUrl);
        }
        // const result = await query(
        //     'INSERT INTO posts (title, subTitle, category, imageUrl, content, author) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        //     [title, subTitle, category, imageUrl, content, author]
        // );
        // const newPost: BlogPost = result.rows[0];
        res.status(201).json({ message: 'Gönderi başarıyla oluşturuldu', 'success': true, data: "newPost" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// module.exports = { getPosts };