<template>
  <div
    class="flex flex-row items-center justify-between p-4 bg-white rounded-lg"
  >
    <p class="ms-2 text-gray-900 font-semibold text-xl">{{ title }}</p>
    <div class="me-4 flex items-center space-x-4">
      <!-- Avatar Group -->
      <div class="flex -space-x-2">
        <img
          class="w-8 h-8 rounded-full border-2 border-white"
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Avatar 1"
        />
        <img
          class="w-8 h-8 rounded-full border-2 border-white"
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Avatar 2"
        />
        <img
          class="w-8 h-8 rounded-full border-2 border-white"
          src="https://randomuser.me/api/portraits/men/23.jpg"
          alt="Avatar 3"
        />
      </div>

      <!-- Notifikasi -->
      <button>
        <svg
          class="w-6 h-6 text-gray-900 hover:text-gray-500 transition"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 4V2h-4v2H5v2h14V4h-5zm5 12H5v-4H3v6h5v4h2v-4h4v2h-4v2h6v-4h5v-6h-2V6h-2v8h2v2zM5 6v8h2V6H5z"
          ></path>
        </svg>
      </button>

      <button @click="$emit('openProfile')" class="flex items-center space-x-2">
        <div
          class="w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-gray-400 to-gray-300 border rounded-full text-xl font-medium text-white durataion-300 transition-opacity hover:opacity-70"
        >
          {{ user.name ? user.name.charAt(0) : "" }}
        </div>

        <p
          class="text-sm font-medium text-gray-900 hover:text-gray-500 transition-all durataion-300"
        >
          {{ user.name ? user.name.split(" ").slice(0, 2).join(" ") : "User" }}
        </p>
      </button>
    </div>
  </div>
</template>

<script>
import Logo from "../layout/Logo.vue";
export default {
  name: "NavbarHome",
  components: { Logo },
  props: {
    user: Object,
    title: String,
  },
};
</script>
