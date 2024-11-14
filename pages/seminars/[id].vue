<script setup>
import dayjs from 'dayjs';

// Page Meta & Layout
definePageMeta({
    middleware: 'auth',
    layout: 'auth'
});

// Nuxt 3 App-level injections
const { $axios, $cookies } = useNuxtApp();
const toast = useToast();
const route = useRoute();

// UI State Constants
const popovers = reactive({
    title: false,
    subtitle: false,
    shorthandSymbol: false,
    category: false,
    course: false,
    content: false,
    goals: false,
    teaser: false,
    targetGroup: false,
    note: false,
    cost: false,
});

const isOpenEventModal = ref(false);
const loading = ref(true);
const updateLoading = ref(false);

// Course and Category Data
const courseId = route.params.id;
const course = ref(null);
const categories = ref([]);
const CalendarCagegories = ref([]);
const courseList = ref([]);

// Links for Breadcrumbs or Navigation
const links = reactive([
    { label: 'Dashboard', icon: 'i-heroicons-chart-pie', to: '/' },
    { label: 'Seminars', icon: 'i-heroicons-academic-cap', to: '/seminars' },
    { label: 'Details', labelClass: 'text-teal-600', icon: 'i-heroicons-link', iconClass: 'text-teal-600' }
]);

// Course Form Payload
const payload = reactive({
    id: '',
    title: '',
    subtitle: '',
    course_category_id: '',
    is_overnight_stay_available: '',
    created_by: '',
    updated_by: 0,
    max_number: '',
    has_single_event: 0,
    contents: '',
    goals: '',
    teaser: '',
    target_group: '',
    cost_information: '',
    notes: '',
});

// Computed Properties
const selectedCategory = computed(() => {
    const category = categories.value.find(item => item.value === course.value?.course_category_id);
    return category ? category.label : null;
});

const parentCourseName = computed(() => {
    const parentCourse = courseList.value.find(item => item.id === course.value?.parent_id);
    return parentCourse ? parentCourse.title : null;
});

// Fetch Data Functions
const fetchCourses = async () => {
    const response = await $axios.get('/courses');
    courseList.value = response.data.data;
};

const fetchCourseDetails = async () => {
    const courseResponse = await $axios.get(`/courses/${courseId}?include=events`);
    course.value = courseResponse.data.data;
    populatePayload(course.value);
    links[2].label = course.value.title;
};

const fetchCategories = async () => {
    const categoriesResponse = await $axios.get('/course-categories');
    categories.value = categoriesResponse.data.data.map(item => ({
        label: item.name,
        value: item.id,
    }));
};


const fetchCalendarCategories = () => {

    $axios.get('/calendar-categories?per_page=100')
        .then(response => {
            CalendarCagegories.value = response.data.data.map(item => ({
                label: item.name,
                value: item.id,
            }))
        })
};


const populatePayload = (courseData) => {
    Object.assign(payload, {
        id: courseData.id,
        title: courseData.title,
        subtitle: courseData.subtitle,
        number: courseData.number,
        course_category_id: courseData.course_category_id,
        parent_id: courseData.parent_id,
        is_overnight_stay_available: courseData.is_overnight_stay_available,
        created_by: courseData.created_by,
        updated_by: $cookies.get('auth_user_id') || 0,
        max_number: courseData.max_number,
        has_single_event: courseData.has_single_event,
        contents: courseData.contents,
        goals: courseData.goals,
        teaser: courseData.teaser,
        target_group: courseData.target_group,
        cost_information: courseData.cost_information,
        notes: courseData.notes,
    });
};

// Lifecycle Hooks
onMounted(async () => {
    try {

        loading.value = true;

        await Promise.all([fetchCourses(), fetchCourseDetails(), fetchCategories()]);

        fetchCalendarCategories();


    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        loading.value = false;
    }
});

// Update Course Function
const updateCourse = async (callback) => {
    try {
        updateLoading.value = true;
        const response = await $axios.put(`/courses/${course.value.id}`, payload);
        course.value = { ...response.data.data, events: course.value.events };
        links[2].label = course.value.title;
        toast.add({ title: 'Course updated successfully' });
        callback?.();
    } catch (error) {
        toast.add({ title: `Update failed: ${error.message}` })
    } finally {
        updateLoading.value = false;
    }
};


</script>

