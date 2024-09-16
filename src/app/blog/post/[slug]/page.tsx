"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { PostServices } from "@/helpers/posts";
import api from "@/services/api";
import { BlogPost } from "@/interfaces/posts";

const postServices = new PostServices(api);

export default function PostDetail() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      setLoading(true);
      postServices
        .getPostById(id)
        .then((response) => {
          setPost(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
          setError("Post yüklenirken bir hata oluştu.");
          setLoading(false);
        });
    } else {
      setError("Geçerli bir post ID'si bulunamadı.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="container mt-5">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  if (!post) {
    return <div className="container mt-5">Post bulunamadı.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <article>
            <header className="mb-4">
              <h1 className="fw-bolder mb-1">{post.title}</h1>
              <div className="text-muted fst-italic mb-2">
                {post.date && new Date(post.date).toLocaleDateString("tr-TR")}{" "}
                tarihinde {post.author} tarafından paylaşıldı
              </div>
              {post.category && (
                <span className="badge bg-secondary text-decoration-none link-light">
                  {post.category}
                </span>
              )}
            </header>

            {post.imageUrl && (
              <figure className="mb-4">
                <Image
                  className="img-fluid rounded"
                  src={post.imageUrl}
                  alt={post.title}
                  width={800}
                  height={400}
                  layout="responsive"
                />
              </figure>
            )}

            <section className="mb-5">
              {post.subtitle && (
                <h2 className="fw-bolder mb-4 mt-5">{post.subtitle}</h2>
              )}
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p>İçerik bulunamadı.</p>
              )}
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}
