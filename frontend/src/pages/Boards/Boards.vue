<template>
  <section>
    <Dashboard
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      name="Boards"
      title="Boards"
    >
      <template #default="{ user }">
        <div class="flex flex-col gap-10 p-6 max-w-6xl mx-auto">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    d="M19 3H5v2H3v14h2v2h14v-2h2V5h-2V3zm0 2v14H5V5h14zm-8 2h2v6h4v2h-6V7z"
                  ></path>
                </g>
              </svg>
              <h3 class="text-lg font-semibold text-gray-800">
                Recently Viewed Boards
              </h3>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"></div>
          </div>

          <div v-if="isLoading" class="text-center text-gray-500 py-10">
            Loading your boards...
          </div>
          <div
            v-else-if="groupedWorkspaces.length === 0"
            class="text-center text-gray-500 py-10"
          >
            You are not a member of any boards yet. Create one or ask to be
            invited!
          </div>

          <div
            v-for="workspace in groupedWorkspaces"
            :key="workspace.id"
            class="mb-12"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-gray-300 text-white text-sm font-semibold rounded flex items-center justify-center"
                >
                  {{ workspace.name.charAt(0).toUpperCase() }}
                </div>
                <h2 class="text-lg font-bold text-gray-800">
                  {{ workspace.name }}
                </h2>
              </div>
              <div class="flex gap-2 text-sm text-gray-500">
                <router-link
                  :to="`/workspace/${workspace.id}/member`"
                  class="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200"
                  >Members</router-link
                >
              </div>
            </div>

            <div class="border rounded-lg divide-y divide-gray-200 bg-white">
              <div
                v-for="board in workspace.boards"
                :key="board.id"
                class="px-4 py-3 hover:bg-gray-50 transition"
              >
                <router-link
                  :to="`/workspace/${workspace.id}/boards/${board.id}`"
                  class="flex justify-between items-center w-full"
                >
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-800">{{
                      board.name
                    }}</span>
                    <span class="text-xs text-gray-500"
                      >Last updated
                      {{
                        formatDistanceToNow(new Date(board.updatedAt), {
                          addSuffix: true,
                        })
                      }}</span
                    >
                  </div>
                  <svg
                    class="w-5 h-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </router-link>
              </div>

              <div
                @click="openCreateBoard(workspace)"
                class="px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-gray-600"
              >
                <span class="font-medium hover:text-black"
                  >+ Create new board in this workspace</span
                >
              </div>
            </div>
          </div>
        </div>

        <CreateBoard
          :isOpen="showCreateBoard"
          @close="showCreateBoard = false"
          @boardCreated="fetchMyBoards"
          :user="user"
          :workspace="selectedWorkspace"
        />
      </template>
    </Dashboard>
  </section>
</template>

<script>
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Dashboard from "../../fragments/Dashboard.vue";
import CreateBoard from "../../components/common/CreateBoard.vue";

export default {
  name: "Boards",
  components: { Dashboard, CreateBoard },
  data() {
    return {
      dashboardLoading: true,
      isLoading: true,
      showCreateBoard: false,
      groupedWorkspaces: [], // <-- State utama yang akan menampung data terkelompok
      selectedWorkspace: null,
      // Hapus 'workspaces' dan 'recentBoards' yang statis
    };
  },
  methods: {
    // Method untuk format tanggal agar bisa digunakan di template
    formatDistanceToNow,

    /**
     * Logika baru untuk mengambil data.
     * 1. Ambil SEMUA board yang bisa diakses user dari satu endpoint.
     * 2. Kelompokkan board-board tersebut berdasarkan workspace di sisi frontend.
     */
    async fetchMyBoards() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "http://localhost:5003/api/boards/me", // Panggil endpoint baru
          { withCredentials: true }
        );
        const allBoards = response.data.data || [];

        // Jika tidak ada board sama sekali
        if (!allBoards) {
          this.groupedWorkspaces = [];
          return;
        }

        // Proses pengelompokkan board berdasarkan workspace
        const workspacesMap = new Map();
        allBoards.forEach((board) => {
          const ws = board.workspace;
          console.log(board)
          // if (!ws || !ws.id) return;

          // Jika workspace ini belum ada di map, buat entri baru
          if (!workspacesMap.has(ws.id)) {
            workspacesMap.set(ws.id, {
              id: ws.id,
              name: ws.name,
              boards: [], // Siapkan array untuk menampung board
            });
          }
          // Tambahkan board saat ini ke dalam workspace yang sesuai di map
          workspacesMap.get(ws.id).boards.push(board);
        });

        // Ubah Map menjadi Array agar bisa di-loop oleh v-for
        this.groupedWorkspaces = Array.from(workspacesMap.values());
      } catch (error) {
        console.error("Failed to fetch boards:", error);
        this.groupedWorkspaces = []; // Pastikan dikosongkan jika error
      } finally {
        this.isLoading = false;
      }
    },

    openCreateBoard(workspace) {
      this.selectedWorkspace = workspace;
      this.showCreateBoard = true;
    },
  },
  mounted() {
    document.title = "Boards | Tuntask";
    this.fetchMyBoards(); // Panggil method yang sudah diperbarui
  },
};
</script>
