<script setup>
defineProps({
    link: String,
    icon: String,
})

const route = useRoute();

</script>
<template>
    <li class="!overflow-visible">
        <div>

            <div class="flex">
                <nuxt-link
                    class="group relative flex items-center gap-1.5 px-2.5 py-1.5 w-full rounded-md font-medium text-sm focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-blue-500 dark:focus-visible:before:ring-blue-400 before:absolute before:inset-px before:rounded-md disabled:cursor-not-allowed disabled:opacity-75 text-gray-900 dark:text-white  dark:before:bg-gray-800"
                    :to="link">

                    <UIcon class="text-lg" :name="icon" />

                    <span class="flex-shrink-0 w-5 h-5 relative text-gray-900 dark:text-white" aria-hidden="true"
                        style="">
                        <slot />
                    </span>
                </nuxt-link>
            </div>
        </div>
    </li>
</template>