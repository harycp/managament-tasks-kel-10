<template>
  <section>
    <Dashboard
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Home"
    >
      <template #default="{ user }">
        <div class="flex flex-col gap-8 p-6 max-w-5xl mx-auto">
          <!-- Intro -->
          <div
            class="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center gap-4"
          >
            <div>
              <div class="flex items-center gap-4">
                <h2 class="text-2xl font-semibold text-gray-800">
                  Hello, welcome back!
                </h2>
                <svg
                  class="w-8 h-8 hover:text-gray-500 transition"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M5 3h14v2H5V3zm0 16H3V5h2v14zm14 0v2H5v-2h14zm0 0h2V5h-2v14zM10 8H8v2h2V8zm4 0h2v2h-2V8zm-5 6v-2H7v2h2zm6 0v2H9v-2h6zm0 0h2v-2h-2v2z"
                    ></path>
                  </g>
                </svg>
              </div>
              <p class="text-gray-500 mt-1 text-sm">
                Your boards. Your team. One place to manage it all.
              </p>
            </div>
          </div>

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

          <!-- Your Workspace -->
          <div class="mt-10">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">
                Your Workspaces
              </h3>
              <button
                @click="showCreateWorkspace = true"
                class="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow transition flex items-center"
              >
                <svg
                  class="w-4 h-4 hover:text-gray-500 transition"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  transform="rotate(45)"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
                    ></path>
                  </g>
                </svg>
                <span class="ml-2">Add Workspace</span>
              </button>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div
                v-for="(workspace, index) in workspaces"
                :key="index"
                class="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition cursor-pointer"
              >
                <div class="flex items-start gap-4">
                  <!-- Inisial -->
                  <div
                    class="w-10 h-10 rounded-md bg-gray-500 text-white flex items-center justify-center font-semibold text-sm"
                  >
                    {{ workspace.name ? workspace.name.charAt(0) : "" }}
                  </div>

                  <!-- Nama dan Deskripsi -->
                  <div class="flex flex-col">
                    <h4 class="text-gray-800 font-medium leading-tight">
                      {{ workspace.name }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      {{ workspace.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CreateWorkspace
            :isOpen="showCreateWorkspace"
            @close="showCreateWorkspace = false"
            @workspaceCreated="fetchWorkspaces"
            :user="user"
          />
        </div>
      </template>
    </Dashboard>
  </section>
</template>

<script>
import axios from "axios";

import CreateWorkspace from "../../components/common/CreateWorkspace.vue";
import Dashboard from "../../fragments/Dashboard.vue";

export default {
  name: "Home",
  components: { Dashboard, CreateWorkspace },
  props: {
    user: Object,
  },
  data() {
    return {
      dashboardLoading: true,
      name: "Home",
      showCreateWorkspace: false,
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
        this.workspaces = response.data.data;
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      }
    },
  },
  mounted() {
    document.title = "Home | Tuntask";
    this.fetchWorkspaces();
  },
};
</script>
