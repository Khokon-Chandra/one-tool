<template>
    <div class="h-screen w-screen overflow-hidden fixed inset-0 flex">


        <nav class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-800 lg:w-[262px] flex-shrink-0 hidden lg:flex"
            style="width:250px">

            <div
                class="h-[4rem] flex-shrink-0 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent">
                <logo class="w-16" />
            </div>

            <div class="flex flex-col w-full flex-1 relative overflow-hidden">
                <div class="flex-grow flex flex-col min-h-0 gap-y-2 py-2">
                    <div class="flex-1 px-4 flex flex-col gap-y-2 overflow-y-auto">
                        <ul class="relative !min-h-[auto] !min-w-[auto] space-y-1">
                            <nav-link link="/" icon="i-heroicons-chart-pie">Dashboard</nav-link>
                            <nav-link link="/seminars" icon="i-heroicons-academic-cap">Seminar</nav-link>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>


        <main class="flex flex-1 w-full min-w-0">
            <div class="flex-col items-stretch relative w-full flex-1 flex">
                <!-- header -->
                <header
                    class="h-[4rem] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 bg-white dark:bg-gray-800/95">
                    <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">

                        <div class="flex gap-3 items-center">
                            <UIcon class="flex lg:hidden text-2xl cursor-pointer" name="i-heroicons-bars-3" />
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
                    class="p-6 w-full bg-gray-100 dark:bg-gray-900 h-full overflow-y-auto pb-16 scrollbar-light dark:scrollbar-dark">
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