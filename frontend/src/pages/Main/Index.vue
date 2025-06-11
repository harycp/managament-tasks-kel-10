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
          <!-- Board Detail (Ada List) -->
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
