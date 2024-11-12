<template>
    <div class="space-y-2 bg-white dark:bg-gray-900 p-6 dark:p-0">
        <div v-for="item in 10" :key="item" class="flex gap-1">
            <USkeleton class="h-8 w-full" />
            <USkeleton class="h-8 w-full" />
            <USkeleton class="h-8 w-full" />
            <USkeleton class="h-8 w-full" />
            <USkeleton class="h-8 w-full" />
            <USkeleton class="h-8 w-full" />
        </div>
    </div>

</template>

