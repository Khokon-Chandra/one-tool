<script setup>
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["closeModal"])

const show = toRef(props, 'isOpen');

const isVisible = ref(false);

watch(show, (newValue, oldValue) => {
    if (isVisible.value == false) {
        isVisible.value = true;
        emit("closeModal")
    }
});


</script>

<template>
    <div>

        <UModal v-model="isVisible">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <Placeholder class="h-8" />
                </template>

                <Placeholder class="h-32" />

                <template #footer>
                    <Placeholder class="h-8" />
                </template>
            </UCard>
        </UModal>
    </div>
</template>
