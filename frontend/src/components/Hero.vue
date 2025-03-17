<template>
  <section
    class="mt-20 md:mt-40 flex justify-start md:justify-center items-start md:items-center px-4"
  >
    <div class="flex flex-col w-full max-w-screen-md text-left md:text-center">
      <div
        class="font-lyon flex flex-wrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold justify-start md:justify-center gap-2 transition-all duration-500"
      >
        <span class="font-bold text-gray-900">{{ prefix }}</span>
        <div class="relative w-auto min-w-[8rem] text-center">
          <transition name="swing" mode="out-in">
            <span :key="displayedText" class="font-bold text-gray-300 block">
              {{ displayedText }}
            </span>
          </transition>
        </div>
        <span class="font-bold text-gray-900">{{ suffix }}</span>
      </div>
      <h2
        class="text-lg sm:text-xl md:text-2xl text-gray-600 font-normal mt-4 sm:mt-6"
      >
        Dimulai dari Rencana ke Realisasi, Tanpa Hambatan
      </h2>
      <div
        class="flex flex-col sm:flex-row md:flex-row justify-start md:justify-center w-full md:w-auto space-y-4 sm:space-y-0 sm:space-x-4 mx-auto md:mx-0 mt-6 sm:mt-8"
      >
        <div class="w-50">
          <PrimaryButton
            label="Bergabung"
            :additionalClass="'font-semibold bg-black text-white hover:bg-white hover:!text-black px-6 py-3'"
            btnType="link"
            path="/"
          />
        </div>
        <div class="w-50">
          <PrimaryButton
            label="Jelajah Fitur"
            :additionalClass="'font-bold px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'"
            btnType="link"
            path="#"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import PrimaryButton from "./PrimaryButton.vue";
export default {
  components: { PrimaryButton },
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

    return {
      displayedText,
      prefix,
      suffix,
    };
  },
};
</script>

<style scoped>
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
