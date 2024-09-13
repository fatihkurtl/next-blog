"use client";
import { BlogPost } from "@/interfaces/posts";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { PostServices } from "@/helpers/posts";

const postServices = new PostServices(api);
export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postServices.getAllPosts();
        setPosts(fetchedPosts);
        console.log(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Blog</h1>
    </div>
  );
}
