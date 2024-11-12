<script setup>
import dayjs from 'dayjs';

definePageMeta({
    middleware: "auth",
    layout: "auth",
});

/**
 * Popover constants
 */
const openTitle = ref(false)
const openSubtitle = ref(false)
const openShorthandSymbol = ref(false);
const openCategory = ref(false);
const openCourse = ref(false);


const { $axios, $cookies } = useNuxtApp();

const toast = useToast();

const course = ref([]);

const categories = ref([]);

const courseList = ref([]);

const loading = ref(true);

const updateLoading = ref(false);

const page = ref(1);

const courseId = useRoute().params.id


const singleEvent = ref(false);


const eventCreateModal = ref(false);


const payload = reactive({
    id: '',
    title: '',
    subtitle: '',
    is_overnight_stay_available: '',
    created_by: '',
    updated_by: 0,
    max_number: '',
    has_single_event: 0,
});


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

        $axios.get('/courses')
            .then(response => {
                courseList.value = response.data.data;
            })

        const courseListResponse = await $axios.get("/courses/" + courseId + "?include=events");
        const categoriesResponse = await $axios.get('/course-categories');



        course.value = courseListResponse.data.data;
        categories.value = categoriesResponse.data.data.map((item) => {
            return { name: item.name, value: item.id }
        });
        singleEvent.value = course.value.events.length == 1
        loading.value = false;

        links[2].label = course.value.title;

        /**
         * Update course form attribute
         */
        payload.id = course.value.id;
        payload.title = course.value.title;
        payload.subtitle = course.value.subtitle;
        payload.is_overnight_stay_available = course.value.is_overnight_stay_available;
        payload.created_by = course.value.created_by;
        payload.max_number = course.value.max_number;
        payload.has_single_event = course.value.has_single_event;
        payload.updated_by = $cookies.get('auth_user_id') || 0;
        payload.has_single_event = course.value.has_single_event;

    } catch (error) {
        toast.add({ title: error.message });
        loading.value = false;
    }
});

const selectedCategory = computed(() => {
    if (!course.value.course_category_id) {
        return false
    }
    return categories.value.filter((item) => {
        return item.value == course.value.course_category_id
    }).at(-1).name;

});


const parentCourseName = computed(() => {
    if (!course.value.parent_id) {
        return false
    }
    return courseList.value.filter((item) => {
        return item.id == course.value.parent_id
    }).at(-1).title;

});


const updateCourse = async (callback) => {

    try {

        updateLoading.value = true;

        const response = await $axios.put('/courses/' + course.value.id, payload);

        const data = response.data.data;

        data["events"] = course.value.events;

        course.value = data;

        links[2].label = course.value.title;

        updateLoading.value = false;

        setTimeout(() => {
            callback();
        }, 1000);

    } catch (error) {
        updateLoading.value = false;
        useToast().add({
            title: error.message
        })
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

        <create-event @close-modal="eventCreateModal = false" :isOpen="eventCreateModal" />

        <TableSkeleton v-if="loading == true" />

        <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UCard class="w-full bg-white dark:bg-gray-800">
                <h4 class="text-sm font-medium text-teal-600 mb-2 uppercase">Course</h4>
                <hr class="w-full dark:border-gray-700/90">
                <h1 class="text-lg font-bold uppercase text-blue-500 my-3">{{ course.title }}</h1>
                <h6 class="text-md font-medium text-blue-400">Master Data</h6>
                <hr class="w-full dark:border-gray-700/90">

                <table class="w-full">
                    <tr>
                        <th class="th">Title</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openTitle" :popper="{ arrow: true }">
                                    <span color="white" variant="none" @click="payload.title = course.title"
                                        class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                            course.title
                                        }}</span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Title</h1>
                                        <div
                                            class="min-w-[350px] md:min-w-[550px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="payload.title" type="search" />

                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    openTitle = false
                                                })" :loading="updateLoading" />

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
                                    <UButton color="white" variant="none" @click="payload.subtitle = course.subtitle"
                                        :class="{
                                            'text-gray-400': !course.subtitle
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                            course.subtitle || 'Subtitle'
                                        }}</UButton>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Subtitle</h1>
                                        <div class="min-w-[250px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="payload.subtitle"
                                                type="search" />
                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    openSubtitle = false
                                                })" :loading="updateLoading" />

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
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openShorthandSymbol" :popper="{ arrow: true }">
                                    <UButton color="white" variant="none" @click="payload.number = course.number"
                                        :class="{
                                            'text-gray-400': !course.number
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                            course.number || 'Shorthand symbol'
                                        }}</UButton>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Shorthand Symbol
                                        </h1>
                                        <div class="min-w-[250px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="payload.number"
                                                type="search" />
                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    openShorthandSymbol = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="openShorthandSymbol = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <th class="th">Seminar member</th>
                        <td class="td">{{ course.max_number }}</td>
                    </tr>

                    <tr>
                        <th class="th">Course Category</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openCategory" :popper="{ arrow: true }">
                                    <UButton color="white" variant="none"
                                        @click="payload.course_category_id = course.course_category_id" :class="{
                                            'text-gray-400': !course.course_category_id
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                            selectedCategory || 'course category'
                                        }}</UButton>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Course Category
                                        </h1>
                                        <div class="min-w-[250px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <select
                                                class="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                v-model="payload.course_category_id">
                                                <option v-for="category in categories" :key="category.value"
                                                    :value="category.value">{{ category.name }}</option>
                                            </select>


                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    openCategory = false
                                                })" :loading="updateLoading" />


                                            <UButton class="rounded-sm" @click="openCategory = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td class="py-8"></td>
                        <td></td>
                    </tr>

                    <tr>
                        <th class="th">Parent Course</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openCourse" :popper="{ arrow: true }">
                                    <span color="white" variant="none"
                                        @click="payload.parent_id = course.parent_id" :class="{
                                            'text-gray-400': !course.parent_id
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                            parentCourseName || 'Parent course'
                                        }}</span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Parent Course
                                        </h1>
                                        <div class="min-w-[250px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <select
                                                class="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                v-model="payload.parent_id">
                                                <option v-for="item in courseList" :key="item.id" :value="item.id">{{
                                                    item.title }}</option>
                                            </select>


                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    openCourse = false
                                                })" :loading="updateLoading" />


                                            <UButton class="rounded-sm" @click="openCourse = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <th class="th">Course includes only one event</th>
                        <td class="td">
                            <UToggle color="blue" :model-value="payload.has_single_event" @click="(() => {
                                payload.has_single_event = !payload.has_single_event;
                                updateCourse(function () {
                                    return;
                                })
                            })()" />
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
                <h4 class="text-sm font-medium text-teal-600 mb-2 uppercase">Events ({{ course.events.length }})</h4>

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

                                        <UIcon class="text-lg font-bold text-blue-600 cursor-pointer"
                                            name="i-heroicons-trash" />
                                    </div>
                                </td>
                                <td class="event-td min-w-[10rem]">
                                    <span class="text-xs font-semibold text-blue-500">{{ event.title }}</span>
                                </td>
                                <td class="event-td">
                                    {{ event.location }}
                                </td>
                                <td class="event-td">{{ event.extra_person }}</td>
                                <td class="event-td min-w-[6rem]">{{ dayjs(event.start_time).format('DD-MM-YYYY HH:mm') }}</td>
                                <td class="event-td min-w-[6rem]">{{ dayjs(event.end_time).format('DD-MM-YYYY HH:mm') }}</td>
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
