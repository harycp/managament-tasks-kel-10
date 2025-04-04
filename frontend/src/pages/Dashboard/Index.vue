<template>
  <section>
    <Dashboard @loaded="(isLoading) => (dashboardLoading = isLoading)">
    </Dashboard>
    <LoadingScreen :isLoading="dashboardLoading" />
  </section>
</template>

<script>
import axios from "axios";
import LoadingScreen from "../../components/common/LoadingScreen.vue";
import Dashboard from "../../fragments/Dashboard.vue";

export default {
  components: { LoadingScreen, Dashboard },

  data() {
    return {
      user: {},
      dashboardLoading: true,
    };
  },
  async created() {
    await this.fetchUserProfile();
  },
  methods: {},

  mounted() {
    document.title = "Home | Tuntask";
  },
};
</script>
