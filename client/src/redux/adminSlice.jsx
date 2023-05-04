import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { authFetch, unauthorizedResponse } from "../utils/auth";

const initialState = {
  adminLoading: false,
  shipToName: "",
  shipToAddress: "",
  shipToEmail: "",
  shipToNumber: "",
  floor: "",
  location: "",
  allClients: [],
  singleClientDetails: {},
  singleClientLocations: [],
  singleLocation: {},
  companyServices: [],
  companyProducts: [],
  isEditing: false,
  clientId: "",
  locationId: "",
  page: 1,
};

export const clientRegister = createAsyncThunk(
  "admin/clientRegister",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post("/shipTo/client", form);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const updateClient = createAsyncThunk(
  "admin/updateClient",
  async ({ id, form }, thunkAPI) => {
    try {
      const res = await authFetch.patch(`/shipTo/client/${id}`, form);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const singleClient = createAsyncThunk(
  "admin/singleClient",
  async ({ id, search, page }, thunkAPI) => {
    try {
      let url = `/location/singleShipTo/${id}?page=${page}`;
      if (search) url += `&search=${search}`;
      const res = await authFetch.get(url);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const deleteClient = createAsyncThunk(
  "admin/deleteClient",
  async (id, thunkAPI) => {
    try {
      const res = await authFetch.delete(`/shipTo/client/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const addService = createAsyncThunk(
  "admin/addService",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post("/admin/service", form);
      thunkAPI.dispatch(getCompanyServices());
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const getCompanyServices = createAsyncThunk(
  "admin/companyServices",
  async (_, thunkAPI) => {
    try {
      const res = await authFetch.get("/admin/service");
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const editService = createAsyncThunk(
  "admin/editService",
  async ({ serviceId, service }, thunkAPI) => {
    try {
      const res = await authFetch.patch(`/admin/service/${serviceId}`, service);
      thunkAPI.dispatch(getCompanyServices());
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const deleteService = createAsyncThunk(
  "admin/deleteService",
  async (serviceId, thunkAPI) => {
    try {
      const res = await authFetch.delete(`/admin/service/${serviceId}`);
      thunkAPI.dispatch(getCompanyServices());
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const addLocation = createAsyncThunk(
  "admin/addLocation",
  async ({ clientId, location, page }, thunkAPI) => {
    try {
      const res = await authFetch.post(
        `/location/addLocation/${clientId}`,
        location
      );
      thunkAPI.dispatch(singleClient({ id: clientId, search: "", page: 1 }));
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const getLocation = createAsyncThunk(
  "admin/getLocation",
  async (locationId, thunkAPI) => {
    try {
      const res = await authFetch.get(`/report/locationServices/${locationId}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const editLocation = createAsyncThunk(
  "admin/editLocation",
  async ({ clientId, locationId, location }, thunkAPI) => {
    try {
      const res = await authFetch.patch(
        `/location/locationServices/${locationId}`,
        location
      );
      thunkAPI.dispatch(singleClient(clientId));
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const deleteLocation = createAsyncThunk(
  "admin/deleteLocation",
  async ({ clientId, locationId }, thunkAPI) => {
    try {
      const res = await authFetch.delete(
        `/location/locationServices/${locationId}`
      );

      thunkAPI.dispatch(singleClient({ id: clientId, search: "", page: 1 }));
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    handleAdmin: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearAdminValues: (state) => initialState,
    setEdit: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clientRegister.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(clientRegister.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.clientId = payload.id;
        state.shipToName = "";
        state.shipToAddress = "";
        state.shipToEmail = "";
        state.shipToNumber = "";
        toast.success(payload.msg);
      })
      .addCase(clientRegister.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(updateClient.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(updateClient.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.isEditing = false;
        state.locationId = "";
        state.shipToName = "";
        state.shipToAddress = "";
        state.shipToEmail = "";
        state.shipToNumber = "";
        toast.success(payload.msg);
      })
      .addCase(updateClient.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(singleClient.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(singleClient.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.singleClientDetails = payload.clientDetails;
        state.singleClientLocations = payload.clientLocations;
        state.totalPages = payload.pages;
      })
      .addCase(singleClient.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(deleteClient.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.isEditing = false;
        state.locationId = "";
        state.shipToName = "";
        state.shipToAddress = "";
        state.shipToEmail = "";
        state.shipToNumber = "";
        toast.success(payload.msg);
      })
      .addCase(deleteClient.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(addService.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(addService.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        toast.success(payload.msg);
      })
      .addCase(addService.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(getCompanyServices.pending, (state, { payload }) => {
        state.adminLoading = true;
      })
      .addCase(getCompanyServices.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.allClients = payload.allShipTo;
        state.companyServices = payload.allServices;
        state.companyProducts = payload.allProducts;
      })
      .addCase(editService.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(editService.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.isEditing = false;
        toast.success(payload.msg);
      })
      .addCase(editService.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(deleteService.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(deleteService.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        toast.success(payload.msg);
      })
      .addCase(deleteService.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(addLocation.pending, (state) => {
        state.adminLoading = true;
      })

      .addCase(addLocation.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.floor = "";
        state.location = "";
        toast.success(payload.msg);
      })
      .addCase(addLocation.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(editLocation.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(editLocation.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.isEditing = false;
        state.floor = "";
        state.location = "";
        toast.success(payload.msg);
      })
      .addCase(editLocation.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(getLocation.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(getLocation.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.singleLocation = payload.location;
        toast.success(payload.msg);
      })
      .addCase(getLocation.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(deleteLocation.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(deleteLocation.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        toast.success(payload.msg);
      })
      .addCase(deleteLocation.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      });
  },
});

export const { handleAdmin, clearAdminValues, setEdit } = adminSlice.actions;

export default adminSlice.reducer;
