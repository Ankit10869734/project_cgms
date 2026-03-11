import axios from 'axios'

const api = axios.create({
  baseURL: 'https://cgms-hub.onrender.com',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) {
          localStorage.clear()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        const res = await axios.post(
          'https://cgms-hub.onrender.com/api/auth/token/refresh/',
          { refresh }
        )

        localStorage.setItem('access', res.data.access)

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`
        return api(originalRequest)

      } catch (refreshError) {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api