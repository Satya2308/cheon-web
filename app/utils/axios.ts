import axios from 'axios'

export const authApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

authApi.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    if (err.response?.status === 401 && !originalRequest._retry) {
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
