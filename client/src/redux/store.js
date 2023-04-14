import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./adminSlice";
import reportSlice from "./reportSlice";
import userSlice from "./userSlice";
import superAdminSlice from "./superAdminSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
    report: reportSlice,
    superAdmin: superAdminSlice,
  },
});
