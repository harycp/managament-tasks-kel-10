<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SideBar>
      <h2 class="ms-3 mb-2 text-md font-medium text-gray-700">
        Your Workspaces
      </h2>
      <NavDropdown
        v-if="workspaceDropdownLink.length > 0"
        title="Workspace"
        :options="workspaceDropdownLink"
        @workspace-selected="handleWorkspaceChange"
      >
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
              d="M3 3h18v18H3V3zm2 2v6h8V5H5zm10 0v14h4V5h-4zm-2 14v-2h-3v2h3zm-5 0v-2H5v2h3zm-3-4h3v-2H5v2zm5-2v2h3v-2h-3z"
              fill="#000000"
            ></path>
          </g>
        </svg>
      </NavDropdown>

      <!-- Navigation Menu -->
      <nav class="flex-grow mt-10">
        <NavItem title="Projects" link="/projects">
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

      <nav class="flex-grow mt-10">
        <h2 class="ms-3 mb-2 text-md font-medium text-gray-700">
          Your Projects
        </h2>
        <NavItem
          v-for="project in projectList"
          :key="project.id"
          :title="project.name"
          :link="`/workspace/${project.workspace_id}/boards/${project.id}`"
        />
      </nav>
    </SideBar>

    <main class="flex-1 p-1 overflow-y-scroll h-screen flex flex-col gap-4">
      <!-- Profile Header -->
      <TopHeader />

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
import SideBar from "../components/home/SideBar.vue";
import TopHeader from "../components/dashboard/TopHeader.vue";

export default {
  components: {
    Logo,
    NavItem,
    SideBar,
    NavDropdown,
    TopHeader,
  },

  data() {
    return {
      workspaceDropdownLink: [],
      projectList: [],
      isLoading: true,
    };
  },
  props: {
    title: String,
    name: String,
  },
  async mounted() {
    await this.fetchWorkspaces();
    this.isLoading = false;
    this.$emit("user", this.user);
    this.$emit("loaded", this.isLoading);
  },
  methods: {
    async fetchWorkspaces() {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/workspaces",
          { withCredentials: true }
        );

        this.workspaceDropdownLink = response.data.data;

        if (this.workspaceDropdownLink.length > 0) {
          this.selectedWorkspace = this.workspaceDropdownLink[0];
          await this.fetchProjects(this.selectedWorkspace.id);
        }

        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    },
    async fetchProjects(workspaceId) {
      try {
        const response = await axios.get(
          `http://localhost:5003/api/workspaces/${workspaceId}/boards`,
          { withCredentials: true }
        );

        this.projectList = response.data.data;
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    async handleWorkspaceChange(selectedWorkspace) {
      this.selectedWorkspace = selectedWorkspace;
      await this.fetchProjects(selectedWorkspace.id);
    },
  },
};
</script>
