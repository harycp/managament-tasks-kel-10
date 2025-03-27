<template>
  <div>
    <h2 v-if="user.name">Selamat Datang, {{ user.name }}</h2>
    <p v-if="user.username">Username: {{ user.username }}</p>
    <p v-if="user.email">Email: {{ user.email }}</p>

    <p>{{ user }}</p>
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
        console.error("Gagal mengambil profil:", error);
        this.$router.push("/login");
      }
    },
  },
  mounted() {
    document.title = "Home | Tuntask";
  },
};
</script>
