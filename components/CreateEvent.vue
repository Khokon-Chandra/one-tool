<script setup>

import { format } from 'date-fns'

const props = defineProps({
    modelValue: Boolean,
    categories: Object
})

const emit = defineEmits(["update:modelValue"])

const endDate = ref(new Date())

const startDate = ref(new Date())


const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const endDateFormat = computed(() => {
    return format(endDate.value, 'd/ MM/ yyy')
})

const startDateFormat = computed(() => {
    return format(startDate.value, 'd/ MM/ yyy')
})


</script>

<template>
    <div>

        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h1 class="text-lg font-semibold text-gray-600 dark:text-gray-300">New Event</h1>
                </template>

                <div class="space-y-4">

                    <div>
                        <label class="text-sm text-gray-600 dark:text-gray-300 font-semibold" for="title">Title</label>
                        <UInput id="title" color="blue" placeholder="title" />
                    </div>

                    <div>
                        <label class="text-sm text-gray-600 dark:text-gray-300 font-semibold"
                            for="category">Category</label>
                        <USelect id="category" color="blue" :options="categories" placeholder="Category"
                             />
                    </div>

                    <div>
                        <label class="text-sm text-gray-600 dark:text-gray-300 font-semibold" for="start_date">Start
                            Date</label>
                        <div>
                            <UPopover :popper="{ placement: 'top-end' }">
                                <UInput class="w-full justify-between" type="text" color="blue"
                                    icon="i-heroicons-calendar-days-20-solid" v-model="startDateFormat" trailing="" />


                                <template #panel="{ close }">
                                    <DatePicker v-model="startDate" is-required @close="close" />
                                </template>
                            </UPopover>

                        </div>
                    </div>

                    <div>
                        <label class="text-sm text-gray-600 dark:text-gray-300 font-semibold" for="title">End
                            Date</label>
                        <div>
                            <UPopover :popper="{ placement: 'top-end' }">
                                <UInput class="w-full justify-between" type="text" color="blue"
                                    icon="i-heroicons-calendar-days-20-solid" v-model="endDateFormat" trailing="" />


                                <template #panel="{ close }">
                                    <DatePicker v-model="endDate" is-required @close="close" />
                                </template>
                            </UPopover>

                        </div>
                    </div>

                </div>

                <template #footer>
                    <div class="flex justify-end items-center gap-2">
                        <UButton class="px-8" size="md" @click="isOpen = false" color="gray" label="Cancel" />
                        <UButton class="px-8" size="md" color="blue" label="Submit" />
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>
