"use client";
import { BlogPost } from "@/interfaces/posts";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { PostServices } from "@/helpers/posts";
import PostList from "@/components/blog/post-list";
import CategoriesSidebar from "@/components/blog/categories-sidebar";

const postServices = new PostServices(api);

// const categories = ["Web Geliştirme", "JavaScript", "CSS", "React", "Node.js"];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await postServices.getAllPosts();
        setPosts(fetchedPosts.data);
        setCategories([...fetchedPosts.data.map((post) => post.category)]);
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
          <CategoriesSidebar categories={categories} posts={posts} />
        </div>
      </div>
    </div>
  );
}
