import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
  const axiosInstance = axios.create({
    baseURL: 'https://my.1tool.com/suite/api',
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
})
