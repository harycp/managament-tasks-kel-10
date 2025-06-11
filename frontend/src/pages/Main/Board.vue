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

            <List v-for="list in lists" :key="list.id" :list="list" />

            <AddList
              :has-lists="lists.length > 0"
              @add-list="handleAddNewList"
            />
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

export default {
  name: "BoardDetail",
  components: { DashMain, List, AddList },
  data() {
    return {
      dashboardLoading: true, // Dari parent
      isLoading: true, // Loading spesifik untuk konten board
      boardId: this.$route.params.boardId,
      board: null,
      lists: [],
    };
  },
  methods: {
    async fetchBoardDetails() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `http://localhost:5003/api/boards/${this.boardId}`,
          { withCredentials: true }
        );

        this.board = response.data.data;
        console.log(this.board);
        this.lists = response.data.data.lists || [];
        document.title = `${this.board.name} | Tuntask`;
      } catch (error) {
        console.error("Failed to fetch board details:", error);
        // Mungkin redirect ke halaman not found
      } finally {
        this.isLoading = false;
      }
    },

    async handleAddNewList(listName) {
      try {
        const response = await axios.post(
          `http://localhost:5003/api/boards/${this.boardId}/lists`, // Ganti port jika perlu
          { name: listName },
          { withCredentials: true }
        );

        const newList = response.data.data;
        this.lists.push(newList);
      } catch (error) {
        console.error("Failed to add new list:", error);
      }
    },
  },

  mounted() {
    this.fetchBoardDetails();
  },
};
</script>
