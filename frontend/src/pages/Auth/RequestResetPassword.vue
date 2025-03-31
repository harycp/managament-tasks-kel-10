<template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <h1 class="text-2xl mb-4">Forgot Password</h1>
    <input
      v-model="email"
      type="email"
      placeholder="Enter your email"
      class="border p-2 mb-2"
    />
    <button @click="requestResetPassword" class="bg-blue-500 text-white p-2">
      Send Reset Link
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  setup() {
    const email = ref("");

    const requestResetPassword = async () => {
      try {
        await axios.post("http://localhost:5001/api/request-reset-password", {
          email: email.value,
        });
        alert("Reset link has been sent to your email");
        email.value = "";
      } catch (error) {
        console.log(email);
        alert(error.response.data.message);
      }
    };

    return { email, requestResetPassword };
  },
};
</script>
