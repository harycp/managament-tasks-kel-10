<template>
  <nav id="navbar" class="fixed top-0 left-0 w-full z-50 transition-all">
    <div
      class="flex items-center justify-between mx-auto max-w-7xl px-6 py-4 sm:px-6 lg:px-8"
    >
      <div class="flex items-center gap-12">
        <!-- Logo -->
        <a href="/" class="flex items-center group space-x-1">
          <p
            class="jacquarda-bastarda-9-regular text-5xl font-semibold group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out"
          >
            T
          </p>
          <p class="font-semibold text-xl flex">
            <span
              class="group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out delay-0"
              >u</span
            >
            <span
              class="group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out delay-100"
              >n</span
            >
            <span
              class="group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out delay-200"
              >t</span
            >
            <span
              class="group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out delay-300"
              >a</span
            >
            <span
              class="group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out delay-400"
              >s</span
            >
            <span
              class="group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out delay-500"
              >k</span
            >
          </p>
        </a>

        <!-- Menu -->
        <ul class="space-x-8 text-base font-medium md:flex">
          <li><a href="/">Home</a></li>
          <li><a href="/">Features</a></li>
          <li><a href="/">Pricing</a></li>
          <li><a href="/">About</a></li>
        </ul>
      </div>

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

<style scoped>
.jacquarda-bastarda-9-regular {
  font-family: "Jacquarda Bastarda 9", serif;
  font-weight: 400;
  font-style: normal;
}
</style>

<script>
import { onMounted, onUnmounted } from "vue";
import PrimaryButton from "../components/PrimaryButton.vue";

export default {
  components: {
    PrimaryButton,
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
