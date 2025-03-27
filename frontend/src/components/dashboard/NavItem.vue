<template>
  <router-link
    :to="link"
    :class="[
      isActive
        ? 'bg-blue-800 fill-white stroke-white text-white'
        : 'hover:bg-gray-100',
      AddClass,
    ]"
    class="flex items-center space-x-3 text-black font-semibold rounded-md p-4"
  >
    <slot></slot>
    <span>{{ title }}</span>
  </router-link>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavItem",
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    AddClass: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
