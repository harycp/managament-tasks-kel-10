<template>
  <div
    class="rounded-full w-full h-full border-2 relative"
    :class="progress > 0 ? borderClass : 'border-[#9CA3AF]'"
  >
    <div
      class="absolute h-full top-0 left-0"
      :class="bgClass"
      :style="progressBar"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "gray-200", // Default color
    },
  },
  computed: {
    progressBar() {
      return `width: ${this.progress}%;`;
    },
    bgClass() {
      return {
        "bg-red-400": this.color === "red-400",
        "bg-orange-400": this.color === "orange-400",
        "bg-green-400": this.color === "green-400",
      };
    },
    borderClass() {
      return {
        "border-red-400": this.color === "red-400",
        "border-orange-400": this.color === "orange-400",
        "border-green-400": this.color === "green-400",
      };
    },
  },
};
</script>
