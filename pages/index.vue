<script setup>
const { $cookies, $axios } = useNuxtApp();
definePageMeta({
    middleware: 'auth',
    layout: 'auth'
})

const links = [{
    label: 'Dashboard',
    labelClass: 'text-teal-600',
    icon: 'i-heroicons-chart-pie',
    iconClass: 'text-teal-600'
}]

const logout = () => {
    $cookies.remove('api_token');
    navigateTo('/login')
}
</script>

<template>
    <NuxtLayout>
        <div class="space-y-4">

            <UBreadcrumb :links="links" :ui="{ ol: 'gap-x-3', li: 'gap-x-3' }">
                <template #divider>
                    <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                </template>
            </UBreadcrumb>

            <UCard class="text-center bg-teal-500/10 dark:bg-teal-500/10">Welcome to 1Tool application!!</UCard>

            <div class="flex gap-4 justify-between items-center">
                <UCard class="w-full bg-white dark:bg-gray-800">
                    Dashboard Content goes here
                    <p class="text-xs font-thin text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Pariatur, temporibus excepturi minima quas libero beatae impedit totam consequuntur odio amet
                        labore
                        dolores ratione non blanditiis quibusdam eius repellat soluta molestias.</p>
                </UCard>

                <UCard class="w-full bg-white dark:bg-gray-800">
                    Dashboard Content goes here
                    <p class="text-xs font-thin text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Pariatur, temporibus excepturi minima quas libero beatae impedit totam consequuntur odio amet
                        labore
                        dolores ratione non blanditiis quibusdam eius repellat soluta molestias.</p>
                </UCard>
            </div>

        </div>
    </NuxtLayout>
</template>