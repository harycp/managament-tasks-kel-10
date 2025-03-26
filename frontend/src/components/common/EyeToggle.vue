<template>
  <div
    @click="toggle"
    :class="addClass"
    class="select-none ps-4 cursor-pointer"
  >
    <!-- Show eye icon if showPassword is true -->
    <svg
      v-if="showPassword"
      xmlns="http://www.w3.org/2000/svg"
      :class="[
        'w-6 h-6',
        isActive ? 'text-gray-400' : 'text-gray-400 hover:text-gray-900',
      ]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Show eye closed icon if showPassword is false -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      :class="[
        'w-6 h-6',
        isActive ? 'text-gray-400' : 'text-gray-400 hover:text-gray-900',
      ]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1 1L23 23"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    showPassword: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    addClass: {
      type: String,
      default: "",
    },
  },
  methods: {
    toggle() {
      this.$emit("toggle"); // Emit toggle event to parent
    },
  },
};
</script>
