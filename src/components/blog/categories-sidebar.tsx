"use client";

import { BlogPost } from "@/interfaces/posts";

export default function CategoriesSidebar({
  categories,
  posts,
}: {
  categories: string[];
  posts: BlogPost[];
}) {

  const uniqueCategories = Array.from(new Set(categories));

  return (
    <ul className="list-group">
      {uniqueCategories.map((category, index) => (
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
