<script setup>
import dayjs from 'dayjs';

definePageMeta({
    middleware: "auth",
    layout: "auth",
});
const { $axios } = useNuxtApp();

const toast = useToast();

const courses = ref([]);

const loading = ref(true);

const page = ref(1);

const showEvent = ref(null);

const links = [{
    label: 'Dashboard',
    icon: 'i-heroicons-chart-pie',
    to: '/'
}, {
    label: 'Seminars',
    labelClass: 'text-teal-600',
    icon: 'i-heroicons-academic-cap',
    iconClass: 'text-teal-600'
}]

onMounted(async () => {
    try {
        const response = await $axios.get("/courses?include=events");
        courses.value = response.data;
        loading.value = false;
    } catch (error) {
        toast.add({ title: error.message });
        loading.value = false;
    }
});


const toggleEvent = (courseId) => {
    if (showEvent.value == courseId) {
        showEvent.value = null
    } else {
        showEvent.value = courseId
    }
}
</script>

<template>
    <div class="space-y-4">

        <UBreadcrumb :links="links" :ui="{ ol: 'gap-x-3', li: 'gap-x-3' }">
            <template #divider>
                <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </template>
        </UBreadcrumb>

        <TableSkeleton v-if="loading == true" />

        <div v-if="!loading" class="flex justify-between items-center">
            <div
                class="flex gap-2 items-center border broder-gray-300 dark:border-gray-800/50 bg-white dark:bg-gray-800 px-2 py-1 rounded-md">
                <UIcon name="i-heroicons-bars-2" class="text-md font-semibold text-gray-500 dark:text-gray-400" />
                <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">Filter</span>
            </div>

            <div class="flex items-center gap-4">
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" trailing
                    placeholder="Search..." />

                <UButton color="blue" variant="solid">New Course</UButton>
            </div>
        </div>

        <div v-if="!loading"
            class="bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-100 dark:border-gray-700/90 w-full overflow-x-auto">
            <table class="table-auto w-full">
                <thead>
                    <tr>
                        <th class="th">
                            <UCheckbox color="blue" :disabled="false" />
                        </th>
                        <th class="th"></th>
                        <th class="th">Title</th>
                        <th class="th">Start Date</th>
                        <th class="th">Subtitle</th>
                        <th class="th">Events</th>
                        <th class="th">Shorthand Symbol</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="course in courses.data">
                        <tr>
                            <td class="px-4 py-2 text-center td">
                                <UCheckbox color="blue" :disabled="false" />
                            </td>
                            <td class="td">
                                <div class="flex gap-6 items-center">
                                    <UIcon @click="toggleEvent(course.id)"
                                        class="text-xl font-bold text-blue-600 cursor-pointer"
                                        :name="showEvent == course.id ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
                                    <nuxt-link :to="'seminars/' + course.id">
                                        <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                            name="i-heroicons-arrow-top-right-on-square" />
                                    </nuxt-link>
                                    <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                        name="i-heroicons-square-2-stack" />
                                    <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                        name="i-heroicons-document-check" />
                                    <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                        name="i-heroicons-trash" />
                                </div>
                            </td>
                            <td class="td">
                                <nuxt-link :to="'seminars/' + course.id">
                                    <span class="font-medium">{{ course.title }}</span>
                                </nuxt-link>

                            </td>

                            <td class="td">{{ course.events.length ?
                                dayjs(course.events[0].start_time).format('DD.MM.YYYY HH:mm') : '' }}
                            </td>
                            <td class="td">{{ course.subtitle }}</td>
                            <td class="td">
                                <div class="flex gap-2 flex-wrap">
                                    <UIcon v-for="event in course.events" :key="event.id"
                                        class="text-lg font-semibold text-blue-500" name="i-heroicons-calendar-days" />
                                </div>
                            </td>
                            <td class="td">{{ course.number }}</td>
                        </tr>
                        <tr v-if="showEvent == course.id">
                            <td></td>
                            <td colspan="6">
                                <table class="w-full">
                                    <thead>
                                        <tr>
                                            <th class="th">Title</th>
                                            <th class="th">City</th>
                                            <th class="th">Start Date</th>
                                            <th class="th">End Date</th>
                                            <th class="th">Participant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="event in course.events" :key="event.id">
                                            <td class="td">
                                                <nuxt-link :to="'/events/' + event.id">
                                                    <span class="text-xs font-medium text-blue-500">{{ event.title
                                                        }}</span>
                                                </nuxt-link>
                                            </td>
                                            <td class="td">{{ event.city }}</td>
                                            <td class="td">{{ dayjs(event.start_time).format('DD.MM.YYYY HH:mm') }}</td>
                                            <td class="td">{{ dayjs(event.end_time).format('DD.MM.YYYY HH:mm') }}</td>
                                            <td class="td">{{ event.max_participants || 0 }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <div v-if="courses && courses.meta" class="flex justify-end">
            <UPagination :active-button="{ color: 'blue' }" v-model="page" :page-count="5"
                :total="courses.meta.total" />
        </div>
    </div>
</template>

<style scoped>
.th {
    @apply px-4 py-2 text-left text-sm font-medium border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 uppercase;
}

.td {
    @apply px-4 py-2 text-left text-sm font-normal text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700;
}
</style>
