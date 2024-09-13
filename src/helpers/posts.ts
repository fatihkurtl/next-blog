import { ApiService } from "../services/api";
import { BlogPost } from "../interfaces/posts";

export class PostServices{
    private api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getAllPosts(): Promise<BlogPost[]> {
        return this.api.get<BlogPost[]>("/posts");
    }
}

