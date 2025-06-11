<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen && task"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60"
      @click.self="close"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all flex flex-col max-h-[90vh]"
      >
        <div class="p-4 border-b">
          <input
            type="text"
            v-model="editableTask.name"
            class="text-xl font-bold w-full focus:outline-none bg-transparent"
          />
        </div>

        <div class="p-6 flex-1 overflow-y-auto space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-semibold text-gray-600 block mb-2"
                >Assignee</label
              >
              <select
                v-model="editableTask.assignee_id"
                class="w-full p-2 border border-gray-300 rounded-md"
              >
                <option :value="null">Unassigned</option>
                <option
                  v-for="member in boardMembers"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600 block mb-2"
                >Due Date</label
              >
              <input
                type="date"
                v-model="editableTask.due_date"
                class="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold text-gray-600 block mb-2"
              >Description</label
            >
            <RichTextEditor v-model="editableTask.description" />
          </div>
        </div>

        <div
          class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl"
        >
          <button
            @click="saveChanges"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            Save Changes
          </button>
          <button
            @click="close"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import RichTextEditor from "../common/RichTextEditor.vue";

export default {
  name: "TaskDetailModal",
  components: { RichTextEditor },
  props: {
    isOpen: Boolean,
    task: Object,
    boardMembers: Array,
  },
  emits: ["close", "update-task"],
  data() {
    return {
      editableTask: null,
    };
  },
  watch: {
    task: {
      handler(newTask) {
        if (newTask) {
          this.editableTask = {
            ...newTask,
            due_date: newTask.due_date
              ? new Date(newTask.due_date).toISOString().split("T")[0]
              : null,
          };
        } else {
          this.editableTask = null;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    saveChanges() {
      const payload = {};
      if (this.editableTask.name !== this.task.name)
        payload.name = this.editableTask.name;
      if (this.editableTask.description !== this.task.description)
        payload.description = this.editableTask.description;
      if (
        this.editableTask.due_date !==
        (this.task.due_date
          ? new Date(this.task.due_date).toISOString().split("T")[0]
          : null)
      )
        payload.due_date = this.editableTask.due_date;
      if (this.editableTask.assignee_id !== this.task.assignee_id)
        payload.assignee_id = this.editableTask.assignee_id;

      if (Object.keys(payload).length > 0) {
        this.$emit("update-task", { taskId: this.task.id, payload });
      }
      this.close();
    },
  },
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
