import { API_URL } from "@config/clienteAxios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DEFAULT_TTLS_CACHE = 120

const ENDPOINTS = {
  create: "/clientes/",
  getById: "/clientes/getbyid",

  // GETTERS -- RUAF
  getRUAFBasic: "/clientes/ruaf/basic",
  getRUAFHealth: "/clientes/ruaf/health",
  getRUAFPensions: "/clientes/ruaf/pensions",
  getRUAFLaboralRisks: "/clientes/ruaf/laboralrisks",
  getRUAFLayoffs: "/clientes/ruaf/layoffs",
  getRUAFPensioners: "/clientes/ruaf/pensioners",
  getRUAFFamilyCompensation: "/clientes/ruaf/familycompensation",

  // GETTERS -- ADRES
  getADRESBasic: "/clientes/adres/basic",
  getADRESAfiliations: "/clientes/adres/afiliations",
  getADRESPeriods: "/clientes/adres/periods",
};

export const clientesApi = createApi({
  reducerPath: "clientesApi",
  tagTypes: [
    "GetByIdCliente",
    "CreateCliente",

    "GetRUAFBasic",
    "GetRUAFHealth",
    "GetRUAFPensions",
    "GetRUAFLaboralRisks",
    "GetRUAFLayoffs",
    "GetRUAFPensioners",
    "GetRUAFFamilyCompensation",

    "GetADRESBasic",
    "GetADRESAfiliations",
    "GetADRESPeriods",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  endpoints: (builder) => ({

    //getter by id
    GetByIdCliente: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getById}`,
          params: {
            IdEmpresa: params?.IdEmpresa,
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetByIdCliente", id: arg?.NumeroDocumento }] : ["GetByIdCliente"],
    }),

    // QUERYS --- RUAF
    GetRUAFBasic: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getRUAFBasic}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetRUAFBasic", id: arg?.NumeroDocumento }] : ["GetRUAFBasic"],
    }),

    GetRUAFHealth: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getRUAFHealth}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetRUAFHealth", id: arg?.NumeroDocumento }] : ["GetRUAFHealth"],
    }),

    GetRUAFPensions: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getRUAFPensions}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetRUAFPensions", id: arg?.NumeroDocumento }] : ["GetRUAFPensions"],
    }),

    GetRUAFLaboralRisks: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getRUAFLaboralRisks}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetRUAFLaboralRisks", id: arg?.NumeroDocumento }] : ["GetRUAFLaboralRisks"],
    }),

    GetRUAFLayoffs: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getRUAFLayoffs}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetRUAFLayoffs", id: arg?.NumeroDocumento }] : ["GetRUAFLayoffs"],
    }),

    GetRUAFPensioners: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getRUAFPensioners}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetRUAFPensioners", id: arg?.NumeroDocumento }] : ["GetRUAFPensioners"],
    }),

    GetRUAFFamilyCompensation: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getRUAFFamilyCompensation}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetRUAFFamilyCompensation", id: arg?.NumeroDocumento }] : ["GetRUAFFamilyCompensation"],
    }),

    // QUERYS --- ADRES
    GetADRESBasic: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getADRESBasic}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetADRESBasic", id: arg?.NumeroDocumento }] : ["GetADRESBasic"],
    }),

    GetADRESAfiliations: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getADRESAfiliations}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetADRESAfiliations", id: arg?.NumeroDocumento }] : ["GetADRESAfiliations"],
    }),

    GetADRESPeriods: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getADRESPeriods}`,
          params: {
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      keepUnusedDataFor: DEFAULT_TTLS_CACHE,
      providesTags: (result, __, arg) => result ? [{ type: "GetADRESPeriods", id: arg?.NumeroDocumento }] : ["GetADRESPeriods"],
    }),


    //MUTATIONS
    //creation, send tag by level
    createCliente: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `${ENDPOINTS.create}`,
          body: body,
        };
      },
      invalidatesTags: (res, err, body) => {
        return [
          `GetByIdCliente`,
        ]
      },
    }),

  }),
});

//HOOKS
export const {
  //querys
  useGetByIdClienteQuery,
  // -----RUAF
  useGetRUAFBasicQuery,
  useGetRUAFHealthQuery,
  useGetRUAFLaboralRisksQuery,
  useGetRUAFLayoffsQuery,
  useGetRUAFPensionsQuery,
  useGetRUAFPensionersQuery,
  useGetRUAFFamilyCompensationQuery,
  // -----ADRES
  useGetADRESBasicQuery,
  useGetADRESAfiliationsQuery,
  useGetADRESPeriodsQuery,

  //mutations
  useCreateClienteMutation,

  util,
} = clientesApi;
