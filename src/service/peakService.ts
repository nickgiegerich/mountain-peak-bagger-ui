import axios from "axios";
import { useAuth } from "../context/Auth";
import { PeakInterface } from "../interface/PeakInterface";
import { AuthedUser } from "../interface/UserInterface";
import authHeader from "./auth-header";

const user: AuthedUser | string | null = localStorage.getItem("@user");

/**
 * Fields for peak creation
 *
 * peak_name - string *required
 * peak_description - string
 * longitude - number
 * latitude - number
 * summitted - boolean
 * attempt_date - date ('YYYY-MM-DD')
 * summit_date - date ('YYYY-MM-DD')
 *
 */

const testPeakPost = {
  peak_name: "test peak name",
  peak_description: "test peak description",
  longitude: 100,
  latitude: 200.0,
  summitted: "True",
  attempt_date: "2021-12-13",
  summit_date: "2021-12-13",
  user: 1,
};

const getAllPeaks = async (): Promise<PeakInterface[] | undefined> => {
  try {
    const response = await axios.get(
      process.env.REACT_APP_BASE_API_URL + "/api/peaks/",
      { headers: await authHeader() }
    );

    if (response.data) {
      return response.data;
    } else {
      return undefined;
    }
  } catch (e) {}
};

const postPeak = async (
  peak: PeakInterface,
  userId: number
): Promise<PeakInterface | undefined> => {
  try {
    
    const response = await axios.post(
      process.env.REACT_APP_BASE_API_URL + "/api/peaks/",
      { ...peak, user: userId },
      { headers: await authHeader() }
    );

    if (response.status === 201) {
      return response.data;
    } else {
      return undefined;
    }
    
  } catch (e) {
    console.log(e);
  }
};

export const peakService = {
  getAllPeaks,
  postPeak,
};
