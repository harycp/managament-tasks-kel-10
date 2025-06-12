<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      @click.self="close"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900">Invite New Member</h3>
          <p class="text-sm text-gray-500 mt-1">
            Enter the email of the user you want to add to this board.
          </p>

          <div
            v-if="errorMessage"
            class="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-md"
          >
            {{ errorMessage }}
          </div>
          <div
            v-if="successMessage"
            class="mt-4 p-3 bg-green-100 text-green-700 text-sm rounded-md"
          >
            {{ successMessage }}
          </div>

          <form @submit.prevent="handleInvite" class="mt-4 space-y-4">
            <div>
              <label
                for="email"
                class="text-sm font-medium text-gray-700 block mb-1"
                >Email Address</label
              >
              <input
                v-model="email"
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label
                for="role"
                class="text-sm font-medium text-gray-700 block mb-1"
                >Role</label
              >
              <select
                v-model="role"
                id="role"
                class="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="member">Member</option>
              </select>
            </div>
          </form>
        </div>

        <div
          class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl"
        >
          <button
            @click="handleInvite"
            :disabled="isLoading"
            class="bg-gray-600 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-gray-700"
          >
            <span v-if="isLoading">Inviting...</span>
            <span v-else>Send Invite</span>
          </button>
          <button
            @click="close"
            class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";

export default {
  name: "AddMemberModal",
  props: {
    isOpen: Boolean,
    boardId: String,
  },
  emits: ["close", "member-added"],
  data() {
    return {
      email: "",
      role: "member",
      isLoading: false,
      errorMessage: null,
      successMessage: null,
    };
  },
  methods: {
    async handleInvite() {
      if (!this.email) return;
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      try {
        await axios.post(
          `http://localhost:5003/api/boards/${this.boardId}/members`,
          { email: this.email, role: this.role },
          { withCredentials: true }
        );
        this.successMessage = `Successfully invited ${this.email}.`;
        this.$emit("member-added");
        // Kosongkan form setelah berhasil
        this.email = "";
        this.role = "member";
      } catch (error) {
        this.errorMessage =
          error.response?.data?.error || "An unknown error occurred.";
      } finally {
        this.isLoading = false;
      }
    },
    close() {
      this.$emit("close");
      // Reset state saat modal ditutup
      this.email = "";
      this.role = "member";
      this.errorMessage = null;
      this.successMessage = null;
    },
  },
  watch: {
    // Jika modal dibuka/ditutup dari luar, reset state juga
    isOpen(newVal) {
      if (!newVal) {
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
