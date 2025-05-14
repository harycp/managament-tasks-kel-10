<template>
  <section>
    <Dashboard
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Boards"
    >
      <div class="flex flex-col gap-4 h-full">
        <div class="p-6 bg-white rounded-xl h-full">
          <h1 class="text-2xl font-bold">Recenty viewed</h1>
        </div>
      </div>
    </Dashboard>
  </section>
</template>

<script>
import axios from "axios";
import LoadingScreen from "../../components/common/LoadingScreen.vue";
import Dashboard from "../../fragments/Dashboard.vue";

export default {
  name: "Boards",
  components: { LoadingScreen, Dashboard },

  data() {
    return {
      dashboardLoading: true,
      name: "Boards",
    };
  },
  mounted() {
    document.title = "Boards | Tuntask";
  },
};
</script>
