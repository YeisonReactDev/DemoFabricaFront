import { API_URL } from "@config/clienteAxios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ENDPOINTS = {
  create: "/clientes/",
  getById: "/clientes/getbyid",

};

export const clientesApi = createApi({
  reducerPath: "clientesApi",
  tagTypes: [
    "GetByIdCliente",
    "CreateCliente",
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
    getByIdCliente: builder.query({
      query: (params) => {
        return {
          url: `${ENDPOINTS.getById}`,
          params: {
            IdEmpresa: params?.IdEmpresa,
            NumeroDocumento: params?.NumeroDocumento,
          },
        };
      },
      providesTags: (result) => result ? [{type: "GetByIdCliente", id: result?.result?.IdTransaccion}] : ["GetByIdCliente"],
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
          `SearchClientees`,
        ]
      },
    }),

  }),
});

//HOOKS
export const {
    useCreateClienteMutation,
    useGetByIdClienteQuery,

  util,
} = clientesApi;
