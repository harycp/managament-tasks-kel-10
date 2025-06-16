<template>
  <aside
    class="bg-gray-50 shadow-md p-4 rounded-lg flex flex-col transition-all duration-300"
    :class="{
      'w-16': isCollapsed,
      'w-1/5': !isCollapsed,
    }"
  >
    <!-- Logo / Inisial -->
    <div class="flex items-center mb-12" v-if="!isCollapsed">
      <Logo :ClassImg="'md:text-4xl'" :ClassTitle="'md:text-md'" />
    </div>

    <!-- Navigation Slot -->
    <nav class="flex-grow" v-if="!isCollapsed">
      <slot />
    </nav>

    <!-- Divider -->
    <div
      class="border-t border-gray-400 my-5"
      v-if="showLogout && !isCollapsed"
    ></div>

    <!-- Logout Button -->
    <div class="mt-auto" v-if="showLogout && !isCollapsed">
      <button
        @click="logout"
        class="text-gray-900 font-semibold flex items-center space-x-2 hover:text-gray-500 transition w-full"
      >
        <svg
          class="w-6 h-6 hover:text-gray-500 transition"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          transform="rotate(180)"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M5 3h16v4h-2V5H5v14h14v-2h2v4H3V3h2zm16 8h-2V9h-2V7h-2v2h2v2H7v2h10v2h-2v2h2v-2h2v-2h2v-2z"
            ></path>
          </g>
        </svg>
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>

    <!-- Tombol Collapse/Expand -->
    <div class="mt-auto pt-4" v-if="showCollapse">
      <button
        @click="$emit('toggle-collapse')"
        class="w-full flex justify-center items-center p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
        aria-label="Toggle sidebar"
        title="Collapse Button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 transition-transform duration-300"
          :class="{ 'rotate-0': isCollapsed }"
          viewBox="0 0 24 24"
          fill="none"
          transform="rotate(180)"
        >
          <path
            d="M13 7H3v2h10V7zm8 4h-2V9h-2V7h-2v2h2v2H3v2h14v2h-2v2h2v-2h2v-2h2v-2zM3 15h10v2H3v-2z"
            fill="#000000"
          />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import Logo from "../layout/Logo.vue";

export default defineComponent({
  name: "SideBar",
  components: {
    Logo,
  },
  props: {
    isCollapsed: {
      type: Boolean,
      required: true,
    },
    showCollapse: {
      type: Boolean,
      default: true,
    },
    showLogout: {
      type: Boolean,
      default: true, // default tampilkan tombol logout
    },
  },
  setup() {
    const router = useRouter();

    const logout = async () => {
      try {
        await axios.post(
          "https://localhost/user-service/auth/logout",
          {},
          {
            withCredentials: true,
          }
        );
        router.push("/login");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    return { logout };
  },
});
</script>
