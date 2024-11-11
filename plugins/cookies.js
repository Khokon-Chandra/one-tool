import Cookie from 'cookie-universal'

export default defineNuxtPlugin(nuxtApp => {
    const cookies = Cookie()
    nuxtApp.provide('cookies', cookies)  // Provide cookies globally
})
