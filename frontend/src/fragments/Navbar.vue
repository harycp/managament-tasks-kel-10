<template>
  <nav id="navbar" class="fixed top-0 left-0 w-full z-50 transition-all">
    <div
      class="flex items-center justify-between mx-auto max-w-7xl px-6 py-4 sm:px-6 lg:px-8"
    >
      <div class="flex items-center gap-12">
        <!-- Logo -->
        <Logo />
        <!-- Menu -->
        <ul class="space-x-8 text-base font-medium md:flex">
          <li><a href="/">Home</a></li>
          <li><a href="/">Features</a></li>
          <li><a href="/">Pricing</a></li>
          <li><a href="/">About</a></li>
        </ul>
      </div>
   <!-- "border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md hover:bg-gray-50 transition" -->
      <!-- Tombol Login di Pojok Kanan -->
      <div class="flex space-x-2">
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
    </div>
  </nav>
</template>

<script>
import { onMounted, onUnmounted } from "vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import Logo from "../components/Logo.vue";

export default {
  components: {
    PrimaryButton,
    Logo,
  },
  setup() {
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
  },
};
</script>
