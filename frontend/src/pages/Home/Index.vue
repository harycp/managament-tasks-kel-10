<template>
  <section>
    <Dashboard
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Home"
    >
      <div class="flex flex-col gap-4 h-full">
        <div class="p-6 bg-white rounded-xl h-full">
          <h1 class="text-xl font-semibold text-gray-800">Welcome back</h1>
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
      name: "Home",
    };
  },
  mounted() {
    document.title = "Home | Tuntask";
  },
};
</script>
