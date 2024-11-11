export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('api_token').value

    // If the token exists, redirect to the dashboard or home page
    if (token) {
        return navigateTo('/')
    }
})
