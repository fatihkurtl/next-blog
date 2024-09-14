export interface BlogPost {
    id: number;
    title: string;
    subTitle: string;
    category: string;
    imageUrl: string;
    content: string;
    date: string;
    author: string;
  }

  export interface BlogPostCreate {
    title: string;
    subTitle: string;
    category: string;
    imageUrl: File | null;
    content: string;
    author: string;
  }