<template>
  <Dashboard>
    <LoadingScreen :isLoading="isLoading" />
    <div v-if="!isLoading">
      <h2 v-if="user.name">Selamat Datang, {{ user.name }}</h2>
      <p v-if="user.username">Username: {{ user.username }}</p>
      <p v-if="user.email">Email: {{ user.email }}</p>

      <p>{{ user }}</p>
    </div>
  </Dashboard>
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
      isLoading: true, // Set awal loading
    };
  },
  async created() {
    await this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        // Simulasi delay 1.5 detik sebelum request dimulai
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const response = await axios.get("http://localhost:5001/api/profile", {
          withCredentials: true,
        });

        this.user = response.data.data;
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
        this.$router.push("/login");
      } finally {
        this.isLoading = false; // Pastikan loading dihentikan
      }
    },
  },

  mounted() {
    document.title = "Home | Tuntask";
  },
};
</script>
