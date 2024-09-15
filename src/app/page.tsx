"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import api from "@/services/api";
import { PostServices } from "@/helpers/posts";
import { BlogPost } from "@/interfaces/posts";
import PostList from "@/components/blog/post-list";
import CategoriesSidebar from "@/components/blog/categories-sidebar";

// interface BlogPost {
//   id: number;
//   title: string;
//   excerpt: string;
//   imageUrl: string;
// }

const postServices = new PostServices(api);

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await postServices.getAllPosts();
        setPosts(fetchedPosts.data.slice(0, 3));
        setAllPosts(fetchedPosts.data);
        setCategories([...fetchedPosts.data.map((post) => post.category)]);
        console.log(fetchedPosts.data);
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
        <h1 className="display-4">Hoş Geldiniz</h1>
        <p className="lead">Yazılım geliştirme, web teknolojileri ve daha fazlası hakkında blog yazıları.</p>
      </header>

      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">Son Yazılar</h2>
          <PostList posts={posts} />
        </div>
        <div className="col-md-4">
          <h2 className="mb-4">Kategoriler</h2>
          <CategoriesSidebar categories={categories} posts={allPosts} />
        </div>
      </div>
    </div>
  );
}