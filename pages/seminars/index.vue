<script setup>
import dayjs from 'dayjs';

definePageMeta({
    middleware: "auth",
    layout: "auth",
});

useHead({
    titleTemplate: '%s - Seminars'
})

const { $axios } = useNuxtApp();

const toast = useToast();

const courses = ref(null);

const loading = ref(true);


const isOpenColumn = ref(false);

const showEvent = ref(null);

const selectedItems = ref([])

const activeTab = ref('all');

const perPage = ref(15);

const page = ref(1);

const courseParams = ref({
    per_page: 15,
    page: 1,
    include: 'events',
})

const isAllSelected = computed(() => {
    if (courses.value && courses.value.data.length === selectedItems.value.length) {
        return true;
    }
    return false;
})



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

const exportLinks = [
    [
        {
            label: 'Excel',
            icon: 'i-heroicons-document-check',
        },
        {
            label: 'Pdf',
            icon: 'i-heroicons-document-text'
        }
    ]
]

const editLinks = [
    [
        {
            label: 'Active',
            icon: 'i-heroicons-check-circle',
        },
        {
            label: 'Deactive',
            icon: 'i-heroicons-x-circle'
        }
    ]
]

const columns = useLocalStorage('columns', reactive([
    { label: 'title', status: true },
    { label: 'subtitle', status: true },
    { label: 'events', status: true },
    { label: 'abbreviation', status: false },
    { label: 'seminar category', status: false },
    { label: 'location', status: false },
    { label: 'next event', status: false },
    { label: 'start date', status: true },
    { label: 'end date', status: true },
    { label: 'participant', status: true },
    { label: 'participants next event', status: false },
    { label: 'waiting list participants next event', status: false },
    { label: 'waiting list', status: false },
    { label: 'last modified from-to', status: false },
    { label: 'status', status: false },
    { label: 'active', status: true },
]));

const fetchCourses = async () => {
    try {
        loading.value = true;
        const response = await $axios.get("/courses", {
            params: courseParams.value
        });
        courses.value = response.data;
    } catch (error) {
        toast.add({ title: "Course fetch faild!", message: error.message });

    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await fetchCourses();
});


const toggleEvent = (courseId) => {
    if (showEvent.value == courseId) {
        showEvent.value = null
    } else {
        showEvent.value = courseId
    }
}


// Method to toggle individual item selection
function toggleSelectItem(itemId) {
    const index = selectedItems.value.indexOf(itemId)
    if (index === -1) {
        selectedItems.value.push(itemId)
    } else {
        selectedItems.value.splice(index, 1)
    }
}


// Method to toggle "Select All" functionality
function toggleSelectAll() {
    if (isAllSelected.value) {
        selectedItems.value = []
    } else {
        selectedItems.value = courses.value.data.map(item => item.id)
    }
}

</script>

