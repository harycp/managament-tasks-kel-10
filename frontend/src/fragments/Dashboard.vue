<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SideBar :is-collapsed="false" :show-collapse="false">
      <h2 class="ms-3 mb-2 text-md font-medium text-gray-700">
        Your Workspaces
      </h2>

      <nav class="flex-grow">
        <NavDropdown
          v-for="workspace in workspaces"
          :key="workspace.id"
          :title="workspace.name"
          :options="workspaceDropdownLink[workspace.id] || []"
        >
        </NavDropdown>
      </nav>

      <!-- Navigation Menu -->
      <nav class="flex-grow mt-10">
        <NavItem title="Home" link="/h" :isActive="name == 'Home'">
          <svg
            width="24px"
            height="24px"
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
                d="M14 2h-4v2H8v2H6v2H4v2H2v2h2v10h7v-6h2v6h7V12h2v-2h-2V8h-2V6h-2V4h-2V2zm0 2v2h2v2h2v2h2v2h-2v8h-3v-6H9v6H6v-8H4v-2h2V8h2V6h2V4h4z"
                fill="#000000"
              ></path>
            </g>
          </svg>
        </NavItem>
        <NavItem title="Boards" link="/b" :isActive="name == 'Boards'">
          <svg
            width="24px"
            height="24px"
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
                d="M4 3h20v14H4V3zm18 12V5H6v10h16zm-2 4H2V7H0v14h20v-2zM9 7h2v2H9V7zm3 4H8v2h4v-2zm2-4h6v2h-6V7zm6 4h-6v2h6v-2z"
                fill="#000000"
              ></path>
            </g>
          </svg>
        </NavItem>

        <NavItem title="Templates" link="/templates">
          <svg
            width="24px"
            height="24px"
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
                d="M3 3h8v10H3V3zm2 2v6h4V5H5zm8-2h8v6h-8V3zm2 2v2h4V5h-4zm-2 6h8v10h-8V11zm2 2v6h4v-6h-4zM3 15h8v6H3v-6zm2 2v2h4v-2H5z"
                fill="#000000"
              ></path>
            </g>
          </svg>
        </NavItem>
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

      <!--CONTENT HERE -->
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
      workspaceDropdownLink: {},
      isLoading: true,
      showProfilePopup: false,
    };
  },
  props: {
    title: String,
    name: String,
    isCollapsed: {
      type: Boolean,
      required: true,
    },
    showCollapse: {
      type: Boolean,
      default: true, // Default true agar tetap tampil jika tidak didefinisikan
    },
  },
  async created() {
    await this.fetchUserProfile();
    await this.fetchWorkspaces();
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
        this.workspaces = response.data.data;

        this.workspaceDropdownLink = {};
        this.workspaces.forEach((workspace) => {
          this.workspaceDropdownLink[workspace.id] = [
            {
              label: "Boards",
              route: `/workspace/${workspace.id}/boards`,
            },
            {
              label: "Notifications",
              route: `/workspace/${workspace.id}/notifications`,
            },
            {
              label: "Members",
              route: `/workspace/${workspace.id}/members`,
            },
            {
              label: "Settings",
              route: `/workspace/${workspace.id}/settings`,
            },
          ];
        });
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        this.workspaces = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
