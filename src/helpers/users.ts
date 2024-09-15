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
}
