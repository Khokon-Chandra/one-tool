<script setup>
const items = [
    [{
        label: 'demo@1tool.com',
        slot: 'account',
        disabled: true
    }], [{
        label: 'Settings',
        icon: 'i-heroicons-cog-8-tooth'
    },
    {
        label: 'Sign out',
        slot: 'logout',
        icon: 'i-heroicons-arrow-left-on-rectangle'
    }],
];

const { $cookies } = useNuxtApp();

const logout = () => {
    $cookies.remove('auth_user_id');
    $cookies.remove('api_token');
    $cookies.remove('tenant_identifier');
    navigateTo('/login')
}


</script>

<template>
    <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
        :popper="{ placement: 'bottom-start' }">

        <div class="flex gap-2 items-center">
            <UAvatar src="https://avatars.githubusercontent.com/u/1?v=4" />
            <div>
                <span class="block text-xs font-normal text-gray-600">Welcome</span>
                <span class="block text-xs font-semibold text-gray-600 dark:text-gray-400">Radsport Caska</span>
            </div>
        </div>


        <template #account="{ item }">
            <div class="text-left">
                <p>
                    Signed in as
                </p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ item.label }}
                </p>
            </div>
        </template>

        <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
        </template>

        <template #logout="{ item }">
            <button @click="logout" class="flex justify-between items-center w-full">
                <span class="truncate">{{ item.label }}</span>
                <UIcon :name="item.icon" class="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </button>
        </template>
    </UDropdown>
</template>
