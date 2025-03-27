<template>
  <div>
    <div class="relative">
      <!-- Dropdown Button -->
      <div
        class="flex flex-row gap-3 items-center text-black font-semibold rounded-md p-4 cursor-pointer"
        @click="toggleDropdown"
        :class="isActive ? 'bg-blue-800 text-white' : 'hover:bg-gray-100'"
      >
        <slot></slot>

        <span>{{ selectedWorkspace ? selectedWorkspace.name : title }}</span>

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
            :key="option.routeName"
            class="block py-2 ms-9 hover:text-gray-900 cursor-pointer transform transition-transform duration-400 ease-in-out hover:translate-x-2"
            @click="selectWorkspace(option)"
          >
            {{ option.name }}
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
      selectedWorkspace: null,
    };
  },
  watch: {
    options: {
      handler(newOptions) {
        if (newOptions.length > 0 && !this.selectedWorkspace) {
          this.selectedWorkspace = newOptions[0];
          this.$emit("update:modelValue", this.selectedWorkspace.name);
        }
      },
      immediate: true,
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectWorkspace(option) {
      this.selectedWorkspace = option;
      this.isOpen = false;
      this.$emit("update:modelValue", option.name);
      this.$router.push(option.routeName);
    },
  },
};
</script>
