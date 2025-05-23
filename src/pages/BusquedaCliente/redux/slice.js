import { createSlice } from "@reduxjs/toolkit";
import { clientesApi } from "./api";

export const ID_NAME = "IdCuenta"

const initialState = {
  IdDocumento: null,

  loadingById: false,
  resultCreate: null,
  errorCreate: null,
};
export const clientesSlice = createSlice({
  name: "clientes",
  initialState,
  reducers: {
    setIdDocumento: (state, action) => {
      state.IdDocumento = action.payload;
    },
    clearResults: (state, action) => {
      state.resultCreate = null;
      state.errorCreate = null;
    },
    clearData: (state) => {
      for (const key in initialState) {
        state[key] = initialState[key];
      }
    },
    clearSearchParams: (state, action) => {
      state.IdDocumento = null;
    },
    clearIdDocumento: (state, action) => {
      state.IdDocumento = null
    },

  },
  extraReducers: (builder) => {
    //builder.addMatcher(
    //   clientesApi.endpoints.getCompanies.matchFulfilled,
    // (state, {payload}) => {
    //   state.companies = payload.result
    // },
    //;

    //MATCHERS FOR GET BY ID
    builder.addMatcher(
      clientesApi.endpoints.GetByIdCliente.matchPending,
      (state) => {
        state.loadingById = true;
        state.errorId = null;
        state.dataId = null;
      }
    );
    builder.addMatcher(
      clientesApi.endpoints.GetByIdCliente.matchFulfilled,
      (state, { payload }) => {
        state.loadingById = false;
        state.IdDocumento = payload?.IdDocumento;
      }
    );
    builder.addMatcher(
      clientesApi.endpoints.GetByIdCliente.matchRejected,
      (state, { payload }) => {
        state.loadingById = false;
      }
    );

    //MATCHERS FOR Deactivate BY ID
    builder.addMatcher(
      clientesApi.endpoints.createCliente.matchPending,
      (state) => {
        state.loadingById = true;
        state.errorCreate = null;
        state.resultCreate = null;
      }
    );
    builder.addMatcher(
      clientesApi.endpoints.createCliente.matchFulfilled,
      (state, { payload }) => {
        state.loadingById = false;
        state.errorCreate = null;
        state.resultCreate = payload?.msg;
      }
    );
    builder.addMatcher(
      clientesApi.endpoints.createCliente.matchRejected,
      (state, { payload }) => {
        state.loadingById = false;
        state.errorCreate = payload.data?.msg;
        state.resultCreate = null;
      }
    );

  },
});

export const {
    clearData,
    clearIdDocumento,
    clearResults,
    clearSearchParams,
    setIdDocumento
} = clientesSlice.actions;

export default clientesSlice.reducer;