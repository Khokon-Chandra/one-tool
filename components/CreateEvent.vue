<script setup>
import { z } from 'zod';

const props = defineProps({
    modelValue: Boolean,
    categories: Object,
})

const emit = defineEmits(["update:modelValue"])

const loading = ref(false);

const form = ref(null)

const schema = z.object({

    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),

    calendar_categories_id: z.string().nonempty('Category is required'),

    start_time: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Start date is invalid',
    }),

    end_time: z.string()
        .refine(date => !isNaN(Date.parse(date)), {
            message: 'End date is invalid',
        })
        .refine((endDate) => {
            const start_date = state.value.start_time;
            return new Date(endDate) >= new Date(start_date);
        }, {
            message: 'End date must be after start date',
        }),
})


const initialState = {
    course_id: useRoute().params.id,
    calendar_event_id: 1,
    is_main_event:true,
    title: undefined,
    calendar_categories_id: undefined,
    start_time: undefined,
    end_time: undefined,
};

const state = ref({
    ...initialState
})

const resetForm = () => {
    Object.assign(state.value, initialState)
    form.value.clear()
}



const save = async () => {

    if (form.value.errors.length) return

    try {

        loading.value = true;

        const { $axios } = useNuxtApp();

        const response = await $axios.post('/course-events', state.value);

        resetForm();

        isOpen.value = false;

        useToast().add({ title: "Successfully event created", icon: 'i-heroicons-check-circle' });

    } catch (error) {
        useToast().add({ title: 'Event not saved', description: error.message, icon: 'i-heroicons-exclamation-circle' });
    } finally {
        loading.value = false;
    }

}


const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) resetForm();
        emit('update:modelValue', value)
    }
})

</script>

<template>
    <div>

        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

                <template #header>
                    <h1 class="text-lg font-semibold text-gray-600 dark:text-gray-300">New Event</h1>
                </template>

                <UForm :schema="schema" :state="state" ref="form" @submit.prevent="save" class="space-y-4">

                    <UFormGroup label="Title" required="true" name="title">
                        <UInput id="title" color="blue" placeholder="title" v-model="state.title" />
                    </UFormGroup>

                    <UFormGroup label="Category" required="true" name="calendar_categories_id">
                        <USelect color="blue" class="text-gray-600" :options="categories" placeholder="Category"
                            v-model="state.calendar_categories_id" />
                    </UFormGroup>

                    <UFormGroup label="Start Date" required="true" name="start_time">
                        <UInput color="blue" type="date" icon="i-heroicons-calendar-days-20-solid"
                            v-model="state.start_time" />
                    </UFormGroup>

                    <UFormGroup label="End Date" required="true" name="end_time">
                        <UInput color="blue" type="date" icon="i-heroicons-calendar-days-20-solid"
                            v-model="state.end_time" />
                    </UFormGroup>

                    <div class="flex justify-end items-center gap-2">
                        <UButton class="px-8" size="md" @click="isOpen = false" color="gray" label="Cancel" />
                        <UButton type="submit" class="px-8" size="md" color="blue" label="Submit" :loading="loading" />
                    </div>

                </UForm>
            </UCard>
        </UModal>
    </div>
</template>
