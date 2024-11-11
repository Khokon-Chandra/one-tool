<script setup>
const { $cookies, $axios } = useNuxtApp();
definePageMeta({
    middleware: 'auth',
    layout: 'auth'
})

const logout = () => {
    $cookies.remove('api_token');
    navigateTo('/login')
}
</script>

<template>
    <div>
        <h1>Hello world</h1>


        <button @click="logout">logout</button>

    </div>
</template>