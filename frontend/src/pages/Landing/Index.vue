<template>
  <div class="relative w-full h-full bg-white">
    <Navbar />
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Hero Content -->
      <section class="mt-20 flex justify-center items-center">
        <div class="flex flex-col w-full text-center">
          <div
            class="flex text-6xl justify-center items-center gap-2 transition-all duration-500"
          >
            <span class="font-bold text-gray-900">{{ prefix }}</span>
            <div class="relative w-auto min-w-[8rem] text-center">
              <transition name="swing" mode="out-in">
                <span
                  :key="displayedText"
                  class="font-bold text-gray-400 block"
                >
                  {{ displayedText }}
                </span>
              </transition>
            </div>
            <span class="font-bold text-gray-900">{{ suffix }}</span>
          </div>
          <h2 class="text-xl font-normal mt-4">
            Kelola tugas, atur tim, dan selesaikan proyek dalam satu platform.
          </h2>
          <div class="w-40 h-12 mx-auto mt-4">
            <PrimaryButton
              label="Bergabung"
              :additionalClass="'font-bold'"
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
    const displayedText = ref(words[0]);
    let index = 0;

    const prefix = ref("Tuntask");
    const suffix = ref("Bersama");

    onMounted(() => {
      setInterval(() => {
        index = (index + 1) % words.length;
        displayedText.value = words[index];
      }, 6000);
    });

    return { displayedText, prefix, suffix };
  },
};
</script>

<style>
.swing-enter-active,
.swing-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.swing-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.swing-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
