<template>
  <section>
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <NavbarHome />
      <!-- <Home @loaded="(isLoading) => (dashboardLoading = isLoading)"> </Home> -->
      <LoadingScreen :isLoading="dashboardLoading" />
    </div>
  </section>
</template>

<script>
import axios from "axios";
import LoadingScreen from "../../components/common/LoadingScreen.vue";
import Home from "../../fragments/Home.vue";
import NavbarHome from "../../components/home/NavbarHome.vue";

export default {
  components: { LoadingScreen, Home, NavbarHome },

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
