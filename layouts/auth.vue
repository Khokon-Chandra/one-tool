<script setup lang="ts">

const isOpenSlideOver = ref(false)

const isDark = useDark()

const toggleDark = useToggle(isDark)

const links = [{
    label: 'Dashboard',
    to: '/',
    icon: 'i-heroicons-chart-pie'
},

{
    label: 'Contact',
    to: '/contacts',
    icon: 'i-heroicons-user-plus'
},

{
    label: 'Contact group',
    to: '/contact-groups',
    icon: 'i-heroicons-users',
    children: [
        {
            label: 'Contact',
            to: '/contacts',
            icon: 'i-heroicons-user-plus'
        },
        {
            label: 'Contact',
            to: '/contacts',
            icon: 'i-heroicons-user-plus'
        },
    ]
},

{
    label: 'Seminars',
    to: '/seminars',
    icon: 'i-heroicons-academic-cap',
},
{
    label: 'Calendar',
    to: '/calendars',
    icon: 'i-heroicons-calendar-20-solid'
},

]
</script>

<template>
    <div class="h-screen w-screen overflow-hidden fixed inset-0 flex">

        <!-- SlideOver Menu -->
        <!-- <USlideover side="left" v-model="isOpenSlideOver">
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
        </USlideover> -->


        <!-- Sidebar Navigation -->
        <SidebarNavigation />

        <main class="flex flex-1 w-full min-w-0">
            <div class="flex-col items-stretch relative w-full flex-1 flex">
                <!-- header -->
                <header
                    class="h-[4rem] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 bg-white dark:bg-gray-800/95">
                    <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">

                        <div class="flex gap-3 items-center">
                            <UIcon @click="isOpenSlideOver = true" class="flex lg:hidden text-2xl cursor-pointer"
                                name="i-heroicons-bars-3" />
                            <USelect color="blue" :options="['Jhone Abraham', 'Prime', 'Auth']" value="Jhone Abraham" />
                        </div>

                        <div class="flex justify-end items-center gap-4 flex-1">
                            <div class="max-w-lg hidden md:flex flex-1">
                                <UInput type="search" class="w-full" icon="i-heroicons-magnifying-glass-20-solid"
                                    size="sm" color="gray" :trailing="false" placeholder="Search..." />
                            </div>
                            <div class="cursor-pointer">
                                <UIcon class="text-xl coursor-pointer"
                                    :name="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'"
                                    @click="toggleDark()" />
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

                <!-- Page Content (Slot) -->
                <section
                    class="p-4 w-full bg-gray-50 dark:bg-gray-900 h-full overflow-y-auto pb-16 scrollbar-light dark:scrollbar-dark">
                    <slot />
                </section>


                <!-- Footer Slot -->
                <footer v-if="$slots.footer"
                    class="min-h-[4rem] flex-shrink-0 flex items-center border-t border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 bg-white/20 dark:bg-gray-800/95">

                    <slot name="footer">
                        <p class="text-sm font-normal text-gray-600 dark:text-gray-400 text-center w-full">footer
                            content goes
                            here</p>
                    </slot>
                </footer>
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