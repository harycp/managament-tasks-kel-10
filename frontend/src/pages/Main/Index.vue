<template>
  <section>
    <DashMain
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Workspace Home"
    >
      <div class="flex flex-col gap-12 p-6 max-w-5xl mx-auto">
        <!-- Loop Workspace -->
        <div
          v-for="(workspace, wIndex) in workspaces"
          :key="wIndex"
          class="space-y-4"
        >
          <!-- Workspace Header -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">
              {{ workspace.name }}
            </h2>
            <div class="text-sm text-gray-500">
              <span>
                {{ workspace.description || "Tidak ada deskripsi." }}</span
              >
            </div>
            <!-- Tambahan Info Ringan -->
            <div class="text-sm text-gray-400 mt-1 flex flex-wrap gap-4">
              <div>
                Total board:
                <span class="text-gray-600 font-medium">{{
                  workspace.boards.length
                }}</span>
              </div>
              <div>
                Dibuat:
                <span class="text-gray-600">{{
                  formatDate(workspace.createdAt)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Boards List -->
          <div
            class="space-y-2 border rounded-lg divide-y divide-gray-200 bg-white transition"
          >
            <!-- Board Items -->
            <div
              v-for="(board, index) in workspace.boards"
              :key="index"
              class="px-4 py-3 hover:bg-gray-50 transition flex justify-between items-center cursor-pointer"
            >
              <router-link
                :to="`/workspace/${workspace.id}/boards/${board.id}`"
                class="flex justify-between items-center w-full"
              >
                <div class="flex flex-col">
                  <span class="font-medium text-gray-800">{{
                    board.name
                  }}</span>
                  <span class="text-xs text-gray-500">
                    Last updated 3 days ago
                  </span>
                </div>
                <svg
                  class="w-4 h-4 text-gray-400 group-hover:text-black"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  transform="rotate(90)"
                >
                  <path
                    d="M11 20h2V8h2V6h-2V4h-2v2H9v2h2v12zM7 10V8h2v2H7zm0 0v2H5v-2h2zm10 0V8h-2v2h2zm0 0v2h2v-2h-2z"
                  ></path>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- Jika tidak ada board -->
          <div
            v-if="!workspace.boards.length"
            class="text-sm text-gray-400 italic pl-2"
          >
            Belum ada board di workspace ini.
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
          "https://localhost/workspace-service/api/workspaces",
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
                `https://localhost/project-service/api/workspaces/${workspace.id}/boards`,
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
    formatDate(dateStr) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("id-ID", options);
    },
  },

  mounted() {
    document.title = "Boards | Tuntask";
    this.fetchWorkspaces();
  },
};
</script>
