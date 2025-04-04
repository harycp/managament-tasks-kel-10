<template>
  <section>
    <div class="">
      <NavbarHome :user="user" @openProfile="showProfilePopup = true" />
      <!-- <Home @loaded="(isLoading) => (dashboardLoading = isLoading)"> </Home> -->
      <Profile
        :isOpen="showProfilePopup"
        :user="user"
        @close="showProfilePopup = false"
      />
      <LoadingScreen :isLoading="dashboardLoading" />
    </div>
  </section>
</template>

<script>
import axios from "axios";
import LoadingScreen from "../../components/common/LoadingScreen.vue";
import Home from "../../fragments/Home.vue";
import NavbarHome from "../../components/home/NavbarHome.vue";
import Profile from "../../components/common/Profile.vue";

export default {
  components: { LoadingScreen, Home, NavbarHome, Profile },

  data() {
    return {
      user: {},
      dashboardLoading: true,
      showProfilePopup: false,
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
