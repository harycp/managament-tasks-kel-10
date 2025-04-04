<template>
  <div class="flex items-center justify-between">
    <!-- Kiri: Logo + Navigasi -->
    <div class="flex items-center space-x-8">
      <!-- Logo -->
      <Logo />

      <!-- Dropdown Menu -->
      <div
        class="flex items-center space-x-6 text-sm font-medium text-gray-900"
      >
        <button class="hover:text-gray-500">Workspaces</button>
        <button class="hover:text-gray-500">Recent</button>
        <button class="hover:text-gray-500">Starred</button>
        <button class="hover:text-gray-500">Templates</button>
      </div>
    </div>

    <div class="flex items-center space-x-4">
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

      <button>
        <img
          class="w-8 h-8 rounded-full border-2 border-white transition-opacity hover:opacity-70"
          src="https://randomuser.me/api/portraits/women/65.jpg"
          alt="User Avatar"
        />
      </button>
    </div>
  </div>
</template>

<script>
import Logo from "../layout/Logo.vue";
export default {
  name: "NavbarHome",
  components: { Logo },
};
</script>
