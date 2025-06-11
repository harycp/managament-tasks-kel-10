<template>
  <div
    class="w-72 bg-white border border-gray-200 rounded-xl shadow-sm flex-shrink-0 flex flex-col max-h-full"
  >
    <div
      class="px-4 pt-3 pb-2 border-b border-gray-100 flex justify-between items-center"
    >
      <h3 class="text-sm font-medium text-gray-800 truncate">
        {{ list.name }}
      </h3>
      <button class="text-gray-400 hover:text-gray-600 text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-4 py-2">
      <div
        v-if="!list.tasks || list.tasks.length === 0"
        class="text-center text-sm text-gray-400 italic py-6"
      >
        No tasks yet
      </div>
      <!-- Task cards would go here -->
    </div>

    <button
      class="mt-auto text-sm text-gray-500 hover:text-gray-600 px-4 py-2 text-left transition"
    >
      + Add a card
    </button>
  </div>
</template>

<script>
export default {
  name: "List",
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
};
</script>
