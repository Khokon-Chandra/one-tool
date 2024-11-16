<script setup>

const isMenuOpen = ref(true);

const isLinkCollapse = ref(null);

const isHovered = ref(false);

const toggleSidebar = () => {
    isMenuOpen.value = !isMenuOpen.value
}


const links = [
    {
        label: 'Dashboard',
        to: '/',
        icon: 'i-heroicons-chart-pie'
    },

    {
        label: 'Contacts',
        to: '/seminars',
        icon: 'i-heroicons-user-plus'
    },

    {
        label: 'Contact group',
        to: '/seminarss',
        icon: 'i-heroicons-users',

    },

    {
        label: 'Marketing',
        to: '/seminars',
        icon: 'i-heroicons-building-storefront',

    },

    {
        label: 'Sales',
        to: '/seminars',
        icon: 'i-heroicons-chart-bar-square',

    },

    {
        label: 'Products',
        to: '/seminars',
        icon: 'i-heroicons-cube',

    },

    {
        label: 'Shop',
        to: '/seminars',
        icon: 'i-heroicons-shopping-cart',

    },

    {
        label: 'Proposals',
        to: '/seminars',
        icon: 'i-heroicons-inbox',

    },

    {
        label: 'Accounting',
        to: '/seminars',
        icon: 'i-heroicons-calculator',

    },

    {
        label: 'Finance',
        to: '/seminars',
        icon: 'i-heroicons-credit-card',

    },

    {
        label: 'Wiki',
        to: '/seminars',
        icon: 'i-heroicons-light-bulb',

    },

    {
        label: 'Warehouse',
        to: '/seminars',
        icon: 'i-heroicons-building-library',

    },


    {
        label: 'Seminars',
        icon: 'i-heroicons-academic-cap',

        children: [
            {
                label: 'Overview',
                to: '/seminars',
            },
            {
                label: 'New seminar',
                to: '/seminars',
            },
        ]
    },

    {
        label: 'Timetracking',
        to: '/seminars',
        icon: 'i-heroicons-clock',

    },

    {
        label: 'Organization',
        to: '/seminars',
        icon: 'i-heroicons-table-cells',

    },

    {
        label: 'Bookings',
        to: '/seminars',
        icon: 'i-heroicons-inbox-arrow-down',

    },

    {
        label: 'Administration',
        to: '/seminars',
        icon: 'i-heroicons-cog-6-tooth',

    },

]


const toggleCollapse = (index) => {
    if (isLinkCollapse.value == index) {
        isLinkCollapse.value = null
    } else {
        isLinkCollapse.value = index;
    }
}

</script>
<template>

    <nav :class="{
        'w-[16rem]': isMenuOpen,
        'w-16': !isMenuOpen
    }"
        class="flex-col items-stretch relative border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 shadow-sm bg-transparent dark:bg-gray-900/90 duration-300  flex-shrink-0 hidden lg:flex">

        <!-- logo -->
        <div
            class="px-2 my-4 flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 gap-x-4 !border-transparent">
            <logo class="w-[80px]" />
        </div>

        <ul :class="{'overflow-y-auto' : isHovered, 'overflow-y-hidden' : !isHovered}" class="flex flex-col w-full flex-1 overflow-x-hidden scrollbar-light dark:scrollbar-dark duration-300" @mouseover="isHovered = true"
            @mouseleave="isHovered = false">

            <template v-for="(link, index) in links" :key="index">

                <li v-if="!link.to" :class="{ 'justify-center': !isMenuOpen }" @click="toggleCollapse(index)" :title="link.label"
                    class="2-full flex text-sm font-medium items-center space-x-3 px-4 py-2 hover:bg-gray-500/10">

                    <UIcon class="text-xl text-gray-600 dark:text-gray-300" :name="link.icon" />

                    <span v-if="isMenuOpen" class="text-gray-600 dark:text-gray-300 flex-1">{{
                        link.label }} </span>
                    <UIcon v-if="link.children && isMenuOpen"
                        :name="isLinkCollapse == index ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
                </li>

                <li v-if="link.to" :class="{ 'justify-center': !isMenuOpen }" @click="navigateTo(link.to)" :title="link.label"
                    class="cursor-pointer 2-full flex text-sm font-medium items-center space-x-3 px-4 py-2 hover:bg-gray-500/10">

                    <UIcon class="text-xl text-gray-600 dark:text-gray-300" :name="link.icon" />

                    <span v-if="isMenuOpen" class="text-gray-600 dark:text-gray-300 flex-1">{{
                        link.label }} </span>
                    <UIcon v-if="link.children && isMenuOpen"
                        :name="isLinkCollapse == index ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
                </li>

                <ul v-if="link.children && isMenuOpen && isLinkCollapse == index">
                    <li v-for="(child, i) in link.children" :key="`${index}+${i}`" class="pl-12 hover:bg-gray-500/10">
                        <nuxt-link :to="child.to" :title="child.label"
                            class="text-sm font-normal text-gray-600 dark:text-gray-300 py-2 inline-block w-full">{{
                                child.label }}</nuxt-link>
                    </li>
                </ul>
            </template>
        </ul>



        <div class="flex items-center justify-center min-h-[3rem]">
            <button class="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg" @click="toggleSidebar">
                <UIcon v-if="isMenuOpen == true" name="i-heroicons-chevron-double-left" />
                <UIcon v-if="isMenuOpen == false" name="i-heroicons-chevron-double-right" />
            </button>
        </div>
    </nav>
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