<template>
  <section>
    <Dashboard
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Boards"
    >
      <template #default="{ user }">
        <div class="flex flex-col gap-10 p-6 max-w-6xl mx-auto">
          <!-- Recently Viewed Boards -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier"></g>
                <g id="SVGRepo_tracerCarrier"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M19 3H5v2H3v14h2v2h14v-2h2V5h-2V3zm0 2v14H5V5h14zm-8 2h2v6h4v2h-6V7z"
                  ></path>
                </g>
              </svg>
              <h3 class="text-lg font-semibold text-gray-800">
                Recently Viewed Boards
              </h3>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div
                v-for="(board, index) in recentBoards"
                :key="index"
                class="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition cursor-pointer"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-10 h-10 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center font-semibold text-sm"
                  >
                    {{ board.initial }}
                  </div>
                  <div>
                    <p class="text-gray-800 font-medium leading-tight">
                      {{ board.name }}
                    </p>
                    <p class="text-xs text-gray-500">{{ board.workspace }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(workspace, wIndex) in workspaces"
            :key="wIndex"
            class="mb-12"
          >
            <!-- Workspace Header -->
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
                  :to="`/workspace/${workspace.id}/boards`"
                  class="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Boards
                </router-link>
                <router-link
                  :to="`/workspace/${workspace.id}/member`"
                  class="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Members
                </router-link>
                <router-link
                  :to="`/workspace/${workspace.id}/settings`"
                  class="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Settings
                </router-link>
              </div>
            </div>

            <!-- Board List -->
            <div
              class="space-y-2 border rounded-lg divide-y divide-gray-200 bg-white transition"
            >
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
                </router-link>
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

            <CreateBoard
              :isOpen="showCreateBoard"
              @close="showCreateBoard = false"
              @boardCreated="fetchWorkspaces"
              :user="user"
              :workspace="selectedWorkspace"
            />
          </div>
        </div>
      </template>
    </Dashboard>
  </section>
</template>

<script>
import axios from "axios";

import Dashboard from "../../fragments/Dashboard.vue";
import CreateBoard from "../../components/common/CreateBoard.vue";

export default {
  name: "Boards",
  components: { Dashboard, CreateBoard },
  props: {
    user: Object,
  },
  data() {
    return {
      dashboardLoading: true,
      name: "Boards",
      showCreateBoard: false,
      recentBoards: [
        {
          name: "Product Roadmap",
          workspace: "Tuntask Team",
          initial: "P",
          isTemplate: false,
        },
        {
          name: "Sprint Planning Q3",
          workspace: "Development",
          initial: "S",
          isTemplate: false,
        },
        {
          name: "Agile Board Template",
          workspace: "Templates",
          initial: "A",
          isTemplate: true,
        },
      ],
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
