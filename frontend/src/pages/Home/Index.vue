<template>
  <section>
    <div class="">
      <NavbarHome :user="user" />
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
      user: null,
      dashboardLoading: true,
    };
  },
  async created() {
    await this.fetchUserProfile();
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
        this.dashboardLoading = false;
      }
    },
  },

  mounted() {
    document.title = "Home | Tuntask";
  },
};
</script>
