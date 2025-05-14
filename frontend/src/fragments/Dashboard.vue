<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SideBar>
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

      <!-- :isActive="profileUmumDropdownLink.some(item => item.routeName == name)"
                v-if="profileUmumDropdownLink.length > 0"
                title="Profile Umum"
                :options="profileUmumDropdownLink" -->

      <!-- Navigation Menu -->
      <nav class="flex-grow mt-10">
        <NavItem title="Boards" link="/boards">
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

        <NavItem title="Notifications" link="/notifications">
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
                d="M14 4V2h-4v2H5v2h14V4h-5zm5 12H5v-4H3v6h5v4h2v-4h4v2h-4v2h6v-4h5v-6h-2V6h-2v8h2v2zM5 6v8h2V6H5z"
                fill="#000000"
              ></path>
            </g>
          </svg>
        </NavItem>

        <NavItem title="Members" link="/members">
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
                d="M11 0H5v2H3v6h2v2h6V8H5V2h6V0zm0 2h2v6h-2V2zM0 14h2v4h12v2H0v-6zm2 0h12v-2H2v2zm14 0h-2v6h2v-6zM15 0h4v2h-4V0zm4 8h-4v2h4V8zm0-6h2v6h-2V2zm5 12h-2v4h-4v2h6v-6zm-6-2h4v2h-4v-2z"
                fill="#000000"
              ></path>
            </g>
          </svg>
        </NavItem>

        <NavItem title="Workspace Settings" link="/settings">
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
                d="M2 5h20v14H2V5zm18 12V7H4v10h16zM8 9h2v2h2v2h-2v2H8v-2H6v-2h2V9zm6 0h2v2h-2V9zm4 4h-2v2h2v-2z"
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
        <slot></slot>
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
