<template>
  <div
    class="w-72 bg-white border border-gray-200 rounded-xl shadow-sm flex-shrink-0 flex flex-col max-h-full relative"
  >
    <div
      class="drag-handle px-4 pt-3 pb-2 border-b border-gray-100 flex justify-between items-center cursor-move"
    >
      <input
        v-if="isEditingName"
        ref="inputListName"
        v-model="editedListName"
        @keyup.enter="saveListName"
        @blur="saveListName"
        @keyup.esc="cancelEdit"
        class="text-sm font-medium text-gray-800 bg-transparent border-b-2 border-gray-500 focus:outline-none w-full cursor-text"
      />
      <h3 v-else class="text-sm font-medium text-gray-800 truncate">
        {{ list.name }}
      </h3>

      <button
        @click.stop="toggleMenu"
        class="text-gray-400 hover:text-gray-600 text-xs ml-2 cursor-pointer"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
          ></path>
        </svg>
      </button>
    </div>

    <div
      v-if="isMenuOpen"
      ref="settingsMenu"
      class="absolute top-12 right-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
    >
      <ul>
        <li>
          <a
            @click.prevent="startEdit"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >Ubah Nama List</a
          >
        </li>
        <li>
          <a
            @click.prevent="promptForDelete"
            class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            >Hapus List Ini</a
          >
        </li>
      </ul>
    </div>
    <div class="flex-1 overflow-y-auto px-2 pt-2">
      <draggable
        v-model="localIncompleteTasks"
        item-key="id"
        class="min-h-[10px]"
        group="tasks"
        @end="onTaskDragEnd"
      >
        <template #item="{ element: task }">
          <TaskItem
            :task="task"
            :boardMembers="boardMembers"
            @complete="onCompleteTask"
            @open-task="onOpenTaskDetail"
          />
        </template>
      </draggable>

      <div
        v-if="completedTasks.length > 0 && incompleteTasks.length > 0"
        class="my-3 px-2"
      >
        <div class="border-t border-gray-300"></div>
      </div>

      <div v-if="completedTasks.length > 0">
        <h4 class="text-xs font-bold text-gray-400 uppercase px-2 mb-2">
          {{ completedTasks.length }} Completed
        </h4>
        <div v-for="task in completedTasks" :key="task.id" class="opacity-70">
          <div
            class="bg-white p-3 rounded-lg border mb-2 flex items-center gap-3"
          >
            <svg
              class="w-4 h-4 text-green-500 flex-shrink-0"
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
            <span class="text-sm text-gray-600 line-through">{{
              task.name
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="px-3 pt-2 pb-3">
      <div v-if="!isAddingTask">
        <button
          @click="showAddTaskForm"
          class="mt-auto w-full text-sm flex items-center gap-2 text-gray-500 hover:text-gray-600 px-2 py-1.5 text-left transition hover:bg-gray-200 rounded-md"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span>Add a task</span>
        </button>
      </div>
      <div v-else class="space-y-2">
        <textarea
          ref="newTaskTextarea"
          v-model="newTaskName"
          @keyup.enter.prevent="addNewTask"
          @keyup.esc="hideAddTaskForm"
          placeholder="Enter a title for this task..."
          class="w-full text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm resize-none"
          rows="3"
        ></textarea>
        <div class="flex gap-2">
          <button
            @click="addNewTask"
            class="text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black hover:border-gray-300 hover:border rounded-md transition-all duration-300 px-4 py-1.5"
          >
            Add task
          </button>
          <button
            @click="hideAddTaskForm"
            class="text-sm font-semibold bg-white text-black border-gray-300 border hover:bg-black hover:!text-white rounded-md transition-all duration-300 p-1.5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <transition name="modal-fade">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        @click.self="cancelDelete"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
        >
          <div class="px-6 py-5">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100"
              >
                <svg
                  class="h-6 w-6 text-gray-600"
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
                      d="M3 3h16v2H5v14h14v2H3V3zm18 0h-2v18h2V3zM11 15h2v2h-2v-2zm2-8h-2v6h2V7z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">Hapus List</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-600">
                    {{ deleteConfirmationMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl"
          >
            <button
              @click="handleDeleteConfirm"
              class="px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black hover:border-gray-300 hover:border rounded-md transition-all duration-300"
            >
              Ya, Hapus
            </button>
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-sm font-semibold bg-white text-black border-gray-300 border hover:bg-black hover:!text-white rounded-md transition-all duration-300"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import TaskItem from "./TaskItem.vue";

export default {
  name: "ListComponent",
  components: { draggable, TaskItem },
  props: {
    list: {
      type: Object,
      required: true,
    },
    boardMembers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isMenuOpen: false,
      isEditingName: false,
      editedListName: "",
      showDeleteConfirm: false, // State untuk kontrol modal
      isAddingTask: false,
      newTaskName: "",
    };
  },
  computed: {
    deleteConfirmationMessage() {
      return `Apakah Anda yakin ingin menghapus list "${this.list.name}"? Semua task di dalamnya juga akan terhapus secara permanen. Aksi ini tidak dapat dibatalkan.`;
    },
    incompleteTasks() {
      if (!this.list.tasks) return [];
      return this.list.tasks
        .filter((t) => !t.completed)
        .sort((a, b) => a.position - b.position);
    },
    completedTasks() {
      if (!this.list.tasks) return [];
      return this.list.tasks
        .filter((t) => t.completed)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
    localIncompleteTasks: {
      get() {
        return this.incompleteTasks;
      },
      set(newTasks) {},
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    startEdit() {
      this.editedListName = this.list.name;
      this.isEditingName = true;
      this.closeMenu();
      this.$nextTick(() => {
        this.$refs.inputListName.focus();
      });
    },
    cancelEdit() {
      this.isEditingName = false;
      this.editedListName = "";
    },
    saveListName() {
      if (!this.isEditingName) return; // Mencegah double trigger
      if (
        this.editedListName.trim() &&
        this.editedListName !== this.list.name
      ) {
        this.$emit("update-list-name", {
          listId: this.list.id,
          newName: this.editedListName.trim(),
        });
      }
      this.isEditingName = false;
    },

    // Method untuk MEMBUKA modal
    promptForDelete() {
      this.showDeleteConfirm = true;
      this.closeMenu();
    },

    // Method saat user mengklik "Ya, Hapus"
    handleDeleteConfirm() {
      this.$emit("delete-list", this.list.id);
      this.showDeleteConfirm = false;
    },

    // Method saat user membatalkan
    cancelDelete() {
      this.showDeleteConfirm = false;
    },

    handleClickOutside(event) {
      if (
        this.$refs.settingsMenu &&
        !this.$refs.settingsMenu.contains(event.target)
      ) {
        this.closeMenu();
      }
    },

    showAddTaskForm() {
      this.isAddingTask = true;
      this.$nextTick(() => this.$refs.newTaskTextarea.focus());
    },
    hideAddTaskForm() {
      this.isAddingTask = false;
      this.newTaskName = "";
    },
    addNewTask() {
      const trimmedName = this.newTaskName.trim();
      if (!trimmedName) return;
      this.$emit("add-task", { listId: this.list.id, name: trimmedName });
      this.hideAddTaskForm();
    },
    onCompleteTask(taskId) {
      this.$emit("complete-task", { taskId });
    },
    onTaskDragEnd(event) {
      const { oldIndex, newIndex } = event;
      if (oldIndex === newIndex) return;

      const movedTask = this.incompleteTasks[newIndex];
      const newPosition = newIndex + 1;

      this.$emit("update-task-position", {
        taskId: movedTask.id,
        newPosition,
      });
    },
    onOpenTaskDetail(task) {
      this.$emit("open-task", task);
    },
  },
  watch: {
    isMenuOpen(isOpen) {
      if (isOpen) {
        document.addEventListener("click", this.handleClickOutside, true);
      } else {
        document.removeEventListener("click", this.handleClickOutside, true);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
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
