<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
        <!-- Tombol Close -->
        <button
          @click="closePopup"
          class="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

        <!-- Header -->
        <h2 class="text-xl font-semibold mb-4">Account</h2>
        <div class="flex items-center space-x-4">
          <div
            class="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full text-xl font-semibold text-gray-700"
          >
            {{ user.name.charAt(0) }}
          </div>
          <div class="flex flex-col flex-grow">
            <label class="text-sm text-gray-600">Preferred Name</label>
            <div class="relative">
              <input
                v-model="editedUser.name"
                type="text"
                class="border rounded px-3 py-2 w-full"
              />
              <button class="absolute right-2 top-2 text-gray-500">✏️</button>
            </div>
          </div>
        </div>

        <!-- Account Details -->
        <div class="mt-6 space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <label class="text-sm text-gray-600">Email</label>
              <p class="text-gray-800">{{ user.email }}</p>
            </div>
            <button class="text-blue-500 hover:underline">Change email</button>
          </div>

          <div class="flex justify-between items-center">
            <div>
              <label class="text-sm text-gray-600">Username</label>
              <p class="text-gray-800">{{ user.username }}</p>
            </div>
            <button class="text-blue-500 hover:underline">
              Change username
            </button>
          </div>

          <div class="flex justify-between items-center">
            <div>
              <label class="text-sm text-gray-600">Password</label>
              <p class="text-gray-800">********</p>
            </div>
            <button class="text-blue-500 hover:underline">
              Change password
            </button>
          </div>
        </div>

        <!-- Hapus Akun -->
        <div class="mt-6 border-t pt-4 text-center">
          <button class="text-red-600 hover:underline">
            Delete my account
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    user: Object,
  },
  data() {
    return {
      editedUser: { ...this.user },
    };
  },
  emits: ["close"],
  methods: {
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>
