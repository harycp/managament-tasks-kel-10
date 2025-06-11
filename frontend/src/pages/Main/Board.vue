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
                  @update-list-name="handleUpdateListName"
                  @delete-list="handleDeleteList(index)"
                  @add-task="handleAddNewTask"
                  @complete-task="handleCompleteTask"
                  @update-task-position="handleUpdateTaskPosition"
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
    </DashMain>
  </section>
</template>

<script>
import axios from "axios";
import DashMain from "../../fragments/DashMain.vue";
import AddList from "../../components/board/AddList.vue";
import List from "../../components/board/List.vue";

import draggable from "vuedraggable";

export default {
  name: "BoardDetail",
  components: { DashMain, List, AddList, draggable },
  data() {
    return {
      dashboardLoading: true, // Dari parent
      isLoading: true, // Loading spesifik untuk konten board
      // boardId: this.$route.params.boardId,
      board: null,
      lists: [],
    };
  },
  methods: {
    async fetchBoardDetails(boardId) {
      if (!boardId) return;
      this.isLoading = true;
      try {
        const response = await axios.get(
          `http://localhost:5003/api/boards/${boardId}`,
          { withCredentials: true }
        );
        this.board = response.data.data;
        this.lists = response.data.data.lists || [];
        document.title = `${this.board.name} | Tuntask`;
      } catch (error) {
        console.error("Failed to fetch board details:", error);
        this.board = null;
        this.lists = [];
      } finally {
        this.isLoading = false;
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
