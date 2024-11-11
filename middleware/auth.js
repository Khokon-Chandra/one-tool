export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('api_token').value
  
    // If the token does not exist, redirect to login
    if (!token) {
      return navigateTo('/login')
    }
  })
  