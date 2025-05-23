import axios from 'axios'

const debug = localStorage.getItem('debug') === 'true';
export const API_URL = debug? 'http://localhost:4024/api' : `${import.meta.env.VITE_BACKEND_URL}/api`

const clienteAxios = axios.create({
    baseURL: API_URL
})

/* clienteAxios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
}); */

let requestCaching = {}
clienteAxios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyId");

    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }

    if (companyId) {
        config.headers["X-COMPANY-ID"] = companyId;
    }

    if(config.method !== "get"){
    
        const abortController = new AbortController();
        const currentTime = new Date().getTime();
        const stringParams = JSON.stringify(config.params)
        config.signal = abortController.signal;
    
    
        if (
            !config.url.includes("files") &
            requestCaching[config.url] &&
            requestCaching[config.url]?.params == stringParams &&
            (currentTime - requestCaching[config.url]?.time <= 5000)
        ) {
            abortController.abort({ msg: "api call duplicated" });
            return config;
        } else {
            requestCaching[config.url] = { params: stringParams, time: currentTime }
        }
    
    }

    return config;
});

export default clienteAxios;