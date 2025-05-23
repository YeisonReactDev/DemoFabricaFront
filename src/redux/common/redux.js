import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import clienteAxios from '../../config/clienteAxios'

const initialState = {
    loadingroles: false,
    errorroles: null,
    roles: [],

    loadingpermisos: false,
    errorpermisos: null,
    permisos: [],

    loadingpersonas: false,
    errorpersonas: null,
    personas: [],

    loadingusuarios: false,
    errorusuarios: null,
    usuarios: [],

    loadingopciones: false,
    erroropciones: null,
    opciones: [],

    loadingempresas: false,
    errorempresas: null,
    empresas: [],

    loadingsucursales: false,
    errorsucursales: null,
    sucursales: [],

    loadingciudades: false,
    errorciudades: null,
    ciudades: [],

    loadingbarrios: false,
    errorbarrios: null,
    barrios: [],

    loadingTiposImpuestos: false,
    dataTiposImpuestos: [],

    loadingEstados: false,
    dataEstados: [],

    loadingTiposDocumentos: false,
    dataTiposDocumentos: [],

    loadingTiposPersonas: false,
    dataTiposPersonas: [],

    errorGetPeopleCatalog: null,

    loadingparametros: false,
    parametros: {},
    errorparametros: null,

    loadingcarteras: false,
    carteras: [],
    errorcarteras: null,

    loadingfinanciacion: false,
    financiacion: [],
    errorfinanciacion: null,

    loadingperiodos: false,
    periodos: [],
    errorperiodos: null,

    loadingyears: false,
    years: [],
    erroryears: null,

    loadingmonths: false,
    months: [],
    errormonths: null,
}

export const searchCatalog = createAsyncThunk(
    "common/searchcatalog",
    async (endpoint, thunkApi) => {
        // const { selectEmpresa: { empresa } } = thunkApi.getState()
        const empresa = null;
        const asociado = null;
        const endpointText = typeof endpoint === "object" ? endpoint.endpoint : endpoint
        try {
            let resp = await clienteAxios.get(`${endpoint?.previousEndpoint ? `/${endpoint?.previousEndpoint}` : ""}/${endpointText}/${!endpoint?.end ? "getall" : ""}`, {
                params: {
                    ...(typeof endpoint === "object" ? {
                        ...endpoint.params,
                        ...((!!endpoint?.params && "IdEmpresa" in endpoint?.params && !endpoint?.params?.IdEmpresa) ? { IdEmpresa: empresa?.value } : {})
                    } : {})
                }
            })
            if (endpointText === "empresas" && endpoint?.params?.excludeCurrent) {
                // const { selectEmpresa: { empresa, asociado } } = thunkApi.getState()
                if (empresa) {
                    resp.data = resp.data.filter(v => v.IdEmpresa !== empresa?.value)
                    if (asociado)
                        resp.data = resp.data.filter(v => !v.Bodega)

                }
            }
            if (endpointText === "pedidos" && endpoint?.params?.onlyNotDespachados) {
                resp.data = resp.data.map(v => ({ ...v, type: 1, fecha: v.FechaPedidoFormat }))
            }
            if (endpointText === "pedidos" && endpoint?.params?.onlyForDespacho) {
                resp.data = resp.data.map(v => ({ ...v, type: 2, fecha: v.DetallePedidos[0]?.FechaInsercion }))
            }
            return { data: resp.data, endpoint: endpointText }
        } catch (error) {
            console.log("THUNK ERROR: ", error)
            return thunkApi.rejectWithValue({ msg: error.response.data.msg, data, endpoint: endpointText })
        }
    }
)

export const searchPeopleCatalog = createAsyncThunk(
    "common/searchPeopleCatalog",
    async (params, thunkApi) => {
        try {
            let paramsForEndpoint = {};
            if (params?.length) {
                params.forEach(param => {
                    paramsForEndpoint = {
                        ...paramsForEndpoint,
                        [param]: true
                    }
                });
            }
            const resp = await clienteAxios.get(`/personas/getcatalogs`, {
                params: paramsForEndpoint
            })
            if (resp?.data?.results) {
                return resp?.data?.results
            }
            return null
        } catch (error) {
            console.log("THUNK ERROR: ", error)
            return thunkApi.rejectWithValue({ msg: error.response.data.msg, params })
        }
    }
)

