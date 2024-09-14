"use client";

import { BlogPost } from "@/interfaces/posts";

export default function CategoriesSidebar({
  categories,
  posts,
}: {
  categories: string[];
  posts: BlogPost[];
}) {
  return (
    <ul className="list-group">
      {categories.map((category, index) => (
        <li
          key={index}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {category}
          <span className="badge bg-primary rounded-pill">
            {posts.filter((post) => post.category === category).length}
          </span>
        </li>
      ))}
    </ul>
  );
}
