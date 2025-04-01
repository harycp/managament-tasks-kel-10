<template>
  <div
    class="w-full h-full rounded-md flex px-2 gap-1"
    :class="active ? borderClass : 'text-[#9CA3AF] bg-[#F9FAFB]'"
  >
    <svg
      v-if="active"
      class="w-3"
      :class="strokeClass"
      viewBox="0 0 11 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.72727 0.5L3.72727 6.5L1 3.77273"
        :stroke="strokeColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "gray-200", // Default color
    },
  },
  computed: {
    strokeClass() {
      return {
        "stroke-red-400": this.color === "red-400",
        "stroke-orange-400": this.color === "orange-400",
        "stroke-green-400": this.color === "green-400",
      };
    },
    strokeColor() {
      return this.color;
    },
    borderClass() {
      return `border border-${this.color} bg-white text-${this.color}`;
    },
  },
};
</script>
