import { ApiService } from "../services/api";
import { BlogPost, BlogPostCreate } from "../interfaces/posts";

export class PostServices {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async getAllPosts(): Promise<BlogPost[]> {
    return this.api.get<BlogPost[]>("/posts", {
      next: {
        revalidate: 5,
      }
    });
  }

  async getPostById(id: string): Promise<BlogPost> {
    return this.api.get<BlogPost>(`/posts/${id}`);
  }

  async createPost(post: BlogPostCreate): Promise<any> {
    return this.api.post<BlogPost>("/posts/create", post, {
        'Content-Type': 'multipart/form-data'
      });
  }
}
