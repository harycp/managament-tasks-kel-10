<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
    >
      <div class="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Ubah username</h2>

          <button @click="$emit('close')">
            <svg
              class="w-4 h-4 text-gray-900 hover:text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Step 1: Password -->
        <div class="space-y-4">
          <p class="text-sm text-gray-500">
            Username anda saat ini adalah
            <span class="font-semibold text-gray-900">{{ user.username }}</span
            >.
          </p>
          <input
            type="text"
            v-model="username"
            placeholder="Masukkan username baru"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <PrimaryButton
            @click="updateUsername"
            :inactive="isButtonDisabled"
            label="Simpan"
            :additionalClass="'py-2 text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
          />
        </div>

        <p v-if="errorMessage" class="mt-3 text-sm text-red-500">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script>
import axios from "axios";
import PrimaryButton from "./PrimaryButton.vue";

export default {
  components: { PrimaryButton },
  props: {
    isOpen: Boolean,
    user: Object,
  },
  emits: ["close"],
  data() {
    return {
      username: "",
      errorMessage: "",
      isButtonDisabled: false,
    };
  },
  methods: {
    async updateUsername() {
      this.errorMessage = "";
      try {
        await axios.put(
          `https://localhost/user-service/api/users/${this.user.id}`,
          {
            username: this.username,
          },
          {
            withCredentials: true,
          }
        );
        this.isButtonDisabled = true;
        this.$emit("close");
        this.user.username = this.username;
      } catch (error) {
        this.isButtonDisabled = false;
        this.errorMessage = "Failed to update username. Please try again.";
      }
    },
  },
};
</script>
