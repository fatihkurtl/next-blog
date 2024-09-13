"use client";
import { BlogPost } from "@/interfaces/posts";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { PostServices } from "@/helpers/posts";
import PostList from "@/components/blog/post-list";

const postServices = new PostServices(api);

const categories = ["Web Geliştirme", "JavaScript", "CSS", "React", "Node.js"];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await postServices.getAllPosts();
        setPosts(fetchedPosts.data);
        console.log(fetchedPosts);
      } catch (error) {
        console.error(error);
        setError(
          "Gönderiler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-4">Blog</h1>
        <p className="lead">
          Yazılım geliştirme, web teknolojileri ve daha fazlası hakkında blog
          yazıları.
        </p>
      </header>

      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">Tüm Yazılar</h2>
          <PostList posts={posts} />
        </div>
        <div className="col-md-4">
          <h2 className="mb-4">Kategoriler</h2>
          <ul className="list-group">
            {categories.map((category, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
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
