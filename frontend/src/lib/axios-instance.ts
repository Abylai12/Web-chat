import { apiURL } from "@/utils/api-url";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${apiURL}`,
  withCredentials: true,
});
