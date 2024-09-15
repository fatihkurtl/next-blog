import { UserRegister } from "@/interfaces/user";
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
}
