import axios from "axios";
import { useAuth } from "../context/Auth";
import { PeakInterface } from "../interface/PeakInterface";
import { AuthedUser } from "../interface/UserInterface";
import { PeakObject } from "../utils/types/peakTypes";
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

/**
 *
 * @param peak
 * @param userId
 * @param token
 * @returns status - number of the status response (ex: 200, 201, 401)
 */
const postPeak = async (
  peak: PeakObject,
  userId: number,
  token: string
): Promise<number> => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BASE_API_URL + "/api/peaks/",
      { ...peak, user: userId },
      { headers: { Authorization: "Bearer " + token } }
    );

    return response.status;
  } catch (e) {
    console.log(e);
    return 404;
  }
};

const updatePeak = async (
  peak: PeakObject,
  userId: number,
  token: string
): Promise<number> => {
  try {
    const response = await axios.patch(
      process.env.REACT_APP_BASE_API_URL + `/api/peaks/${peak.id}/`,
      { ...peak, user: userId },
      { headers: { Authorization: "Bearer " + token } }
    );

    return response.status;
  } catch (e) {
    return 404;
  }
};

export const peakService = {
  getAllPeaks,
  postPeak,
  updatePeak,
};
