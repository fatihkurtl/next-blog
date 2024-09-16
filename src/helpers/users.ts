import { UserLogin, UserRegister } from "@/interfaces/user";
import { ApiService } from "../services/api";

export class UserServices {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async saveUser(userData: UserRegister): Promise<any> {
    return this.api.post("/users/register", userData, {
      "Content-Type": "multipart/form-data",
    });
  }

  async loginUser(userData: UserLogin): Promise<any> {
    return this.api.post("/users/login", userData, {
      "Content-Type": "multipart/form-data",
    });
  }

  async updateUser(id: number, userData: any): Promise<any> {
    return this.api.put(`/users/update/${id}`, userData, {
      "Content-Type": "multipart/form-data",
    });
  }

  async getUserById(id: number): Promise<any> {
    return this.api.get(`/users/${id}`, {
      "Content-Type": "multipart/form-data",
    });
  }

  async updateUserPassword(id: number, userData: any): Promise<any> {
    return this.api.put(`/users/update/password/${id}`, userData, {
      "Content-Type": "multipart/form-data",
    });
  }

  async getUserPosts(id: number): Promise<any> {
    return this.api.get(`/users/posts/${id}`, {
      "Content-Type": "multipart/form-data",
    });
  }

  async updatePost(id: number, postData: any): Promise<any> {
    return this.api.put(`/users/update/posts/${id}`, postData, {
      "Content-Type": "multipart/form-data",
    });
  }

  async deleteUserPost(id: number): Promise<any> {
    return this.api.delete(`/users/delete/posts/${id}`, {
      "Content-Type": "multipart/form-data",
    });
  }
}
