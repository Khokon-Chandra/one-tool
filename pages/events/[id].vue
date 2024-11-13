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

const event = ref([]);

const categories = ref([]);

const eventList = ref([]);

const loading = ref(true);

const updateLoading = ref(false);

const page = ref(1);

const eventId = useRoute().params.id


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

        const eventResponse = await $axios.get("/calendar-events/" + eventId + "?include=category");
        
        const categoriesResponse = await $axios.get('/course-categories');

        event.value = eventResponse.data.data;

        categories.value = categoriesResponse.data.data.map((item) => {
            return { name: item.name, value: item.id }
        });

        loading.value = false;

        links[2].label = event.value.title;

        /**
         * Update event form attribute
         */
        payload.id = event.value.id;
        payload.title = event.value.title;
        payload.subtitle = event.value.subtitle;
        payload.is_overnight_stay_available = event.value.is_overnight_stay_available;
        payload.created_by = event.value.created_by;
        payload.max_number = event.value.max_number;
        payload.has_single_event = event.value.has_single_event;
        payload.updated_by = $cookies.get('auth_user_id') || 0;
        payload.has_single_event = event.value.has_single_event;

    } catch (error) {
        toast.add({ title: error.message });
        loading.value = false;
    }
});

const selectedCategory = computed(() => {
    if (!event.value.course_category_id) {
        return false
    }
    return categories.value.filter((item) => {
        return item.value == event.value.course_category_id
    }).at(-1).name;

});


const parentCourseName = computed(() => {
    if (!event.value.parent_id) {
        return false
    }
    return courseList.value.filter((item) => {
        return item.id == event.value.parent_id
    }).at(-1).title;

});


const updateCourse = async (callback) => {

    try {

        updateLoading.value = true;

        const response = await $axios.put('/courses/' + event.value.id, payload);

        const data = response.data.data;

        event.value = data;

        links[2].label = event.value.title;

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
                <h4 class="text-sm font-medium text-teal-600 mb-2 uppercase">Event Details</h4>
                <hr class="w-full dark:border-gray-700/90">
                <h1 class="text-lg font-bold uppercase text-blue-500 my-3">{{ event.title }}</h1>


                <!-- Master data -->
                <h6 class="text-xs font-semibold text-blue-600 uppercase mb-2">Master Data</h6>
                <hr class="w-full dark:border-gray-700/90">

                <table class="w-full mb-8">
                    <tr>
                        <th class="th">Title</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openTitle" :popper="{ arrow: true }">
                                    <span color="white" variant="none" @click="payload.title = event.title"
                                        class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                            event.title
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
                                    <span color="white" variant="none" @click="payload.subtitle = event.subtitle"
                                        :class="{
                                            'text-gray-400': !event.subtitle
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                            event.subtitle || 'Subtitle'
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
                                    <span color="white" variant="none" @click="payload.number = event.number" :class="{
                                        'text-gray-400': !event.number
                                    }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                        event.number || 'Shorthand symbol'
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
                        <td class="td">{{ event.max_number }}</td>
                    </tr>

                    <tr>
                        <th class="th">Course Category</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openCategory" :popper="{ arrow: true }">
                                    <span color="white" variant="none"
                                        @click="payload.course_category_id = event.course_category_id" :class="{
                                            'text-gray-400': !event.course_category_id
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold">{{
                                            selectedCategory || 'event category'
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
                        <td class="py-4"></td>
                        <td></td>
                    </tr>

                    <tr>
                        <th class="th">Parent Course</th>
                        <td class="td">
                            <div class="inline-block">
                                <UPopover v-model:open="openCourse" :popper="{ arrow: true }">
                                    <span color="white" variant="none" @click="payload.parent_id = event.parent_id"
                                        :class="{
                                            'text-gray-400': !event.parent_id
                                        }" class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                            parentCourseName || 'Parent event'
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
                        <td class="td">{{ event.id }}</td>
                    </tr>

                    <tr>
                        <th class="th">Creation Date</th>
                        <td class="td">{{ dayjs(event.created_at).format('DD-MM-YYYY HH:mm') }}</td>
                    </tr>

                </table>



                <!-- Seminar content and goals -->
                <h6 class="text-xs font-semibold text-blue-600 uppercase mb-2">Seminar content & Goals</h6>
                <hr class="w-full dark:border-gray-700/90">

                <div class="h-48 flex items-center justify-center">
                    <h5 class="text-teal-400 text-xl font-semibold capitalize">Comming Soon</h5>
                </div>





            </UCard>
        </div>

    </div>
</template>

<style scoped>
.th {
    @apply text-left text-sm text-wrap w-[35%] font-semibold text-gray-600 dark:text-gray-300 px-4 py-1;
}

.td {
    @apply text-left text-sm font-medium text-gray-600 dark:text-gray-300 px-4 py-1;
}
</style>