<template>

    <NuxtLayout>
        <template #default>
            <div class="space-y-6">

                <CourseColumnModal v-model="isOpenColumn" :options="columns" />

                <UBreadcrumb :links="links" :ui="{ ol: 'gap-x-3', li: 'gap-x-3' }">
                    <template #divider>
                        <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    </template>
                </UBreadcrumb>


                <div v-show="0" class="flex items-center">

                    <button @click="activeTab = 'all'" :class="{
                        'border-blue-500 text-blue-500': activeTab == 'all',
                        'border-b-gray-200 dark:border-gray-800 text-gray-500': activeTab !== 'all'
                    }" class="px-6 py-1 text-sm font-medium border-b-2 hover:bg-gray-600/10">All</button>


                    <button @click="activeTab = 'meine'" :class="{
                        'border-blue-500 text-blue-500': activeTab == 'meine',
                        'border-b-gray-200 dark:border-gray-800 text-gray-500': activeTab !== 'meine'
                    }" class="px-6 py-1 text-sm font-medium border-b-2 hover:bg-gray-600/10">Meine</button>


                    <button @click="activeTab = 'shorts'" :class="{
                        'border-blue-500 text-blue-500': activeTab == 'shorts',
                        'border-b-gray-200 dark:border-gray-800 text-gray-500': activeTab !== 'shorts'
                    }" class="px-6 py-1 text-sm font-medium border-b-2 hover:bg-gray-600/10">Shorts</button>


                </div>


                <div class="flex justify-between items-center">
                    <UButton icon="i-heroicons-bars-2" size="sm" color="gray" variant="solid" label="Filter"
                        :trailing="false" />



                    <div class="flex items-center gap-4">
                        <UInput type="search" icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="blue"
                            trailing placeholder="Search..." />

                        <UButton @click="isOpenColumn = true" color="gray">Columns</UButton>

                        <UButton color="blue" variant="solid">New Course</UButton>
                    </div>
                </div>


                <TableSkeleton v-if="loading" />


                <div v-if="courses && !loading"
                    class="bg-white dark:bg-gray-800 shadow-sm rounded-md border border-gray-200 dark:border-gray-700/90 w-full overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr>
                                <th class="th">
                                    <UCheckbox color="blue" @change="toggleSelectAll" :model-value="isAllSelected"
                                        :indeterminate="selectedItems.length && selectedItems.length < courses.data.length" />
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
                                        <UCheckbox color="blue" :model-value="selectedItems.includes(course.id)"
                                            @change="toggleSelectItem(course.id)" />
                                    </td>
                                    <td class="td">
                                        <div class="flex gap-6 items-center">
                                            <UIcon @click="toggleEvent(course.id)"
                                                class="text-xl font-bold text-blue-600 cursor-pointer"
                                                :name="showEvent == course.id ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
                                            <nuxt-link :to="'seminars/' + course.id" title="show">
                                                <UIcon class="text-xl font-bold text-blue-600 cursor-pointer"
                                                    name="i-heroicons-arrow-top-right-on-square" />
                                            </nuxt-link>
                                            <UIcon title="Duplicate"
                                                class="text-xl font-bold text-blue-600 cursor-pointer"
                                                name="i-heroicons-square-2-stack" />
                                            <UIcon title="Download Pdf"
                                                class="text-xl font-bold text-blue-600 cursor-pointer"
                                                name="i-heroicons-document-check" />
                                            <UIcon title="Delete" class="text-xl font-bold text-blue-600 cursor-pointer"
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
                                            <nuxt-link v-for="event in course.events" :key="event.id"
                                                title="Event details" :to="`/events/${event.id}`">
                                                <UIcon class="text-lg font-semibold text-blue-500"
                                                    name="i-heroicons-calendar-days" />
                                            </nuxt-link>
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
                                                            <span class="text-xs font-medium text-blue-500">{{
                                                                event.title
                                                                }}</span>
                                                        </nuxt-link>
                                                    </td>
                                                    <td class="td">{{ event.city }}</td>
                                                    <td class="td">{{ dayjs(event.start_time).format('DD.MM.YYYY HH:mm')
                                                        }}</td>
                                                    <td class="td">{{ dayjs(event.end_time).format('DD.MM.YYYY HH:mm')
                                                        }}</td>
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



            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-between w-full">


                <div class="flex gap-2 items-center">
                    <USelect color="gray" v-model="courseParams.per_page" @change="fetchCourses"
                        :options="[15, 20, 30, 50, 100, 250, 500, 1000]" />
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Results per page of {{ page }}
                    </span>
                </div>


                <div v-if="courses && courses.meta" class="flex justify-end">
                    <UPagination :active-button="{ color: 'blue', variant: 'outline' }" variant="none"
                        v-model="courseParams.page" :page-count="5" :total="courses.meta.total" />
                </div>


                <div class="flex gap-4 items-center">

                    <UDropdown :items="exportLinks" :popper="{ offsetDistance: 0, placement: 'top' }">
                        <UButton size="md" color="gray" label="Exports"
                            trailing-icon="i-heroicons-chevron-down-20-solid" />
                    </UDropdown>

                    <UDropdown :items="editLinks" :popper="{ offsetDistance: 0, placement: 'top' }">
                        <UButton size="md" color="gray" label="Edit"
                            trailing-icon="i-heroicons-chevron-down-20-solid" />
                    </UDropdown>

                </div>


            </div>
        </template>
    </NuxtLayout>

</template>


<style scoped>
.th {
    @apply px-4 py-2 text-left text-sm font-medium border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 uppercase;
}

.td {
    @apply px-4 py-2 text-left text-sm font-normal text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700;
}
</style>
