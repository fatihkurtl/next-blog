export interface BlogPost {
    id: number;
    title: string;
    subtitle: string;
    category_id: number;
    category: string;
    imageUrl: string;
    content: string;
    date: string;
    user_id: number;
    author: string;
  }

  export interface BlogPostCreate {
    title: string;
    subtitle: string;
    category: string;
    imageUrl: File | null;
    content: string;
    author: string;
    user_id: number;
  }

  export interface BlogPostEdit {
    id: number;
    title: string;
    subtitle: string;
    category: string;
    imageUrl: File | null;
    content: string;
    author: string;
    user_id: number;
  }