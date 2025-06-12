<template>
  <section class="h-full">
    <DashMain
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="board ? board.name : 'Board'"
      title="Board"
    >
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="px-8 pt-6 pb-2">
          <h2
            v-if="board"
            class="text-2xl font-semibold text-gray-800 tracking-tight"
          >
            {{ board.name }}
          </h2>
          <p v-if="board?.description" class="text-gray-500 mt-1 text-sm">
            {{ board.description }}
          </p>

          <div class="flex items-center gap-4 mt-4">
            <div class="flex -space-x-2">
              <div
                v-for="member in boardMembers.slice(0, 5)"
                :key="member.id"
                :title="member.name"
                class="w-8 h-8 rounded-full border-2 border-white bg-gray-500 text-white flex items-center justify-center font-semibold text-sm ring-1 ring-gray-300"
              >
                {{ member.name ? member.name.charAt(0).toUpperCase() : "?" }}
              </div>
              <div
                v-if="boardMembers.length > 5"
                class="w-8 h-8 rounded-full border-2 border-white bg-gray-200 text-gray-600 flex items-center justify-center font-semibold text-xs ring-1 ring-gray-300"
              >
                +{{ boardMembers.length - 5 }}
              </div>
            </div>
            <button
              @click="isAddMemberModalOpen = true"
              class="flex items-center gap-4 cursor-pointer px-4 py-2 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
            >
              <svg
                class="w-5 h-5 text-gray-400 group-hover:text-black"
                viewBox="0 0 24 24"
                fill="none"
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
                    d="M18 2h-6v2h-2v6h2V4h6V2zm0 8h-6v2h6v-2zm0-6h2v6h-2V4zM7 16h2v-2h12v2H9v4h12v-4h2v6H7v-6zM3 8h2v2h2v2H5v2H3v-2H1v-2h2V8z"
                    fill="#000000"
                  ></path>
                </g>
              </svg>
              <span> Invite </span>
            </button>
          </div>
        </div>

        <!-- List Container -->
        <div class="flex-1 overflow-x-auto overflow-y-hidden px-6 py-4">
          <div class="flex items-start gap-4 h-full">
            <template v-if="isLoading">
              <div class="text-gray-400">Loading lists...</div>
            </template>

            <draggable
              v-model="lists"
              item-key="id"
              class="flex items-start gap-4 h-full"
              @end="handleDragEnd"
              handle=".drag-handle"
              :animation="200"
            >
              <template #item="{ element: list, index }">
                <List
                  :key="list.id"
                  :list="list"
                  :boardMembers="boardMembers"
                  @update-list-name="handleUpdateListName"
                  @delete-list="handleDeleteList(index)"
                  @add-task="handleAddNewTask"
                  @complete-task="handleCompleteTask"
                  @update-task-position="handleUpdateTaskPosition"
                  @open-task="openTaskDetailModal"
                />
              </template>

              <template #footer>
                <AddList
                  :has-lists="lists.length > 0"
                  @add-list="handleAddNewList"
                />
              </template>
            </draggable>
          </div>
        </div>
      </div>

      <TaskDetailModal
        :isOpen="isTaskDetailOpen"
        :task="selectedTask"
        :boardMembers="boardMembers"
        @close="closeTaskDetailModal"
        @update-task="handleUpdateTask"
      />

      <AddMemberModal
        :isOpen="isAddMemberModalOpen"
        :boardId="$route.params.boardId"
        @close="isAddMemberModalOpen = false"
        @member-added="handleMemberAdded"
      />
    </DashMain>
  </section>
</template>

<script>
import axios from "axios";
import DashMain from "../../fragments/DashMain.vue";
import AddList from "../../components/board/AddList.vue";
import List from "../../components/board/List.vue";
import TaskDetailModal from "../../components/board/TaskDetailModal.vue";
import AddMemberModal from "../../components/board/AddMemberModal.vue";

import draggable from "vuedraggable";

