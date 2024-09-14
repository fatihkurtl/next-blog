"use client";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/interfaces/posts";
import { slugify } from "@/utils/slugify";

interface PostListProps {
  posts: BlogPost[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="card mb-4">
            <div className="row g-0">
              <div className="col-md-4 d-flex align-items-center justify-content-center bg-light">
                {post.imageUrl ? (
                  <div className="w-100 h-100 p-2">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      layout="responsive"
                      width={300}
                      height={200}
                      objectFit="contain"
                      className="img-fluid rounded"
                    />
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <span className="text-muted">Resim yok</span>
                  </div>
                )}
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  {/* <p className="card-text">{post.subtitle}</p> */}
                  <p className="card-text">
                    <small>Kategori: {post.category}</small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Yazar: {post.author}</small>
                    <br />
                    <small className="text-muted">
                      Tarih: {new Date(post.date).toLocaleDateString("tr-TR")}
                    </small>
                  </p>
                  <Link
                    href={{
                      pathname: `/blog/post/${slugify(post.title)}`,
                      query: { id: post.id },
                    }}
                    className="btn btn-primary"
                  >
                    Devamını Oku
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-info" role="alert">
          Hiç blog yazısı bulunamadı.
        </div>
      )}
    </>
  );
}