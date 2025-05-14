<template>
  <div>
    <div class="relative">
      <!-- Dropdown Button -->
      <div
        class="flex flex-row gap-3 items-center text-black font-semibold rounded-md p-3 cursor-pointer"
        @click="toggleDropdown"
        :class="isActive ? 'bg-blue-800 text-white' : 'hover:bg-gray-100'"
      >
        <slot></slot>

        <span>{{ title }}</span>

        <svg
          :class="isOpen ? '-rotate-90' : 'rotate-0'"
          class="ms-auto pointer-events-none w-5 h-5 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <!-- Dropdown Content -->
      <div v-if="isOpen" class="mt-2 z-20">
        <ul>
          <li
            v-for="option in options"
            :key="option.label"
            class="block py-2 ms-9 hover:text-gray-900 cursor-pointer transform transition-transform duration-400 ease-in-out hover:translate-x-2"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavDropdown",
  props: {
    options: { type: Array, default: () => [] },
    title: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  data() {
    return {
      isOpen: false,
      selectedOption: null,
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedOption = option.label;
      this.isOpen = false;
      this.$emit("option-selected", option);
      this.$router.push(option.route);
    },
  },
};
</script>
