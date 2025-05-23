//SLICE
import clientesSlice from "../BusquedaCliente/redux/slice";
//API
import { clientesApi } from "../BusquedaCliente/redux/api";

const api = {
  [clientesApi.reducerPath]: clientesApi.reducer,
};

const middlewares = [
  clientesApi.middleware,
];

const slice = {
  clientes: clientesSlice,
};

export default {
  api,
  middlewares,
  slice,
};
