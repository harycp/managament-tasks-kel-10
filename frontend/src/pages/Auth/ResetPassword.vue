<template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <h1 class="text-2xl mb-4">Reset Password</h1>
    <input
      v-model="password"
      type="password"
      placeholder="Enter new password"
      class="border p-2 mb-2"
    />
    <button @click="resetPassword" class="bg-blue-500 text-white p-2">
      Submit
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const password = ref("");
    const route = useRoute();
    const router = useRouter();

    const resetPassword = async () => {
      try {
        await axios.post("http://localhost:5001/api/reset-password", {
          token: route.query.token,
          newPassword: password.value,
        });
        alert("Password berhasil direset");
        router.push("/login");
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    return { password, resetPassword };
  },
};
</script>
