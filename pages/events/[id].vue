<script setup>
import dayjs from 'dayjs';

definePageMeta({
    middleware: "auth",
    layout: "auth",
});

useHead({
    titleTemplate: '%s - Event Details'
})


const { $axios, $cookies } = useNuxtApp();

const toast = useToast();

const event = ref(null);

const eventList = ref(null);

const categories = ref([]);

const loading = ref(true);

const updateLoading = ref(false);

const eventId = useRoute().params.id

/**
 * form submition payload data to update event
 */
const payload = reactive({
    id: '',
    title: '',
    calendar_categories_id: '',
    start_time: '',
    end_time: '',
    created_by: '',
    updated_by: 0,
    is_all_day: false,
    duration: '',
    contact_id: '',
    credits: '',
    organizer: '',
    parent_id: '',
    creation_time: '',
});


/**
 * Popover constants
 */
const popovers = ref({
    title: false,
    category: false,
    startDate: false,
    endDate: false,
    contactPerson: false,
    duration: false,
    credits: false,
    parentEvent: false,
    organizer: false,
    referee: false,
    rooms: false,
    street: false,
})


// Breadcumbar links 
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

const collapse = ref({
    master: true,
    event: true,
    note: true,
    placeholder: true,
})



const fetchSingleEvent = async () => {
    const response = await $axios.get("/calendar-events/" + eventId + "?include=category,user");
    event.value = response.data.data;
    populatePayload(event.value);
}

const fetchEventList = async () => {
    const response = await $axios.get("/calendar-events?per_page=100");
    eventList.value = response.data.data.map((item) => {
        return { name: item.title, value: item.id }
    });
}

const fetchCategories = async () => {
    const response = await $axios.get('/calendar-categories')
    categories.value = response.data.data.map((item) => {
        return { name: item.name, value: item.id }
    });
}

onMounted(async () => {
    try {

        await Promise.all([
            fetchSingleEvent(),
            fetchEventList(),
            fetchCategories()
        ]);

        links[2].label = event.value.title;

    } catch (error) {
        toast.add({ title: error.message, color: 'red' });
    } finally {
        loading.value = false;
    }
});


const populatePayload = (eventData) => {

    Object.assign(payload, {
        id: eventData.id,
        title: eventData.title,
        calendar_categories_id: eventData.calendar_categories_id,
        updated_by: $cookies.get('auth_user_id') || 0,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        creation_time: eventData.creation_time,
        credits: eventData.credits,
        is_all_day: eventData.is_all_day,
        duration: eventData.duration,
        contact_id: eventData.contact_id,
        parent_id: eventData.parent_id,
        organizer: eventData.organizer
    })

}


const updateEvent = async (callback) => {

    try {

        updateLoading.value = true;

        const response = await $axios.put('/calendar-events/' + eventId, payload);

        await fetchSingleEvent();

        links[2].label = event.value.title;

        callback?.();

    } catch (error) {

        useToast().add({
            title: "Event not updated!",
            description: error.message
        })

    } finally {
        updateLoading.value = false;
    }
}


</script>

