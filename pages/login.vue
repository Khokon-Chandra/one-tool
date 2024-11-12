<script setup>
import { ref } from 'vue'
import cookies from '~/plugins/cookies';

const { $cookies, $loginInstance, $axios } = useNuxtApp()

const loading = ref(false);

const passwordShow = ref(false);

const form = reactive({
    email: '',
    password: ''
})

const errorMessage = ref(null)

useHead({
    titleTemplate: '%s - Login'
})

definePageMeta({
    middleware: 'guest',
    layout: false
})


const togglePasswordVisibility = () => {
    passwordShow.value = !passwordShow.value
}

const handleLogin = async () => {
    try {
        loading.value = true;

        const response = await $axios.post('/auth/user', form);

        $cookies.set('auth_user_id', response.data.id);
        $cookies.set('api_token', response.data.api_token);
        $cookies.set('tenant_identifier', response.data.tenant_identifier);

        loading.value = false;

        navigateTo('/');

    } catch (error) {
        loading.value = false;
        errorMessage.value = error.response.data.message
    }
}

</script>
<template>
    <div class="h-screen w-full flex flex-col gap-4 justify-center items-center bg-gray-100 dark:bg-gray-900">
        <div class="w-full bg-white dark:bg-gray-800 px-6 py-4 md:py-8 shadow-md sm:max-w-md sm:rounded-lg space-y-4">

            <div class="flex justify-center">
                <logo class="w-[120px] h-auto" />
            </div>

            <div>
                <label class="text-gray-500 dark:text-gray-400 mb-1" for="email">E-Mail</label>
                <UInput
                    class="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                    color="blue" variant="none" v-model="form.email" type="email" />
            </div>

            <div>
                <label class="text-gray-500 dark:text-gray-400 mb-1" for="">Password</label>
                <div class="relative">
                    <UInput
                        class="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                        v-model="form.password" color="blue" variant="none"
                        :type="passwordShow ? 'text' : 'password'" />
                    <div @click="togglePasswordVisibility"
                        class="absolute top-0 right-0 flex items-center justify-center h-full pr-3 cursor-pointer">
                        <UIcon v-if="passwordShow == false" name="i-heroicons-eye"
                            class="size-4 text-gray-600 dark:text-gray-300" />
                        <UIcon v-else name="i-heroicons-eye-slash" class="size-4 text-gray-600 dark:text-gray-300" />
                    </div>
                </div>
            </div>


            <div>
                <UButton :loading="loading" @click.prevent="handleLogin"
                    class="btn-gradient bg-blue-600 focus:ring-blue-600 ring-offset-1 ring-1" block>Login</UButton>
            </div>

            <div v-if="errorMessage"
                class="p-4 flex gap-4 items-center rounded-md bg-red-100 border-l-4 border-red-500">
                <UIcon name="i-heroicons-x-circle" class="size-8 text-red-600" />
                <span class="text-red-600">{{ errorMessage }}</span>
            </div>


        </div>

        <span class="text-sm text-gray-600">1Tool © 2024</span>
    </div>
</template>
<style scoped>
.btn-gradient {
    background: linear-gradient(50deg, #2f86fe, #9d5ada) !important;
}
</style>