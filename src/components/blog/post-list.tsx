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
        {posts.map((post) => (
            <div key={post.id} className="card mb-4">
              <div className="row g-0">
                <div className="col-md-4">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="img-fluid rounded-start"
                    style={{ objectFit: "cover", height: "100%" }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.excerpt}</p>
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
          ))}
        </>
    )
}