export default {
  name: "BoardDetail",
  components: {
    DashMain,
    List,
    AddList,
    draggable,
    TaskDetailModal,
    AddMemberModal,
  },
  data() {
    return {
      dashboardLoading: true, // Dari parent
      isLoading: true, // Loading spesifik untuk konten board
      // boardId: this.$route.params.boardId,
      board: null,
      lists: [],
      boardMembers: [],
      isTaskDetailOpen: false,
      selectedTask: null,
      isAddMemberModalOpen: false,
    };
  },
  methods: {
    async fetchBoardDetails(boardId) {
      if (!boardId) return;
      this.isLoading = true;
      try {
        const [boardRes, membersRes] = await Promise.all([
          axios.get(`http://localhost:5003/api/boards/${boardId}`, {
            withCredentials: true,
          }),
          axios.get(`http://localhost:5003/api/boards/${boardId}/members`, {
            withCredentials: true,
          }),
        ]);

        this.board = boardRes.data.data;
        this.lists = boardRes.data.data.lists || [];

        this.boardMembers = membersRes.data.data;
        document.title = `${this.board.name} | Tuntask`;
      } catch (error) {
        console.error("Failed to fetch board details:", error);
        this.board = null;
        this.lists = [];
        this.boardMembers = [];
      } finally {
        this.isLoading = false;
      }
    },

    async handleMemberAdded() {
      try {
        const membersRes = await axios.get(
          `http://localhost:5003/api/boards/${this.$route.params.boardId}/members`,
          { withCredentials: true }
        );
        this.boardMembers = membersRes.data.data;
      } catch (error) {
        console.error("Failed to refetch board members:", error);
      }
    },

    async handleAddNewList(listName) {
      try {
        const response = await axios.post(
          `http://localhost:5003/api/boards/${this.$route.params.boardId}/lists`,
          { name: listName },
          { withCredentials: true }
        );
        this.lists.push(response.data.data);
      } catch (error) {
        console.error("Failed to add new list:", error);
      }
    },

    async handleUpdateListName({ listId, newName }) {
      try {
        await axios.put(
          `http://localhost:5003/api/lists/${listId}`,
          { name: newName },
          { withCredentials: true }
        );

        const listToUpdate = this.lists.find((list) => list.id === listId);
        if (listToUpdate) {
          listToUpdate.name = newName;
        }
      } catch (error) {
        console.error("Failed to update list name:", error);
      }
    },

    async handleDeleteList(listIndex) {
      const listToDelete = this.lists[listIndex];
      if (!listToDelete) return;

      try {
        await axios.delete(
          `http://localhost:5003/api/lists/${listToDelete.id}`,
          { withCredentials: true }
        );

        this.lists.splice(listIndex, 1);
      } catch (error) {
        console.error("Failed to delete list:", error);
      }
    },

    async handleDragEnd(event) {
      const { oldIndex, newIndex } = event;

      if (oldIndex === newIndex) return;

      const movedList = this.lists[newIndex];
      const listId = movedList.id;

      const newPosition = newIndex + 1;

      try {
        await axios.put(
          `http://localhost:5003/api/lists/${listId}/position`,
          { newPosition },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Failed to update list position:", error);
        const item = this.lists.splice(newIndex, 1)[0];
        this.lists.splice(oldIndex, 0, item);
      }
    },

    async handleAddNewTask({ listId, name }) {
      try {
        const response = await axios.post(
          `http://localhost:5003/api/lists/${listId}/tasks`,
          { name },
          { withCredentials: true }
        );
        const newTask = response.data.data;

        // Cari list yang sesuai dan tambahkan task baru ke dalamnya
        const targetList = this.lists.find((l) => l.id === listId);
        if (targetList) {
          if (!targetList.tasks) {
            targetList.tasks = [];
          }
          targetList.tasks.push(newTask);
        }
      } catch (error) {
        console.error("Failed to add new task:", error);
      }
    },

    openTaskDetailModal(task) {
      this.selectedTask = task;
      this.isTaskDetailOpen = true;
    },

    closeTaskDetailModal() {
      this.isTaskDetailOpen = false;
      this.selectedTask = null;
    },

    async handleUpdateTask({ taskId, payload }) {
      try {
        const response = await axios.put(
          `http://localhost:5003/api/tasks/${taskId}`,
          payload,
          { withCredentials: true }
        );
        const updatedTask = response.data.data;

        for (const list of this.lists) {
          const taskIndex = list.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex !== -1) {
            list.tasks[taskIndex] = {
              ...list.tasks[taskIndex],
              ...updatedTask,
            };
            break;
          }
        }
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    },

    async handleCompleteTask({ taskId }) {
      try {
        const response = await axios.put(
          `http://localhost:5003/api/tasks/${taskId}`,
          { completed: true },
          { withCredentials: true }
        );
        const updatedTask = response.data.data;

        // Cari dan update task di state lokal
        for (const list of this.lists) {
          const taskIndex = list.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex !== -1) {
            // Ganti objek task lama dengan yang baru dari server
            list.tasks[taskIndex] = updatedTask;
            break;
          }
        }
      } catch (error) {
        console.error("Failed to complete task:", error);
      }
    },

    async handleUpdateTaskPosition({ taskId, newPosition }) {
      try {
        await axios.put(
          `http://localhost:5003/api/tasks/${taskId}/position`,
          { newPosition },
          { withCredentials: true }
        );
        this.fetchBoardDetails(this.$route.params.boardId);
      } catch (error) {
        console.error("Failed to update task position:", error);
      }
    },
  },

  watch: {
    "$route.params.boardId": {
      handler(newBoardId) {
        this.fetchBoardDetails(newBoardId);
      },
      immediate: true,
    },
  },
};
</script>
