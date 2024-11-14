<script setup>
const { $cookies, $axios } = useNuxtApp();
definePageMeta({
    middleware: 'auth',
    layout: 'auth'
})

const links = [{
    label: 'Development',
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
    <div class="space-y-4">

        <UBreadcrumb :links="links" :ui="{ ol: 'gap-x-3', li: 'gap-x-3' }">
            <template #divider>
                <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </template>
        </UBreadcrumb>


        <div class="flex gap-4 justify-between items-center">
            <UCard class="w-full bg-white dark:bg-gray-800 h-[20rem] flex justify-center items-center">
                <div class="max-w-xl">
                    <h1 class="text-blue-500 dark:text-gray-300 text-4xl font-bold text-center mb-4">
                        We’re building something awesome here. Check back soon!
                    </h1>
                    <p class="text-sm font-normal leading-5 text-gray-500 text-center">
                        This page is currently under development as we’re working to bring you a new, enhanced
                        experience.
                        We
                        appreciate your patience and enthusiasm while we make it the best it can be. Please check back
                        soon
                        to
                        explore the exciting features we have in store!"
                    </p>

                    <div class="text-center mt-4">
                        <UButton class="px-6 text-sm font-semibold" size="lg" color="blue" label="Go to Seminar"
                            @click="navigateTo('/seminars')" />
                    </div>

                </div>
            </UCard>
        </div>

    </div>
</template>