export const getParametrosByIdEmpresa = createAsyncThunk(
    "common/getParametrosByIdEmpresa",
    async (dataArgs, thunkApi) => {
        try {
            const id = dataArgs?.id ?? dataArgs
            const resp = await clienteAxios.get(`/parametros/empresa/${id}`, {
                ...(dataArgs?.getRaw ? {
                    headers: {
                        ["x-get-raw"]: 1
                    }
                } : {})
            })
            return { result: { ...resp.data.result, ...(resp.data.result?.Empresa?.Iva ? { Iva: resp.data.result?.Empresa?.Iva } : {}) } }
        } catch (error) {
            console.log("THUNK ERROR: ", error)
            return thunkApi.rejectWithValue({ msg: error.response.data.msg, data })
        }
    }
)

export const getFacturacionResources = createAsyncThunk(
    "common/getFacturacionResources",
    async (resourceType, thunkApi) => {
        try {
            const {
                selectEmpresa: {
                    empresa: { value: IdEmpresa },
                },
            } = thunkApi.getState();
            const resp = await clienteAxios.get(`/facturacion/${resourceType}/getall`, {
                params: {
                    IdEmpresa
                }
            })
            return { data: resp.data, resourceType }
        } catch (error) {
            console.log("THUNK ERROR: ", error)
            return thunkApi.rejectWithValue({ msg: error.response.data.msg, data })
        }
    }
)

const slice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        clearCatalog: (state, action) => {
            state[action?.payload?.param] = action?.payload?.value || []
            state[`loading${action?.payload?.param}`] = false
        }
    },
    extraReducers: (builder) => {
        //search states
        builder.addCase(searchCatalog.pending, (state, action) => {
            const endpoint = action.meta.arg?.endpoint || action.meta.arg
            state[`loading${endpoint}`] = true;
            state[`error${endpoint}`] = null;
            state[endpoint] = [];
        })
        builder.addCase(searchCatalog.fulfilled, (state, action) => {
            state[`loading${action.payload?.endpoint}`] = false;
            state[`error${action.payload?.endpoint}`] = null;
            state[action.payload?.endpoint] = action.payload?.data;
        })

        builder.addCase(searchCatalog.rejected, (state, action) => {
            state[`loading${action.payload?.endpoint}`] = false;
            state[`error${action.payload?.endpoint}`] = action.payload?.msg;
        })

        //search person 
        builder.addCase(searchPeopleCatalog.pending, (state, action) => {
            const params = action.meta.arg;
            if (params?.length) {
                params.forEach(param => {
                    state[`loading${param}`] = true;
                    state[`data${param}`] = [];
                })
            }
            state.errorGetPeopleCatalog = null;
        })
        builder.addCase(searchPeopleCatalog.fulfilled, (state, action) => {
            const result = action.payload;
            for (const key in result) {
                state[`loading${key}`] = false;
                state[`data${key}`] = result[key];
            }
            state.errorGetPeopleCatalog = null;
        })
        builder.addCase(searchPeopleCatalog.rejected, (state, action) => {
            const params = action.payload;
            if (params?.length) {
                params.forEach(param => {
                    state[`loading${param}`] = false;
                })
            }
            state.errorGetPeopleCatalog = action.payload?.msg;
        })

        builder.addCase(getParametrosByIdEmpresa.pending, (state, action) => {
            state.loadingparametros = true;
            state.errorparametros = null;
        })
        builder.addCase(getParametrosByIdEmpresa.fulfilled, (state, action) => {
            state.loadingparametros = false;
            state.parametros = action.payload;
        })
        builder.addCase(getParametrosByIdEmpresa.rejected, (state, action) => {
            state.loadingparametros = false;
            state.errorparametros = action.payload;
        })


        //getFacturacionResources
        builder.addCase(getFacturacionResources.pending, (state, action) => {
            const param = action.meta.arg;
            state[`loading${param}`] = true;
            state[`error${param}`] = null;
            state[param] = [];
        })
        builder.addCase(getFacturacionResources.fulfilled, (state, action) => {
            state[`loading${action.payload?.endpoint}`] = false;
            state[`error${action.payload?.endpoint}`] = null;
            state[action.payload?.resourceType] = action.payload?.data;
        })
        builder.addCase(getFacturacionResources.rejected, (state, action) => {
            const param = action.meta?.arg
            state[`loading${param}`] = false;
            state[`error${param}`] = action.payload?.msg;
        })

    }
})

export const commonSlice = slice.reducer

export const { clearCatalog } = slice.actions

