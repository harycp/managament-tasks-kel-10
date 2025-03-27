<template>
  <div class="flex min-h-screen">
    <LoadingScreen :isLoading="isLoading" />
    <!-- Sidebar -->
    <SideBar>
      <NavDropdown
        v-if="workspaceDropdownLink.length > 0"
        title="Workspace"
        :options="workspaceDropdownLink"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 9H19V7H17V9ZM17 13H19V11H17V13ZM17 17H19V15H17V17ZM17 21V19H21V5H12V6.4L10 4.95V3H23V21H17ZM1 21V11L8 6L15 11V21H9V16H7V21H1ZM3 19H5V14H11V19H13V12L8 8.45L3 12V19Z"
            fill="currentColor"
          />
        </svg>
      </NavDropdown>
    </SideBar>

    <main
      class="flex-1 p-4 overflow-y-scroll h-screen flex flex-col gap-4"
    ></main>
  </div>
</template>

<script>
import NavDropdown from "../components/dashboard/NavDropdown.vue";
import Logo from "../components/layout/Logo.vue";
import NavItem from "../components/dashboard/NavItem.vue";
import SideBar from "../components/dashboard/SideBar.vue";
import axios from "axios";

export default {
  components: {
    Logo,
    NavItem,
    SideBar,
    NavDropdown,
  },

  data() {
    return {
      workspaceDropdownLink: [],
      isLoading: true,
    };
  },
  props: {
    title: String,
    name: String,
  },
  async mounted() {
    await this.fetchWorkspaces(); // Fetch data saat komponen dimuat
    this.isLoading = false;
    this.$emit("user", this.user);
    this.$emit("loaded", this.isLoading);
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

        this.workspaceDropdownLink = response.data.data;

        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    },
  },
};
</script>
