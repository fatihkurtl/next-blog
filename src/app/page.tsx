import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  { id: 1, title: "Next.js'e Giriş", excerpt: "Next.js'in temel özelliklerini ve avantajlarını keşfedin.", imageUrl: "https://picsum.photos/seed/nextjs/400/300" },
  { id: 2, title: "Bootstrap ile Responsive Tasarım", excerpt: "Bootstrap grid sistemini kullanarak mobil uyumlu web siteleri oluşturun.", imageUrl: "https://picsum.photos/seed/bootstrap/400/300" },
  { id: 3, title: "TypeScript ve React", excerpt: "React projelerinizde TypeScript kullanmanın faydalarını öğrenin.", imageUrl: "https://picsum.photos/seed/typescript/400/300" },
];

const categories = ["Web Geliştirme", "JavaScript", "CSS", "React", "Node.js"];

export default function Home() {
  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-4">Hoş Geldiniz</h1>
        <p className="lead">Yazılım geliştirme, web teknolojileri ve daha fazlası hakkında blog yazıları.</p>
      </header>

      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">Son Yazılar</h2>
          {blogPosts.map((post) => (
            <div key={post.id} className="card mb-4">
              <div className="row g-0">
                <div className="col-md-4">
                  <Image src={post.imageUrl} alt={post.title} width={400} height={300} className="img-fluid rounded-start" />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.excerpt}</p>
                    <Link href={`/blog/${post.id}`} className="btn btn-primary">Devamını Oku</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <h2 className="mb-4">Kategoriler</h2>
          <ul className="list-group">
            {categories.map((category, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {category}
                <span className="badge bg-primary rounded-pill">14</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}