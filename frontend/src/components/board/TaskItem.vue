<template>
  <div
    class="task-item group bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm mb-2 cursor-pointer"
  >
    <div class="flex justify-between items-start">
      <button
        @click.stop="onComplete"
        class="w-5 h-5 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
      >
        <svg
          class="w-full h-full text-gray-400 hover:text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </button>

      <span class="text-sm text-gray-800 flex-1 mx-2">{{ task.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskItem",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  emits: ["complete"],
  methods: {
    onComplete() {
      // Kirim event ke parent (List.vue) dengan ID task
      this.$emit("complete", this.task.id);
    },
  },
};
</script>
