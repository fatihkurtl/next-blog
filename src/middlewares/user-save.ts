import { UserServices } from "@/helpers/users";
import api from "@/services/api";

export const getUserData = async (userId: number, saveUser: (user: any) => void) => {
  const userServices = new UserServices(api);
  try {
    const response = await userServices.getUserById(userId);
    if (response.success === true) {
      console.log("response user:", response);
      saveUser(response.user);
    }
  } catch (error) {
    console.log(error);
  }
};