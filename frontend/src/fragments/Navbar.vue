<template>
  <nav id="navbar" class="fixed top-0 left-0 w-full z-50 transition-all">
    <div
      class="flex items-center justify-between mx-auto max-w-7xl px-6 py-4 sm:px-6 lg:px-8"
    >
      <div class="flex items-center gap-12">
        <!-- Logo -->
        <Logo />
        <!-- Menu (Hidden di Mobile) -->
        <ul class="hidden md:flex space-x-8 text-base font-medium">
          <li><a href="/">Home</a></li>
          <li><a href="/">Features</a></li>
          <li><a href="/">Pricing</a></li>
          <li><a href="/">About</a></li>
        </ul>
      </div>
      <!-- Tombol Login & Hamburger -->
      <div class="flex items-center space-x-4">
        <div class="hidden md:flex space-x-2">
          <div class="w-20 h-10">
            <PrimaryButton
              label="Log in"
              :additionalClass="'font-semibold'"
              btnType="link"
              path="/login"
            />
          </div>
          <div class="w-20 h-10">
            <PrimaryButton
              label="Sign Up"
              :additionalClass="'font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              btnType="link"
              path="/signup"
            />
          </div>
        </div>
        <!-- Hamburger Icon -->
        <button class="md:hidden" @click="toggleMenu">
          <svg
            v-if="!isOpen"
            class="w-8 h-8 text-black"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
          <svg
            v-else
            class="w-8 h-8 text-black"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-white z-40 flex flex-col w-full h-screen px-6 py-8 space-y-6 shadow-lg"
      >
        <!-- Close Button -->
        <button class="self-end" @click="toggleMenu">
          <svg
            class="w-8 h-8 text-black"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <!-- Mobile Links -->
        <ul class="flex flex-col text-lg font-semibold space-y-6">
          <li><a href="/" class="block py-2">Home</a></li>
          <li><a href="/" class="block py-2">Features</a></li>
          <li><a href="/" class="block py-2">Pricing</a></li>
          <li><a href="/" class="block py-2">About</a></li>
        </ul>
        <hr />
        <!-- Mobile Login Buttons -->
        <div class="flex flex-col space-y-4">
          <div class="h-10">
            <PrimaryButton label="Log in" btnType="link" path="/login" />
          </div>
          <div class="h-10">
            <PrimaryButton
              label="Sign Up"
              :additionalClass="'font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              btnType="link"
              path="/signup"
            />
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import Logo from "../components/Logo.vue";

export default {
  components: { PrimaryButton, Logo },
  setup() {
    const isOpen = ref(false);

    const toggleMenu = () => {
      isOpen.value = !isOpen.value;
    };

    const handleScroll = () => {
      const navbar = document.querySelector("#navbar");
      if (!navbar) return;

      if (window.scrollY > 10) {
        navbar.classList.add("bg-white/40", "backdrop-blur-md");
      } else {
        navbar.classList.remove("bg-white/40", "backdrop-blur-md");
      }
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      isOpen,
      toggleMenu,
    };
  },
};
</script>

<style scoped>
/* Animasi Slide */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from {
  transform: translateY(-100%);
}

.slide-leave-to {
  transform: translateY(-100%);
}
</style>
