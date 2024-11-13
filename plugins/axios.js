import axios from 'axios'



export default defineNuxtPlugin(nuxtApp => {

  const config = useRuntimeConfig()

  const axiosInstance = axios.create({
    baseURL: config.public.prodBase,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const loginInstance = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Add the token to the headers if it's stored in cookies
  axiosInstance.interceptors.request.use(config => {
    const token = nuxtApp.$cookies.get('api_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })

  nuxtApp.provide('axios', axiosInstance)
  nuxtApp.provide('loginInstance', loginInstance)
})
