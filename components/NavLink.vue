<script setup>
defineProps({
    link: String,
    icon: String,
})

const route = useRoute();

</script>
<template>
    <li class="!overflow-visible">
        <div class="flex">
            <nuxt-link
                class="group relative flex items-center gap-2.5 px-2.5 py-1.5 w-full rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-blue-500 dark:focus-visible:before:ring-blue-400 before:absolute before:inset-px before:rounded-md disabled:cursor-not-allowed disabled:opacity-75"
                :to="link">

                <UIcon class="text-2xl text-gray-500 dark:text-gray-500" :name="icon" />

                <span class="flex-shrink-0 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <slot />
                </span>
            </nuxt-link>
        </div>
    </li>
</template>
<style scoped>
.router-link-exact-active{
    @apply bg-gray-500/10;
}
</style>