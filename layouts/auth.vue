<script setup lang="ts">

const isOpenSlideOver = ref(false)


const links = [{
    label: 'Dashboard',
    to: '/',
    icon: 'i-heroicons-chart-pie'
}, {
    label: 'Seminars',
    to: '/seminars',
    icon: 'i-heroicons-academic-cap',
}, {
    label: 'Calendar',
    to: '/calendars',
    icon: 'i-heroicons-calendar-20-solid'
},
{
    label: 'Contact',
    to: '/contacts',
    icon: 'i-heroicons-user'
}
]
</script>

<template>
    <div class="h-screen w-screen overflow-hidden fixed inset-0 flex">


        <USlideover side="left" v-model="isOpenSlideOver">
            <div class="p-4 flex-1">

                <div class="flex justify-between items-center p-4">

                    <logo class="w-16" />

                    <UButton color="red" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid" class="text-lg"
                        square padded @click="isOpenSlideOver = false" />

                </div>


                <div class="">
                    <UVerticalNavigation :links="links" />
                </div>
            </div>
        </USlideover>

        <nav class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 shadow-lg bg-gray-50 dark:bg-gray-900/90 lg:w-[262px] flex-shrink-0 hidden lg:flex"
            style="width:250px">

            <div
                class="h-[4rem] flex-shrink-0 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent">
                <logo class="w-16" />
            </div>

            <div class="flex flex-col w-full flex-1 overflow-hidden px-4">

                <UVerticalNavigation :links="links" />

            </div>
        </nav>

        <main class="flex flex-1 w-full min-w-0">
            <div class="flex-col items-stretch relative w-full flex-1 flex">
                <!-- header -->
                <header
                    class="h-[4rem] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 bg-white dark:bg-gray-800/95">
                    <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">

                        <div class="flex gap-3 items-center">
                            <UIcon @click="isOpenSlideOver = true" class="flex lg:hidden text-2xl cursor-pointer"
                                name="i-heroicons-bars-3" />
                            <USelect color="blue" :options="['Jhone Abraham', 'Prime', 'Auth']" />
                        </div>

                        <div class="flex justify-end items-center gap-4 flex-1">
                            <div class="max-w-xl flex-1">
                                <UInput class="w-full" icon="i-heroicons-magnifying-glass-20-solid" size="sm"
                                    color="Slate" :trailing="false" placeholder="Search..." />
                            </div>
                            <div>
                                <UIcon class="text-xl cursor-pointer" name="i-heroicons-bell" />
                            </div>
                            <div>
                                <Avatar />
                            </div>
                        </div>
                    </div>
                </header>
                <div
                    class="p-6 w-full bg-blue-400/5 dark:bg-gray-900 h-full overflow-y-auto pb-16 scrollbar-light dark:scrollbar-dark">
                    <slot />
                </div>
            </div>
        </main>

    </div>
</template>

<style scoped>
/* Light Theme Scrollbar */
.scrollbar-light::-webkit-scrollbar {
    width: 10px;
}

.scrollbar-light::-webkit-scrollbar-track {
    background-color: #f3f4f6;
    /* Light background color */
}

.scrollbar-light::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    /* Light gray thumb */
    border-radius: 10px;
}

/* Dark Theme Scrollbar */
.scrollbar-dark::-webkit-scrollbar {
    width: 10px;
}

.scrollbar-dark::-webkit-scrollbar-track {
    background-color: #1f2937;
    /* Dark background color */
}

.scrollbar-dark::-webkit-scrollbar-thumb {
    background-color: #4b5563;
    /* Dark gray thumb */
    border-radius: 10px;
}
</style>