<script setup>

const props = defineProps({
    modelValue: Boolean,
    options: Array,
})

const emit = defineEmits(["update:modelValue"])

const loading = ref(false);

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value)
    }
})

const searchString = ref(null);


const columns = reactive([...props.options]);


const getFilteredColumns = computed(() => {
    if (!searchString.value) {
        return columns;
    }
    return columns.filter(column =>
        column.label.toLowerCase().includes(searchString.value.toLowerCase())
    );
})




</script>

<template>
    <div>

        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

                <template #header>
                    <h1 class="text-lg font-semibold text-gray-600 dark:text-gray-300">Columns</h1>
                </template>

                <div class="space-y-4">
                    <UInput v-model="searchString" size="md" type="search" placeholder="search by column name"
                        color="blue" icon="i-heroicons-magnifying-glass-20-solid" trailing="true" />

                    <div>
                        <h5 class="text-sm font-semibold text-blue-500">Standard fields</h5>
                        <hr class="mb-4 dark:border-gray-800">

                        <div class="grid grid-cols-2 gap-4">
                            <UCheckbox v-for="column in getFilteredColumns" :key="column" v-model="column.status"
                                color="blue" :label="column.label" class="capitalize" />
                        </div>

                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-end items-center gap-2">
                        <UButton class="px-8" size="md" @click="isOpen = false" color="gray" label="Cancel" />
                        <UButton type="button" class="px-8" size="md" color="blue" label="Save" :loading="loading"
                            @click="isOpen = false" />
                    </div>
                </template>

            </UCard>
        </UModal>
    </div>
</template>
