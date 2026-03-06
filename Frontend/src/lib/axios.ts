import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
// import { store } from "../redux/store";
// import { logoutUser } from "../redux/slices/authSlice";


interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry: boolean
}

let logoutHandler: (() => void) | null = null
export const setLogoutHandler = (handler: () => void) => {
    logoutHandler = handler
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
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

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        console.log("Interceptor caught error:", error.response?.status)
        const originalRequest = error.config as CustomAxiosRequestConfig
        // const role = store.getState().auth.role
        if(error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/refresh")){
            // if(!role){
            //     return Promise.reject(error)
            // }
            
            if(isRefreshing){
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject})
                }).then(() => api(originalRequest))
            }

            originalRequest._retry = true
            isRefreshing = true

            // let refreshUrl = ""
            // if(role === 'candidate') refreshUrl = '/candidate/refresh';
            // if(role === 'company') refreshUrl = '/company/refresh';
            // if(role === 'admin') refreshUrl = '/admin/refresh';

            try {
                await api.post('/auth/refresh')
                processQueue(null)
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError)
                // store.dispatch(logoutUser(role))
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