<template>
  <div class="relative w-full h-full bg-white">
    <Navbar />
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Hero Content -->
      <section class="py-20 flex justify-center items-center">
        <div class="flex flex-col w-full text-center">
          <h1 class="text-4xl font-bold text-gray-900">
            Tuntask
            <span class="text-gray-400">{{ displayedText }}</span>
            Bersama
          </h1>
          <h2 class="text-xl font-normal mt-4">
            Kelola tugas, atur tim, dan selesaikan proyek dalam satu platform.
          </h2>
          <div class="w-40 h-12 mx-auto mt-6">
            <PrimaryButton
              label="Bergabung"
              :additionalClass="'font-semibold'"
              btnType="link"
              path="/"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Navbar from "../../fragments/Navbar.vue";
import PrimaryButton from "../../components/PrimaryButton.vue";
export default {
  components: { Navbar, PrimaryButton },

  setup() {
    const words = ["Rancang", "Kerjakan", "Selesaikan"];
    const displayedText = ref("");
    let index = 0;
    let isDeleting = false;
    let currentWord = words[index];
    let charIndex = 0;
    const typingSpeed = 200;
    const erasingSpeed = 100;
    const delayBetweenWords = 1000;

    const typeEffect = () => {
      if (!isDeleting) {
        if (charIndex < currentWord.length) {
          displayedText.value += currentWord[charIndex];
          charIndex++;
          setTimeout(typeEffect, typingSpeed);
        } else {
          isDeleting = true;
          setTimeout(typeEffect, delayBetweenWords);
        }
      } else {
        if (charIndex > 0) {
          displayedText.value = displayedText.value.slice(0, -1);
          charIndex--;
          setTimeout(typeEffect, erasingSpeed);
        } else {
          isDeleting = false;
          index = (index + 1) % words.length;
          currentWord = words[index];
          setTimeout(typeEffect, typingSpeed);
        }
      }
    };

    onMounted(() => {
      typeEffect();
    });

    return { displayedText };
  },
};
</script>
