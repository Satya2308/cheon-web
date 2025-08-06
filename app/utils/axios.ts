import axios from 'axios'

export const authApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export const apiWithToken = (accessToken: string) => {
  return axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
