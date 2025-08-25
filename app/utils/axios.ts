import axios from 'axios'

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

authApi.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    // Skip interceptor for /auth/login
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true
      try {
        await refreshClient.post('/auth/refresh')
        return authApi(originalRequest)
      } catch (refreshErr) {
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(err)
  }
)
