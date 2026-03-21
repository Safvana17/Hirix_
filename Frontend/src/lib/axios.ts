import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1` : 'http://localhost:4000/api/v1'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry: boolean
}

let logoutHandler: (() => void) | null = null
export const setLogoutHandler = (handler: () => void) => {
    logoutHandler = handler
}

const getCsrfToken = () => {
    return document.cookie
       .split("; ")
       .find((row) => row.startsWith("XSRF-TOKEN="))
       ?.split("=")[1]
}

const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
})

let isRefreshing = false

let failedQueue: {
   resolve: (value?: unknown) => void
   reject: (reason?: unknown) => void
}[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach((promise) =>{
        if(error){
            promise.reject(error)
        }else{
            promise.resolve(null)
        }
    })
    failedQueue = []
}

api.interceptors.request.use((config) => {
    const csrfToken = getCsrfToken()

    if(csrfToken){
        config.headers["x-csrf-token"] = csrfToken
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        console.log("Interceptor caught error:", error.response?.status)
        const originalRequest = error.config as CustomAxiosRequestConfig

        if(error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/refresh")){
            
            if(isRefreshing){
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject})
                }).then(() => api(originalRequest))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                await api.post('/auth/refresh')
                processQueue(null)
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError)
                if(logoutHandler){
                    logoutHandler()
                }
                return Promise.reject(refreshError)
            }finally{
                isRefreshing = false
            }
        }
        return Promise.reject(error)
    }
)

export default api