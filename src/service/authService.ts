import axios, { AxiosResponse } from "axios";
import { AuthedUser } from "../interface/UserInterface";
import { useDispatch } from "react-redux";

const login = async (email: string, password: string): Promise<AxiosResponse<any, any> | boolean> => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BASE_API_URL + "/api/auth/login/",
      { email, password }
    );
    return response
  } catch (error: any) {
    return false;
  }
};

const register = async (
  email: string,
  username: string,
  password: string
): Promise<AxiosResponse<any, any> | boolean> => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BASE_API_URL + "/api/auth/register/",
      { email, username, password }
    );
      console.log(response.data)
   return response
  } catch (error: any) {
    return false;
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
