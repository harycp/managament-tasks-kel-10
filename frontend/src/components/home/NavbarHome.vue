<template>
  <div
    class="flex flex-row items-center justify-between p-4 bg-white rounded-lg"
  >
    <p class="ms-2 text-gray-900 font-semibold text-xl">{{ title }}</p>
    <div class="me-4 flex items-center space-x-4">
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
