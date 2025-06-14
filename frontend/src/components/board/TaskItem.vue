<template>
  <div
    @click="openTaskDetail"
    class="task-item group bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm mb-2 cursor-pointer"
  >
    <div class="flex justify-between items-start">
      <button
        @click.stop="onComplete"
        class="w-5 h-5 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
      >
        <svg
          class="w-full h-full text-gray-400 hover:text-green-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z"
            ></path>
          </g>
        </svg>
      </button>

      <span class="text-sm text-gray-800 flex-1 mx-2">{{ task.name }}</span>
    </div>
    <div class="flex justify-end mt-4" v-if="assignee">
      <span class="text-sm text-gray-800 flex-1 mx-7">{{
        formatDate(task.due_date)
      }}</span>
      <div
        :title="assignee.name"
        class="w-6 h-6 rounded-full border-2 border-white bg-gray-500 text-white flex items-center justify-center font-semibold text-xs ring-1 ring-gray-300"
      >
        {{ assignee.name ? assignee.name.charAt(0).toUpperCase() : "?" }}
      </div>
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
    boardMembers: {
      type: Array,
      required: true,
    },
  },
  emits: ["complete", "open-task"],
  computed: {
    assignee() {
      if (!this.task.assignee_id || !this.boardMembers) {
        return null;
      }
      return this.boardMembers.find(
        (member) => member.id === this.task.assignee_id
      );
    },
  },
  methods: {
    onComplete() {
      this.$emit("complete", this.task.id);
    },
    openTaskDetail() {
      this.$emit("open-task", this.task);
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("id-ID", options);
    },
  },
};
</script>
