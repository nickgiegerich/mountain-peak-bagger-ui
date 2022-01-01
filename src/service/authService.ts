import axios from "axios";
import { AuthedUser } from "../interface/UserInterface";

const login = async (
  email: string,
  password: string
): Promise<AuthedUser | undefined> => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BASE_API_URL + "/api/auth/login/",
      { email, password }
    );

    console.log(response.data);

    if (response.data.access) {
      localStorage.setItem("@user", JSON.stringify(response.data));
    }
    return response.data.user as AuthedUser;
  } catch (error: any) {
    return undefined;
  }
};

const register = async (
  email: string,
  username: string,
  password: string
): Promise<AuthedUser | string> => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BASE_API_URL + "/api/auth/register/",
      { email, username, password }
    );

    if (response.data.access) {
      localStorage.setItem("@user", JSON.stringify(response.data));
    }
    return response.data.user as AuthedUser;
  } catch (error: any) {
    return error;
  }
};

const logout = async () => {
  try {
    localStorage.removeItem("@user");
  } catch (error) {
    console.warn(error);
  }
};

export const authService = {
  login,
  logout,
  register,
};
