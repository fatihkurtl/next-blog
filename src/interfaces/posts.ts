export interface BlogPost {
    id: number;
    title: string;
    subtitle: string;
    category_id: number;
    category: string;
    imageUrl: string;
    content: string;
    date: string;
    author: string;
  }

  export interface BlogPostCreate {
    title: string;
    subtitle: string;
    category: string;
    imageUrl: File | null;
    content: string;
    author: string;
  }