import axios from "axios";
import { clearStore } from "../redux/userSlice";

export const authFetch = axios.create({ baseURL: "/api" });

authFetch.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    config.headers["Authorization"] = `Bearer ${user.token}`;
  }
  return config;
});

export const unauthorizedResponse = (error, thunkAPI) => {
  if (error.response.status === 401) {
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue("Unauthorized! Logging Out...");
  }
  return thunkAPI.rejectWithValue(error.response.data.msg);
};
