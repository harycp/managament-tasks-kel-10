<template>
  <div>
    <h2 v-if="user.name">Selamat Datang, {{ user.name }}</h2>
    <p v-if="user.username">Username: {{ user.username }}</p>
    <p v-if="user.email">Email: {{ user.email }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {},
    };
  },
  async created() {
    this.checkOAuthToken();
    await this.fetchUserProfile();
  },
  methods: {
    checkOAuthToken() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        console.log("Token dari URL:", token); // Debugging
        localStorage.setItem("authToken", token); // Simpan token
        window.history.replaceState({}, document.title, "/dashboard"); // Bersihkan URL
      }
    },
    async fetchUserProfile() {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        this.$router.push("/login"); // Redirect jika tidak ada token
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/api/profile", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        this.user = response.data.data;
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
        localStorage.removeItem("authToken"); // Hapus token jika tidak valid
        this.$router.push("/login"); // Redirect ke login jika token invalid
      }
    },
  },
};
</script>
