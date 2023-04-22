import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authFetch, unauthorizedResponse } from "../utils/auth";
import { toast } from "react-toastify";

const initialState = {
  superAdminLoading: false,
  companyName: "",
  companyAddress: "",
  companyEmail: "",
  companyContact: "",
  allCompanies: [],
};

export const registerCompany = createAsyncThunk(
  "superAdmin/registerCompany",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post("/company/registerCompany", form);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const getAllCompanies = createAsyncThunk(
  "superAdmin/allCompanies",
  async (_, thunkAPI) => {
    try {
      const res = await authFetch.get("/company/registerCompany");
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "superAdmin/deleteCompany",
  async (id, thunkAPI) => {
    try {
      const res = await authFetch.delete(`/company/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    handleSuperAdmin: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearSuperAdmin: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(registerCompany.pending, (state) => {
      state.superAdminLoading = true;
    });
    builder.addCase(registerCompany.fulfilled, (state, { payload }) => {
      state.superAdminLoading = false;
      state.companyName = "";
      state.companyAddress = "";
      state.companyEmail = "";
      state.companyContact = "";
      state.allCompanies = payload.companies;
      toast.success(payload.msg);
    });
    builder.addCase(registerCompany.rejected, (state, { payload }) => {
      state.superAdminLoading = false;
      toast.error(payload);
    });
    builder.addCase(getAllCompanies.pending, (state) => {
      state.superAdminLoading = true;
    });
    builder.addCase(getAllCompanies.fulfilled, (state, { payload }) => {
      state.superAdminLoading = false;
      state.allCompanies = payload.companies;
    });
    builder.addCase(getAllCompanies.rejected, (state, { payload }) => {
      state.superAdminLoading = false;
      toast.error(payload);
    });
    builder.addCase(deleteCompany.pending, (state) => {
      state.superAdminLoading = true;
    });
    builder.addCase(deleteCompany.fulfilled, (state, { payload }) => {
      state.superAdminLoading = false;
      state.allCompanies = payload.companies;
      toast.success(payload.msg);
    });
    builder.addCase(deleteCompany.rejected, (state, { payload }) => {
      state.superAdminLoading = false;
      toast.error(payload);
    });
  },
});

export const { handleSuperAdmin, clearSuperAdmin } = superAdminSlice.actions;

export default superAdminSlice.reducer;
