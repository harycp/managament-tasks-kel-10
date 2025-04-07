<template>
  <aside class="w-1/5 bg-gray-50 shadow-md p-4 rounded-lg flex flex-col">
    <!-- Logo -->
    <div class="flex items-center ms-3 mb-12">
      <Logo :ClassImg="'md:text-4xl'" :ClassTitle="' md:text-md'" />
    </div>

    <!-- Navigation Slot -->
    <nav class="flex-grow">
      <slot />
    </nav>

    <div class="border-t border-gray-400 mb-5 w-full mx-auto"></div>
    <div class="mt-auto">
      <button
        @click="logout"
        class="text-black font-semibold flex items-center space-x-2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
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
              fill="#000000"
            ></path>
          </g>
        </svg>

        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import Logo from "../layout/Logo.vue";
import NavItem from "./NavItem.vue";

export default defineComponent({
  name: "SideBar",
  components: {
    Logo,
    NavItem,
    RouterLink,
  },
  setup() {
    const router = useRouter();

    const logout = async () => {
      try {
        await axios.post(
          "http://localhost:5001/auth/logout",
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
