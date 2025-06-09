<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SideBar
      :is-collapsed="isSidebarCollapsed"
      :show-collapse="true"
      @toggle-collapse="toggleSidebar"
      :show-logout="false"
    >
      <nav class="flex-grow">
        <div
          v-if="activeWorkspace"
          class="p-3 border-gray-200 rounded-xl transition"
        >
          <div class="flex items-start gap-4">
            <!-- Inisial -->
            <div
              class="w-10 h-10 rounded-md bg-gray-500 text-white flex items-center justify-center font-semibold text-sm"
            >
              {{ activeWorkspace.name ? activeWorkspace.name.charAt(0) : "" }}
            </div>

            <!-- Nama dan Deskripsi -->
            <div class="flex flex-col">
              <h4 class="text-gray-800 font-medium leading-tight">
                {{ activeWorkspace.name }}
              </h4>
              <p class="text-sm text-gray-500">
                {{ activeWorkspace.description }}
              </p>
            </div>
          </div>
        </div>
      </nav>

      <!-- Navigation Menu -->
      <nav class="flex-grow mt-2">
        <NavItem
          title="Member"
          :link="`/workspace/${$route.params.workspaceId}/member`"
          :isActive="name === 'Members'"
        >
          <svg
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 2H9v2H7v6h2V4h6V2zm0 8H9v2h6v-2zm0-6h2v6h-2V4zM4 16h2v-2h12v2H6v4h12v-4h2v6H4v-6z"
            />
          </svg>
        </NavItem>

        <NavItem
          title="Settings"
          :link="`/workspace/${$route.params.workspaceId}/settings`"
          :isActive="name === 'Settings'"
        >
          <svg
            class="w-6 h-6"
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
                d="M20 2h-2v4H6v2H4v8h2v2h2v4h8v-2h4v-2h-4v-2h4v-2h-4v-2H8v4H6V8h12V6h2V2zm-6 18h-4v-6h4v6z"
              ></path>
            </g>
          </svg>
        </NavItem>
      </nav>

      <!-- Navigation Menu -->
      <nav class="flex-grow mt-10">
        <h2 class="ms-3 mb-2 text-md font-medium text-gray-700">Boards</h2>
        <div v-if="activeWorkspace" class="mb-4">
          <div v-for="board in activeWorkspace.boards" :key="board.id">
            <NavItem
              :title="board.name"
              :link="`/boards/${board.id}`"
              :isActive="name === board.name"
            >
              <!-- optional icon -->
              <div
                class="w-8 h-8 rounded-md bg-gray-500 text-white flex items-center justify-center font-semibold text-sm"
              >
                {{ board.name ? board.name.charAt(0) : "" }}
              </div>
            </NavItem>
          </div>
          <!-- Tombol Tambah Board -->
          <div
            @click="openCreateBoard(activeWorkspace)"
            class="flex items-center gap-2 px-3 py-2 mt-2 ml-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Board
          </div>
        </div>
      </nav>
    </SideBar>

    <main class="flex-1 p-1 overflow-y-scroll h-screen flex flex-col gap-4">
      <!-- Profile Header -->
      <NavbarHome
        :user="user"
        @openProfile="showProfilePopup = true"
        :title="title"
      />
      <Profile
        :isOpen="showProfilePopup"
        :user="user"
        @close="showProfilePopup = false"
      />

      <!-- CONTENT HERE -->
      <div class="flex-grow overflow-auto">
        <slot :user="user" :workspace="activeWorkspace"></slot>
      </div>

      <CreateBoard
        :isOpen="showCreateBoard"
        @close="showCreateBoard = false"
        @boardCreated="handleBoardCreated"
        :user="user"
        :workspace="selectedWorkspace"
      />
    </main>
  </div>
</template>

<script>
import axios from "axios";
import Logo from "../components/layout/Logo.vue";
import NavDropdown from "../components/dashboard/NavDropdown.vue";
import NavItem from "../components/dashboard/NavItem.vue";
import SideBar from "../components/dashboard/SideBar.vue";
import NavbarHome from "../components/home/NavbarHome.vue";
import Profile from "../components/common/Profile.vue";
import CreateBoard from "../components/common/CreateBoard.vue";

export default {
  components: {
    Logo,
    NavItem,
    SideBar,
    NavDropdown,
    NavbarHome,
    Profile,
    CreateBoard,
  },

  data() {
    return {
      user: {},
      workspaces: [],
      activeWorkspace: {}, // Hanya satu workspace aktif
      isLoading: true,
      showProfilePopup: false,
      isSidebarCollapsed: false,
      showCreateBoard: false,
      selectedWorkspace: null,
    };
  },
  props: {
    title: String,
    name: String,
  },
  async created() {
    await this.fetchUserProfile();
    await this.fetchWorkspaces();

    const workspaceId = this.$route.params.workspaceId;
    if (workspaceId) {
      this.activeWorkspace =
        this.workspaces.find((ws) => ws.id === workspaceId) || null;
    } else {
      this.activeWorkspace =
        this.workspaces.length > 0 ? this.workspaces[0] : null;
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axios.get("http://localhost:5001/api/profile", {
          withCredentials: true,
        });
        this.user = response.data.data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchWorkspaces() {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/workspaces",
          {
            withCredentials: true,
          }
        );

        const workspaces = response.data.data;

        const workspacesWithBoards = await Promise.all(
          workspaces.map(async (workspace) => {
            try {
              const boardRes = await axios.get(
                `http://localhost:5003/api/workspaces/${workspace.id}/boards`,
                { withCredentials: true }
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
    async handleBoardCreated() {
      await this.fetchWorkspaces();

      if (this.selectedWorkspace) {
        this.activeWorkspace =
          this.workspaces.find((ws) => ws.id === this.selectedWorkspace.id) ||
          this.activeWorkspace;
      }

      this.showCreateBoard = false;
    },

    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    openCreateBoard(workspace) {
      this.selectedWorkspace = workspace;
      this.showCreateBoard = true;
    },
  },
};
</script>
