<template>
  <section>
    <Dashboard
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      title="Dashboard"
    >
      <div class="flex flex-col gap-4 h-full">
        <div class="p-6 bg-white rounded-xl h-full">
          <h1 class="text-4xl font-bold">Home</h1>
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
  name: "Home",
  components: { LoadingScreen, Dashboard },

  data() {
    return {
      dashboardLoading: true,
    };
  },
  mounted() {
    document.title = "Home | Tuntask";
  },
};
</script>
