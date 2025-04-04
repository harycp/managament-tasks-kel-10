<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 shadow-sm backdrop-blur-md transition-all"
  >
    <div
      class="flex items-center justify-between mx-auto max-w-7xl px-6 py-4 sm:px-6 lg:px-8"
    >
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
        <button>
          <a href="/h">
            <svg
              class="w-6 h-6 text-gray-900 hover:text-gray-500 transition"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2h-4v2H8v2H6v2H4v2H2v2h2v10h7v-6h2v6h7V12h2v-2h-2V8h-2V6h-2V4h-2V2zm0 2v2h2v2h2v2h2v2h-2v8h-3v-6H9v6H6v-8H4v-2h2V8h2V6h2V4h4z"
              ></path></svg
          ></a>
        </button>
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

        <button class="flex items-center space-x-2">
          <img
            v-if="user"
            class="w-8 h-8 rounded-full border-2 border-white transition-opacity hover:opacity-70"
            :src="'https://randomuser.me/api/portraits/men/61.jpg'"
            :alt="user.name || 'User Avatar'"
            :title="user.name || 'User Avatar'"
          />
          <p class="text-sm font-medium text-gray-900 hover:text-gray-500">
            {{ user.name || "User" }}
          </p>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import Logo from "../layout/Logo.vue";
export default {
  name: "NavbarHome",
  components: { Logo },
  props: {
    user: Object,
  },
};
</script>
