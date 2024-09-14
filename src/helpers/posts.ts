import { ApiService } from "../services/api";
import { BlogPost, BlogPostCreate } from "../interfaces/posts";

export class PostServices {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async getAllPosts(): Promise<BlogPost[]> {
    return this.api.get<BlogPost[]>("/posts");
  }

  async createPost(post: BlogPostCreate): Promise<any> {
    return this.api.post<BlogPost>("/posts/create", post, {
        'Content-Type': 'multipart/form-data'
      });
  }
}
