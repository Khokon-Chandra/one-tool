<script setup>
import dayjs from 'dayjs';

definePageMeta({
    middleware: "auth",
    layout: "auth",
});
const { $axios } = useNuxtApp();

const toast = useToast();

const course = ref([]);

const loading = ref(true);

const page = ref(1);

const courseId = useRoute().params.id


const singleEvent = ref(false);


onMounted(async () => {
    try {
        const response = await $axios.get("/courses/" + courseId + "?include=events");
        course.value = response.data.data;
        singleEvent.value = course.value.events.length == 1
        loading.value = false;
    } catch (error) {
        toast.add({ title: error.message });
        loading.value = false;
    }
});



</script>

<template>
    <div class="space-y-4">
        <h1 class="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Event Detail
        </h1>

        <TableSkeleton v-if="loading == true" />

        <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UCard class="w-full bg-white dark:bg-gray-800">
                <h4 class="text-md font-medium text-gray-600 dark:text-gray-300 mb-2">Course</h4>
                <hr class="w-full dark:border-gray-700/90">
                <h1 class="text-xl font-bold text-blue-500 my-3">{{ course.title }}</h1>
                <h6 class="text-md font-medium text-blue-400">Master Data</h6>
                <hr class="w-full dark:border-gray-700/90">

                <table class="w-full">
                    <tr>
                        <th class="th">Title</th>
                        <td class="td">{{ course.title }}</td>
                    </tr>
                    <tr>
                        <th class="th">Subtitle</th>
                        <td class="td">{{ course.subtitle }}</td>
                    </tr>

                    <tr>
                        <th class="th">Shorthand symbol</th>
                        <td class="td">{{ course.number }}</td>
                    </tr>

                    <tr>
                        <th class="th">Seminar member</th>
                        <td class="td">{{ course.max_number }}</td>
                    </tr>

                    <tr>
                        <th class="th">Course Category</th>
                        <td class="td">{{ course.course_category_id }}</td>
                    </tr>

                    <tr>
                        <th class="th">Parent Course</th>
                        <td class="td">{{ course.parent_course_id }}</td>
                    </tr>

                    <tr>
                        <th class="th">Course includes only one event</th>
                        <td class="td">
                            <UToggle color="blue" :model-value="singleEvent" @click="singleEvent = !singleEvent" />
                        </td>
                    </tr>

                    <tr>
                        <th class="th">ID</th>
                        <td class="td">{{ course.id }}</td>
                    </tr>

                    <tr>
                        <th class="th">Creation Date</th>
                        <td class="td">{{ dayjs(course.created_at).format('DD-MM-YYYY HH:mm') }}</td>
                    </tr>

                </table>

            </UCard>
            <UCard class="w-full  bg-white dark:bg-gray-800">
                <h4 class="text-md font-medium text-blue-600 mb-2">Events ({{ course.events.length }})</h4>

                <div class="w-full overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="event-th"></th>
                                <th class="event-th">Title</th>
                                <th class="event-th">Location</th>
                                <th class="event-th">Add People</th>
                                <th class="event-th">Start Date</th>
                                <th class="event-th">End Date</th>
                                <th class="event-th">All Day</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="event in course.events" :key="event.id">
                                <td class="event-td">
                                    <div class="flex gap-2 items-center">
                                        <nuxt-link :to="'seminars/' + event.id">
                                            <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                                name="i-heroicons-arrow-top-right-on-square" />
                                        </nuxt-link>
                                        <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                            name="i-heroicons-square-2-stack" />

                                        <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                            name="i-heroicons-trash" />
                                    </div>
                                </td>
                                <td class="event-td">
                                    <span class="text-xs font-semibold text-blue-500">{{ event.title }}</span>
                                </td>
                                <td class="event-td">
                                    {{ event.location }}
                                </td>
                                <td class="event-td">{{ event.extra_person }}</td>
                                <td class="event-td">{{ dayjs(event.start_time).format('DD-MM-YYYY HH:mm') }}</td>
                                <td class="event-td">{{ dayjs(event.end_time).format('DD-MM-YYYY HH:mm') }}</td>
                                <td class="event-td">
                                    <UIcon class="text-lg text-primary-500" v-if="event.is_all_day"
                                        name="i-heroicons-check-circle" />
                                    <UIcon class="text-lg text-red-500" else name="i-heroicons-x-circle" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div class="flex justify-end mt-16 w-full">

                    <UButton icon="i-heroicons-plus" size="sm" color="blue" variant="solid" label="Create"
                        :trailing="false" />


                </div>
            </UCard>
        </div>

    </div>
</template>

<style scoped>
.th {
    @apply text-left text-sm text-wrap w-[35%] font-bold text-gray-600 dark:text-gray-300 px-4 py-1;
}

.td {
    @apply text-sm font-semibold text-gray-600 dark:text-gray-300 px-4 py-1;
}

.event-th {
    @apply border-t border-t-gray-200 dark:border-t-gray-700/90 p-2 text-sm font-medium text-gray-600 dark:text-gray-300 capitalize;
}

.event-td {
    @apply border-t border-t-gray-200 dark:border-t-gray-700/90 p-2 text-xs font-normal text-gray-600 dark:text-gray-300;
}
</style>