<template>
    <NuxtLayout>
        <div class="space-y-4">

            <UBreadcrumb :links="links" :ui="{ ol: 'gap-x-3', li: 'gap-x-3' }">
                <template #divider>
                    <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                </template>
            </UBreadcrumb>

            <TableSkeleton v-if="loading == true" />

            <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <UCard class="w-full bg-white dark:bg-gray-800 col-span-2">

                    <h4 class="text-sm font-medium text-teal-600 mb-2 uppercase">Event Details</h4>
                    <hr class="w-full dark:border-gray-700/90">
                    <h1 class="text-lg font-bold uppercase text-blue-500 my-3">{{ event.title }}</h1>


                    <!-- Master data -->
                    <div class="flex items-center justify-between py-3">
                        <h6 class="text-xs font-semibold text-blue-600 uppercase">Master Data</h6>
                        <UIcon class="text-lg cursor-pointer"
                            :name="collapse.master ? 'i-heroicons-chevron-up-solid' : 'i-heroicons-chevron-down-solid'"
                            @click="collapse.master = !collapse.master" />
                    </div>
                    <hr class="w-full dark:border-gray-700/90">

                    <table v-show="collapse.master" class="w-full mb-8">
                        <tbody>
                            <tr>
                                <th class="th">Title</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.title" :popper="{ arrow: true }">
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
                                                    <UInput class="flex-1" color="blue" v-model="payload.title"
                                                        type="search" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
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
                                <th class="th">Categories</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.category" :popper="{ arrow: true }">
                                            <span color="white" variant="none"
                                                @click="payload.calendar_categories_id = event.calendar_categories_id"
                                                :class="{ 'text-gray-400 border-b border-dotted italic': !event.calendar_categories_id }"
                                                class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                                    event.category?.name || 'category' }}</span>

                                            <template #panel>
                                                <h1
                                                    class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                                    Title</h1>
                                                <div
                                                    class="min-w-[350px] md:min-w-[550px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                                    <USelect class="flex-1" color="blue"
                                                        v-model="payload.calendar_categories_id" :options="categories"
                                                        option-attribute="name" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
                                                            popovers.category = false
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
                                <th class="th">Start Date</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.startDate" :popper="{ arrow: true }">
                                            <span color="white" variant="none"
                                                @click="payload.start_time = event.start_time"
                                                class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                                    dayjs(event.start_time).format('DD. MM. YYYY HH:mm')
                                                }}</span>

                                            <template #panel>
                                                <h1
                                                    class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                                    Start Date</h1>
                                                <div
                                                    class="min-w-[250px] md:min-w-[350px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">

                                                    <UInput type="date" class="flex-1" color="blue"
                                                        v-model="payload.start_time" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
                                                            popovers.startDate = false
                                                        })" :loading="updateLoading" />

                                                    <UButton class="rounded-sm" @click=" popovers.startDate = false"
                                                        icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                        variant="solid" />
                                                </div>
                                            </template>

                                        </UPopover>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th class="th">End Date</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.endDate" :popper="{ arrow: true }">
                                            <span color="white" variant="none"
                                                @click="payload.end_time = dayjs(event.end_time).format('d/MM/YYYY')"
                                                class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                                    dayjs(event.end_time).format('DD. MM. YYYY HH:mm')
                                                }}</span>

                                            <template #panel>
                                                <h1
                                                    class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                                    End Date</h1>
                                                <div
                                                    class="min-w-[250px] md:min-w-[350px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">

                                                    <UInput type="date" class="flex-1" color="blue"
                                                        v-model="payload.end_time" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
                                                            popovers.endDate = false
                                                        })" :loading="updateLoading" />

                                                    <UButton class="rounded-sm" @click=" popovers.endDate = false"
                                                        icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                        variant="solid" />
                                                </div>
                                            </template>

                                        </UPopover>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th class="th">Contact persons</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.contactPerson" :popper="{ arrow: true }">
                                            <span color="white" variant="none"
                                                @click="payload.contact_id = event.contact_id"
                                                :class="{ 'text-gray-400 border-b border-dotted italic': !event.contact_id }"
                                                class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                                    event.contact_id || 'Contact persons'
                                                }}</span>

                                            <template #panel>
                                                <h1
                                                    class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                                    Contact persons</h1>
                                                <div
                                                    class="min-w-[250px] md:min-w-[350px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">

                                                    <UInput type="text" class="flex-1" color="blue"
                                                        v-model="payload.contact_id" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
                                                            popovers.contactPerson = false
                                                        })" :loading="updateLoading" />

                                                    <UButton class="rounded-sm" @click=" popovers.contactPerson = false"
                                                        icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                        variant="solid" />
                                                </div>
                                            </template>

                                        </UPopover>
                                    </div>
                                </td>
                            </tr>


                            <tr>
                                <th class="th">Duration (Days)</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.duration" :popper="{ arrow: true }">
                                            <span color="white" variant="none"
                                                @click="payload.duration = event.duration"
                                                :class="{ 'text-gray-400 border-b border-dotted italic': !event.duration }"
                                                class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                                    event.duration || 'Duration (Days)'
                                                }}</span>

                                            <template #panel>
                                                <h1
                                                    class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                                    Duration (Days)</h1>
                                                <div
                                                    class="min-w-[250px] md:min-w-[450px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">

                                                    <UInput type="text" class="flex-1" color="blue"
                                                        v-model="payload.duration" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
                                                            popovers.duration = false
                                                        })" :loading="updateLoading" />

                                                    <UButton class="rounded-sm" @click=" popovers.duration = false"
                                                        icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                        variant="solid" />
                                                </div>
                                            </template>

                                        </UPopover>
                                    </div>
                                </td>
                            </tr>


                            <tr>
                                <th class="th">Credits</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.credits" :popper="{ arrow: true }">
                                            <span color="white" variant="none" @click="payload.credits = event.credits"
                                                :class="{ 'text-gray-400 border-b border-dotted italic': !event.credits }"
                                                class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                                    event.credits || 'Credits'
                                                }}</span>

                                            <template #panel>
                                                <h1
                                                    class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                                    Credits</h1>
                                                <div
                                                    class="min-w-[250px] md:min-w-[450px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">

                                                    <UInput type="text" class="flex-1" color="blue"
                                                        v-model="payload.credits" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
                                                            popovers.credits = false
                                                        })" :loading="updateLoading" />

                                                    <UButton class="rounded-sm" @click=" popovers.credits = false"
                                                        icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                        variant="solid" />
                                                </div>
                                            </template>

                                        </UPopover>
                                    </div>
                                </td>
                            </tr>


                            <tr>
                                <th class="py-4"></th>
                                <th></th>
                            </tr>

                            <tr>
                                <th class="th">All Day</th>
                                <td class="td">
                                    <UToggle color="blue" v-model="payload.is_all_day" @click="(() => {
                                        payload.is_all_day = !event.is_all_day
                                        updateEvent();
                                    })()" />
                                </td>
                            </tr>



                            <tr>
                                <th class="th">Parent Event</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.parentEvent" :popper="{ arrow: true }">
                                            <span color="white" variant="none"
                                                @click="payload.parent_id = event.parent_id"
                                                :class="{ 'text-gray-400 border-b border-dotted italic': !event.parent_id }"
                                                class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">
                                                {{ eventList.filter(item => item.value == event.parent_id).at(-1)?.name
                                                    ||
                                                    "Parent event"
                                                }}
                                            </span>

                                            <template #panel>
                                                <h1
                                                    class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                                    Parent event</h1>
                                                <div
                                                    class="min-w-[250px] md:min-w-[450px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">

                                                    <USelect class="flex-1" v-model="payload.parent_id"
                                                        placeholder="Parent Category" :options="eventList"
                                                        option-attribute="name" color="blue" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
                                                            popovers.parentEvent = false
                                                        })" :loading="updateLoading" />

                                                    <UButton class="rounded-sm" @click=" popovers.parentEvent = false"
                                                        icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                        variant="solid" />
                                                </div>
                                            </template>

                                        </UPopover>
                                    </div>
                                </td>
                            </tr>


                            <tr>
                                <th class="th">ID</th>
                                <td class="td">{{ event.id }}</td>
                            </tr>

                            <tr>
                                <th class="th">Creation Date</th>
                                <td class="td">{{ dayjs(event.creation_time).format('DD-MM-YYYY HH:mm') }}</td>
                            </tr>

                            <tr>
                                <th class="th">Created by</th>
                                <td class="td">{{ event.user?.name }}</td>
                            </tr>

                        </tbody>

                    </table>



                    <!-- Seminar content and goals -->
                    <div class="flex items-center justify-between py-3">
                        <h6 class="text-xs font-semibold text-blue-600 uppercase">Event Details</h6>
                        <UIcon class="text-lg cursor-pointer"
                            :name="collapse.event ? 'i-heroicons-chevron-up-solid' : 'i-heroicons-chevron-down-solid'"
                            @click="collapse.event = !collapse.event" />
                    </div>
                    <hr class="w-full dark:border-gray-700/90">

                    <table v-show="collapse.event" class="w-full mb-8">
                        <tbody>
                            <tr>
                                <th class="th">Organizer</th>
                                <td class="td">
                                    <div class="inline-block">
                                        <UPopover v-model:open="popovers.organizer" :popper="{ arrow: true }">
                                            <span color="white" variant="none"
                                                @click="payload.organizer = event.organizer"
                                                :class="{ 'text-gray-400 border-b border-dotted italic': !event.organizer }"
                                                class="inline cursor-pointer hover:text-blue-500 font-semibold text-wrap">{{
                                                    event.organizer || 'Organizer'
                                                }}</span>

                                            <template #panel>
                                                <h1
                                                    class="font-meduim text-gray-600 dark:text-gray-300 p-2 border-b border-b-gray-200 dark:border-b-gray-700/90">
                                                    Organizer</h1>
                                                <div
                                                    class="min-w-[350px] md:min-w-[550px] p-4 bg-gray-50 dark:bg-gray-900/90 flex gap-1">
                                                    <UInput class="flex-1" color="blue" v-model="payload.organizer"
                                                        type="search" />

                                                    <UButton class="rounded-sm" icon="i-heroicons-check" size="sm"
                                                        color="blue" square variant="solid" @click="updateEvent(function () {
                                                            popovers.organizer = false
                                                        })" :loading="updateLoading" />

                                                    <UButton class="rounded-sm" @click="popovers.organizer = false"
                                                        icon="i-heroicons-x-mark" size="sm" color="gray" square
                                                        variant="solid" />
                                                </div>
                                            </template>

                                        </UPopover>
                                    </div>
                                </td>
                            </tr>

                        </tbody>

                    </table>

                </UCard>
            </div>

        </div>
    </NuxtLayout>
</template>

<style scoped>
.th {
    @apply text-left text-sm text-wrap w-[35%] font-semibold text-gray-600 dark:text-gray-300 px-4 py-1;
}

.td {
    @apply text-left text-sm font-medium text-gray-600 dark:text-gray-300 px-4 py-1;
}
</style>
