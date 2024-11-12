<script setup>
import dayjs from 'dayjs';

const openTitle = ref(false)
const openSubtitle = ref(false)

defineShortcuts({
    o: () => {
        openTitle.value = !openTitle.value
    }
})

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


const eventCreateModal = ref(false);


const courseForm = reactive({
    title: '',
    subtitle: '',

})


const links = reactive([{
    label: 'Dashboard',
    icon: 'i-heroicons-chart-pie',
    to: '/'
}, {
    label: 'Seminars',
    icon: 'i-heroicons-academic-cap',
    to: '/seminars'
}, {
    label: 'Details',
    labelClass: 'text-teal-600',
    icon: 'i-heroicons-link',
    iconClass: 'text-teal-600'
}]);


onMounted(async () => {
    try {
        const response = await $axios.get("/courses/" + courseId + "?include=events");
        course.value = response.data.data;
        singleEvent.value = course.value.events.length == 1
        loading.value = false;

        links[2].label = course.value.title;

    } catch (error) {
        toast.add({ title: error.message });
        loading.value = false;
    }
});



</script>

<template>
    <div class="space-y-4">

        <UBreadcrumb :links="links" :ui="{ ol: 'gap-x-3', li: 'gap-x-3' }">
            <template #divider>
                <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </template>
        </UBreadcrumb>

        <create-event @close-modal="eventCreateModal = false" :isOpen="eventCreateModal" />

        <TableSkeleton v-if="loading == true" />

        <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UCard class="w-full bg-white dark:bg-gray-800">
                <h4 class="text-sm font-medium text-teal-600 mb-2">Course</h4>
                <hr class="w-full dark:border-gray-700/90">
                <h1 class="text-xl font-bold text-blue-500 my-3">{{ course.title }}</h1>
                <h6 class="text-md font-medium text-blue-400">Master Data</h6>
                <hr class="w-full dark:border-gray-700/90">

                <table class="w-full">
                    <tr>
                        <th class="th">Title</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openTitle" :popper="{ arrow: true }">
                                    <UButton color="white" variant="none" @click="courseForm.title = course.title"
                                        class="inline cursor-pointer hover:text-blue-500 font-semibold">{{ course.title
                                        }}</UButton>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Title</h1>
                                        <div class="min-w-[350px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="courseForm.title"
                                                type="search" />
                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" />
                                            <UButton class="rounded-sm" @click="openTitle = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="th">Subtitle</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openSubtitle" :popper="{ arrow: true }">
                                    <UButton color="white" variant="none" @click="courseForm.subtitle = course.subtitle"
                                        :class="{
                                            'text-gray-400': !course.subtitle
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                            course.subtitle || 'Subtitle'
                                        }}</UButton>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Subtitle</h1>
                                        <div class="min-w-[350px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="courseForm.subtitle"
                                                type="search" />
                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" />
                                            <UButton class="rounded-sm" @click="openSubtitle = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
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
                <h4 class="text-sm font-medium text-teal-600 mb-2">Events ({{ course.events.length }})</h4>

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
                                        <nuxt-link :to="'/events/' + event.id">
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
                    <UButton @click="eventCreateModal = true" icon="i-heroicons-plus" size="sm" color="blue"
                        variant="solid" label="Create" :trailing="false" />
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
