<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 duration-300 transition-all"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative duration-300 transition-all"
      >
        <div class="flex flex-row justify-between items-center">
          <!-- Header -->
          <h2 class="text-xl text-gray-900 font-semibold mb-4">
            Pengaturan Akun
          </h2>
          <button
            @click="closePopup"
            class="text-gray-600 hover:text-gray-800 text-xl"
          >
            <svg
              class="w-6 h-6 text-gray-900 hover:text-gray-500"
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
        <!-- Tombol Close -->

        <div class="flex items-center space-x-4">
          <div
            class="w-16 h-16 flex items-center justify-center bg-gray-500 border border-gray-900 rounded-full text-2xl font-medium text-white duration-300 transition-opacity hover:opacity-70"
          >
            {{ user.name ? user.name.charAt(0) : "" }}
          </div>
          <div class="flex flex-col flex-grow">
            <label class="text-sm text-gray-500">Nama Lengkap</label>
            <div class="relative">
              <input
                v-model="editedUser.name"
                :placeholder="user.name"
                type="text"
                class="border rounded px-3 py-2 w-full text-gray-900"
              />
              <button @click="updateName" class="absolute right-2 top-2">
                <svg
                  class="w-6 h-6 text-gray-900 hover:text-gray-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 2h14v2H4v16h2v-6h12v6h2V6h2v16H2V2h2zm4 18h8v-4H8v4zM20 6h-2V4h2v2zM6 6h9v4H6V6z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Account Details -->
        <div class="mt-6 space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <label class="text-sm text-gray-500">Email</label>
              <p class="text-gray-900">{{ user.email }}</p>
            </div>
            <button
              @click="showEmailPopup = true"
              class="px-3 py-1 border rounded hover:bg-gray-100 transition-all duration-300"
            >
              Ubah email
            </button>
          </div>

          <div class="flex justify-between items-center">
            <div>
              <label class="text-sm text-gray-500">Username</label>
              <p class="text-gray-900">{{ user.username }}</p>
            </div>
            <button
              class="px-3 py-1 text-gray-900 border rounded hover:bg-gray-100 transition-all duration-300"
            >
              Ubah username
            </button>
          </div>

          <div class="flex justify-between items-center">
            <div>
              <label class="text-sm text-gray-500">Tanggal bergabung</label>
              <p class="text-gray-900">
                {{
                  new Date(user.createdAt).toLocaleString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }}
              </p>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <div>
              <label class="text-sm text-gray-500">Bantuan</label>
              <p class="text-gray-900">Hapus Akun</p>
            </div>
            <button
              class="text-red-500 px-3 py-1 border rounded hover:bg-red-100 transition-all duration-300"
            >
              Hapus Permanen
            </button>
          </div>
        </div>
      </div>
      <UpdateEmailPopup
        v-if="showEmailPopup"
        :isOpen="showEmailPopup"
        :user="user"
        @close="showEmailPopup = false"
      />
    </div>
  </Teleport>
</template>

<script>
import axios from "axios";

import UpdateEmailPopup from "./UpdateEmailPopup.vue";

export default {
  components: {
    UpdateEmailPopup,
  },
  props: {
    isOpen: Boolean,
    user: Object,
  },
  data() {
    return {
      editedUser: { ...this.user },
      showEmailPopup: false,
    };
  },
  emits: ["close"],
  methods: {
    async updateName() {
      try {
        const response = await axios.put(
          `http://localhost:5001/api/users/${this.user.id}`,
          {
            name: this.editedUser.name,
          },
          {
            withCredentials: true,
          }
        );
        this.user.name = response.data.data.name;
      } catch (error) {
        console.error("Error updating name:", error);
      }
    },
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>
