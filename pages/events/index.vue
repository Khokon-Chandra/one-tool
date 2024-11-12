<template>
    <div>
      <!-- Display Data -->
      <p ref="nameField" @click="showEditor('name', $refs.nameField)" class="cursor-pointer">
        Name: {{ data.name }}
      </p>
      <p ref="emailField" @click="showEditor('email', $refs.emailField)" class="cursor-pointer">
        Email: {{ data.email }}
      </p>
      <p ref="addressField" @click="showEditor('address', $refs.addressField)" class="cursor-pointer">
        Address: {{ data.address }}
      </p>
  
      <!-- Tooltip-Style Inline Modal for Editing -->
      <div
        v-if="editingField"
        class="absolute bg-white p-4 rounded shadow-lg border max-w-xs w-full"
        :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      >
        <label :for="editingField" class="text-sm font-medium">
          Edit {{ editingField }}
        </label>
        <input
          :id="editingField"
          type="text"
          v-model="editingValue"
          class="mt-2 p-2 border rounded w-full"
          @keyup.enter="saveEdit"
          autofocus
        />
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="saveEdit" class="bg-blue-500 text-white px-4 py-1 rounded">Save</button>
          <button @click="cancelEdit" class="bg-gray-300 text-gray-700 px-4 py-1 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue';

  definePageMeta({
    layout:'auth'
  })
  
  const data = ref({
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Street Name, City, Country'
  });
  
  const editingField = ref(null);
  const editingValue = ref('');
  const position = ref({ top: 0, left: 0 });
  
  const showEditor = (field, elementRef) => {
    editingField.value = field;
    editingValue.value = data.value[field];
    nextTick(() => {
      const { top, left, height } = elementRef.getBoundingClientRect();
      position.value = { top: top + height + window.scrollY, left: left + window.scrollX };
    });
  };
  
  const saveEdit = () => {
    if (editingField.value) {
      data.value[editingField.value] = editingValue.value;
      editingField.value = null;
    }
  };
  
  const cancelEdit = () => {
    editingField.value = null;
  };
  </script>
  
  <style scoped>
  .absolute {
    position: absolute;
  }
  </style>
  