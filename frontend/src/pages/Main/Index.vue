<template>
  <section>
    <DashMain
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Boards"
    >
      <div class="flex flex-col gap-10 p-6 max-w-6xl mx-auto">
        <div
          v-for="(workspace, wIndex) in workspaces"
          :key="wIndex"
          class="mb-12"
        >
          <!-- Board List -->
          <div
            class="space-y-2 border rounded-lg divide-y divide-gray-200 bg-white transition"
          >
            <div
              v-for="(board, index) in workspace.boards"
              :key="index"
              class="px-4 py-3 hover:bg-gray-50 transition flex justify-between items-center cursor-pointer"
            >
              <div class="flex flex-col">
                <span class="font-medium text-gray-800">{{ board.name }}</span>
                <span class="text-xs text-gray-500"
                  >Last updated 3 days ago</span
                >
              </div>
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                transform="rotate(90)"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M11 20h2V8h2V6h-2V4h-2v2H9v2h2v12zM7 10V8h2v2H7zm0 0v2H5v-2h2zm10 0V8h-2v2h2zm0 0v2h2v-2h-2z"
                  ></path>
                </g>
              </svg>
            </div>

            <!-- Create New Board -->
            <div
              @click="openCreateBoard(workspace)"
              class="px-4 py-3 hover:bg-gray-50 transition flex justify-between items-center cursor-pointer text-gray-600"
            >
              <span class="font-medium cursor-pointer hover:text-black">
                + Create new board
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashMain>
  </section>
</template>

<script>
import axios from "axios";

import Dashboard from "../../fragments/Dashboard.vue";
import CreateBoard from "../../components/common/CreateBoard.vue";
import DashMain from "../../fragments/DashMain.vue";

export default {
  name: "Boards",
  components: { DashMain },
  props: {
    user: Object,
  },
  data() {
    return {
      dashboardLoading: true,
      name: "Boards",
      showCreateBoard: false,
      workspaces: [],
      selectedWorkspace: null,
    };
  },
  methods: {
    async fetchWorkspaces() {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/workspaces",
          {
            withCredentials: true,
          }
        );

        const workspaces = response.data.data;

        // Ambil boards untuk masing-masing workspace
        const workspacesWithBoards = await Promise.all(
          workspaces.map(async (workspace) => {
            try {
              const boardRes = await axios.get(
                `http://localhost:5003/api/workspaces/${workspace.id}/boards`,
                {
                  withCredentials: true,
                }
              );

              return {
                ...workspace,
                boards: boardRes.data.data || [],
              };
            } catch (boardErr) {
              console.error(
                `Failed to fetch boards for workspace ${workspace.id}`,
                boardErr
              );
              return {
                ...workspace,
                boards: [],
              };
            }
          })
        );

        this.workspaces = workspacesWithBoards;
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      }
    },
    openCreateBoard(workspace) {
      this.selectedWorkspace = workspace;
      this.showCreateBoard = true;
    },
  },

  mounted() {
    document.title = "Boards | Tuntask";
    this.fetchWorkspaces();
  },
};
</script>
