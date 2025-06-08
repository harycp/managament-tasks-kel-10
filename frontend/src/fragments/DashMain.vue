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
        <slot :user="user"></slot>
      </div>
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

export default {
  components: {
    Logo,
    NavItem,
    SideBar,
    NavDropdown,
    NavbarHome,
    Profile,
  },

  data() {
    return {
      user: {},
      workspaces: [],
      activeWorkspace: null, // Hanya satu workspace aktif
      isLoading: true,
      showProfilePopup: false,
      isSidebarCollapsed: false,
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

    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
};
</script>