<template>
    <div class="space-y-4">

        <UBreadcrumb :links="links" :ui="{ ol: 'gap-x-3', li: 'gap-x-3' }">
            <template #divider>
                <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </template>
        </UBreadcrumb>

        <create-event v-model="isOpenEventModal" :categories="CalendarCagegories" />

        <TableSkeleton v-if="loading == true" />

        <div v-if="course" class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <UCard v-if="course" class="w-full bg-white dark:bg-gray-800">
                <h4 class="text-sm font-medium text-teal-600 mb-2 uppercase">Course</h4>
                <hr class="w-full dark:border-gray-700/90">
                <h1 class="text-lg font-bold uppercase text-blue-500 my-3">{{ course.title }}</h1>


                <!-- Master data -->
                <h6 class="text-xs font-semibold text-blue-600 uppercase mb-2">Master Data</h6>
                <hr class="w-full dark:border-gray-700/90">

                <table class="w-full mb-8">

                    <tr>
                        <th class="th">Title</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="popovers.title" :popper="{ arrow: true }">
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
                                                    popovers.title = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="popovers.title = false"
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
                                <UPopover v-model:open="popovers.subtitle" :popper="{ arrow: true }">
                                    <span @click="payload.subtitle = course.subtitle" variant="none" :class="{
                                        'text-gray-400': !course.subtitle
                                    }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                        course.subtitle || 'Subtitle'
                                        }}</span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Subtitle</h1>
                                        <div class="min-w-[250px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="payload.subtitle"
                                                type="search" />
                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    popovers.subtitle = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="popovers.subtitle = false"
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
                                <UPopover v-model:open="popovers.shorthandSymbol" :popper="{ arrow: true }"
                                    @click="payload.number = course.number">

                                    <span color="white" variant="none" :class="{
                                        'text-gray-400': !course.number
                                    }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                        course.number || 'Shorthand symbol'
                                    }}</span>

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
                                                    popovers.shorthandSymbol = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="popovers.shorthandSymbol = false"
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
                                <UPopover v-model:open="popovers.category" :popper="{ arrow: true }">
                                    <span color="white" variant="none" :class="{
                                        'text-gray-400': !course.course_category_id
                                    }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                        selectedCategory || 'course category'
                                        }}</span>

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
                                                    :value="category.value">{{ category.label }}</option>
                                            </select>


                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    popovers.category = false
                                                })" :loading="updateLoading" />


                                            <UButton class="rounded-sm" @click="popovers.category = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td class="py-4"></td>
                        <td></td>
                    </tr>

                    <tr>
                        <th class="th">Parent Course</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="popovers.course" :popper="{ arrow: true }">
                                    <span color="white" variant="none" :class="{
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
                                                    popovers.course = false
                                                })" :loading="updateLoading" />


                                            <UButton class="rounded-sm" @click="popovers.course = false"
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



                <!-- Seminar content and goals -->
                <h6 class="text-xs font-semibold text-blue-600 uppercase mb-2">Seminar content & Goals</h6>
                <hr class="w-full dark:border-gray-700/90">

                <table class="w-full mb-8">
                    <tr>
                        <th class="th">Seminar contents</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="popovers.content" :popper="{ arrow: true }">
                                    <span color="white" variant="none"
                                        class="inline cursor-pointer font-semibold text-wrap">
                                        <span v-html="course.contents"></span>
                                        <span v-if="!course.contents" class="text-gray-400  hover:text-blue-500">Seminar
                                            Content</span>
                                    </span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Seminar contents
                                        </h1>
                                        <div
                                            class="min-w-[350px] md:min-w-[550px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">

                                            <UInput class="flex-1" color="blue" v-model="payload.contents" />

                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    popovers.content = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="popovers.content = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="th">Goals</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="popovers.goals" :popper="{ arrow: true }">
                                    <span color="white" variant="none" @click="payload.goals = course.goals" :class="{
                                        'text-gray-400': !course.goals
                                    }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                        course.goals || 'Goals'
                                        }}</span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Goals</h1>
                                        <div class="min-w-[250px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="payload.goals" type="search" />
                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    popovers.goals = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="popovers.goals = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <th class="th">Teaser</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="popovers.teaser" :popper="{ arrow: true }">
                                    <span color="white" variant="none" @click="payload.teaser = course.teaser" :class="{
                                        'text-gray-400': !course.teaser
                                    }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                        course.teaser || 'Teaser'
                                    }}</span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Teaser
                                        </h1>
                                        <div class="min-w-[250px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="payload.teaser"
                                                type="search" />
                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    popovers.teaser = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="popovers.teaser = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <th class="th">Target group</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="popovers.targetGroup" :popper="{ arrow: true }">
                                    <span color="white" variant="none"
                                        @click="payload.target_group = course.target_group" :class="{
                                            'text-gray-400': !course.target_group
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                            course.target_group || 'Target group'
                                        }}</span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Target group
                                        </h1>
                                        <div class="min-w-[250px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">


                                            <UInput color="blue" v-model="payload.target_group" class="flex-1" />


                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    popovers.targetGroup = false
                                                })" :loading="updateLoading" />


                                            <UButton class="rounded-sm" @click="popovers.targetGroup = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>

                </table>




                <!-- Notes and Cost -->
                <h6 class="text-xs font-semibold text-blue-600 uppercase mb-2">Notes</h6>
                <hr class="w-full dark:border-gray-700/90">

                <table class="w-full mb-8">
                    <tr>
                        <th class="th">Notes</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="popovers.note" :popper="{ arrow: true }">
                                    <span color="white" variant="none" @click="payload.notes = course.notes"
                                        class="inline cursor-pointer font-semibold text-wrap">
                                        <span v-html="course.notes"></span>
                                        <span v-if="!course.notes"
                                            class="text-gray-400  hover:text-blue-500">Notes</span>
                                    </span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Note
                                        </h1>
                                        <div
                                            class="min-w-[350px] md:min-w-[550px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">

                                            <UInput class="flex-1" color="blue" v-model="payload.notes" />

                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    popovers.note = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="popovers.note = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="th">Cost Information</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="popovers.cost" :popper="{ arrow: true }">

                                    <span color="white" variant="none"
                                        @click="payload.cost_information = course.cost_information" :class="{
                                            'text-gray-400': !course.cost_information
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                            course.cost_information || 'Cost Information'
                                        }}</span>

                                    <template #panel>
                                        <h1
                                            class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                            Cost Information</h1>
                                        <div class="min-w-[350px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                            <UInput class="flex-1" color="blue" v-model="payload.cost_information"
                                                type="search" />
                                            <UButton class="rounded-sm" icon="i-heroicons-check" size="sm" color="blue"
                                                square variant="solid" @click="updateCourse(function () {
                                                    popovers.cost = false
                                                })" :loading="updateLoading" />

                                            <UButton class="rounded-sm" @click="popovers.cost = false"
                                                icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                variant="solid" />
                                        </div>
                                    </template>

                                </UPopover>
                            </div>
                        </td>
                    </tr>

                </table>





            </UCard>
            <UCard v-if="course" class="w-full  bg-white dark:bg-gray-800">
                <h4 class="text-sm font-medium text-teal-600 mb-2 uppercase">Events ({{ course.events.length }})</h4>

                <div v-if="course && course.events" class="w-full overflow-x-auto">
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

                                        <nuxt-link :to="'/events/' + event.id" title="Show">
                                            <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                                name="i-heroicons-arrow-top-right-on-square" />
                                        </nuxt-link>

                                        <UIcon title="Duplicate" class="text-xl font-bold text-blue-600 cursor-pointer"
                                            name="i-heroicons-square-2-stack" />

                                        <UIcon title="Delete" class="text-lg font-bold text-blue-600 cursor-pointer"
                                            name="i-heroicons-trash" />
                                    </div>
                                </td>
                                <td class="event-td min-w-[10rem]">
                                    <nuxt-link :to="'/events/' + event.id" title="Show">
                                        <span
                                            class="text-xs font-semibold text-blue-700 [word-spacing:0.1em] leading-5">{{
                                                event.title }}</span>
                                    </nuxt-link>

                                </td>
                                <td class="event-td">
                                    {{ event.location }}
                                </td>
                                <td class="event-td">{{ event.extra_person }}</td>
                                <td class="event-td min-w-[6rem]">{{ dayjs(event.start_time).format('DD-MM-YYYY HH:mm')
                                    }}</td>
                                <td class="event-td min-w-[6rem]">{{ dayjs(event.end_time).format('DD-MM-YYYY HH:mm') }}
                                </td>
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
                    <UButton @click="isOpenEventModal = true" icon="i-heroicons-plus" size="sm" color="blue"
                        variant="solid" label="Create" :trailing="false" />
                </div>
            </UCard>
        </div>

        <div class="w-full" v-if="!course && !loading">
            <UCard class="w-full flex items-center justify-center h-[20rem] bg-white dark:bg-gray-800">
                <h1 class="text-4xl font-bold text-gray-600 dark:text-gray-300 text-center">Course Not Found!!</h1>
            </UCard>
        </div>

    </div>
</template>

<style scoped>
.th {
    @apply text-left text-sm text-wrap w-[35%] font-semibold text-gray-600 dark:text-gray-300 px-4 py-1;
}

.td {
    @apply text-left text-sm font-normal text-gray-600 dark:text-gray-300 px-4 py-1;
}

.event-th {
    @apply border-t border-t-gray-200 dark:border-t-gray-700/90 p-2 text-sm font-medium text-gray-600 dark:text-gray-300 capitalize;
}

.event-td {
    @apply border-t border-t-gray-200 dark:border-t-gray-700/90 p-2 text-xs font-normal text-gray-600 dark:text-gray-300;
}
</style>
