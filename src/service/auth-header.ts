import { AxiosRequestHeaders } from "axios";
import { AuthedUser } from "../interface/UserInterface";

export default async function authHeader(): Promise<AxiosRequestHeaders> {
  const authDataSerialized = localStorage.getItem("@user");

  if (authDataSerialized) {
    const _authedUser: AuthedUser = JSON.parse(authDataSerialized);

    return {
      Authorization: "Bearer " + _authedUser.access,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  } else {
    return {};
  }
}
