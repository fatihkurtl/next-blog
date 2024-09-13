import { Request, Response } from 'express';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    imageUrl: string;
    date: string;
    author: string;
  }
  
  const blogPosts: BlogPost[] = [
    { id: 1, title: "Next.js'e Giriş", excerpt: "Next.js'in temel özelliklerini ve avantajlarını keşfedin.", imageUrl: "https://picsum.photos/seed/nextjs/400/300", date: "2024-03-01", author: "Ali Yılmaz" },
    { id: 2, title: "Bootstrap ile Responsive Tasarım", excerpt: "Bootstrap grid sistemini kullanarak mobil uyumlu web siteleri oluşturun.", imageUrl: "https://picsum.photos/seed/bootstrap/400/300", date: "2024-03-05", author: "Ayşe Demir" },
    { id: 3, title: "TypeScript ve React", excerpt: "React projelerinizde TypeScript kullanmanın faydalarını öğrenin.", imageUrl: "https://picsum.photos/seed/typescript/400/300", date: "2024-03-10", author: "Mehmet Kaya" },
    { id: 4, title: "CSS Grid Layout", excerpt: "Modern web tasarımında CSS Grid Layout kullanımı.", imageUrl: "https://picsum.photos/seed/cssgrid/400/300", date: "2024-03-15", author: "Zeynep Şahin" },
    { id: 5, title: "JavaScript ES6+ Özellikleri", excerpt: "JavaScript'in modern özelliklerini keşfedin ve kodunuzu geliştirin.", imageUrl: "https://picsum.photos/seed/es6/400/300", date: "2024-03-20", author: "Emre Yıldız" },
    { id: 6, title: "React Hooks Derinlemesine", excerpt: "React Hooks ile fonksiyonel komponent geliştirme.", imageUrl: "https://picsum.photos/seed/reacthooks/400/300", date: "2024-03-25", author: "Selin Arslan" },
  ];


export const getPosts = (req: Request, res: Response) => {
    res.status(200).json({ data: blogPosts });
};

// module.exports = { getPosts };