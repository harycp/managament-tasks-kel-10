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

      <!-- Demo Content -->
      <section class="mt-20 flex justify-center items-center">
        <h1>Under Construction</h1>
      </section>

      <!-- Features Content -->
      <section class="mt-20">
        <div class="flex flex-col lg:flex-row gap-16">
          <div class="flex flex-col w-full gap-16 lg:w-1/2">
            <div
              v-for="(experience, index) in experiences"
              :key="index"
              class="w-full"
            >
              <div class="flex flex-col w-full">
                <div class="flex flex-col gap-8 w-full">
                  <div class="flex gap-2 lg:gap-8 w-full border-gray-0 pb-4">
                    <div class="flex flex-col gap-4 w-11/12">
                      <div class="flex flex-col gap-2">
                        <div class="flex gap-4 items-center">
                          <h2
                            class="font-semibold text-2xl text-gray-900 leading-snug md:text-xl md:leading-8 break-words"
                          >
                            {{ experience.name }}
                          </h2>
                        </div>

                        <div class="flex items-center justify-between">
                          <div
                            class="flex flex-col 2xl:flex-row gap-2 2xl:gap-4"
                          >
                            <span
                              class="whitespace-nowrap text-xl font-medium text-start text-gray-900"
                            >
                              {{ experience.subTitle }}
                            </span>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <div
                            class="flex flex-col 2xl:flex-row gap-2 2xl:gap-4"
                          >
                            <span
                              class="whitespace-nowrap text-base font-medium text-start text-gray-900"
                            >
                              {{ experience.description }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- End of v-for -->
          </div>

          <div class="flex flex-col gap-4 lg:w-1/2 h-fit lg:sticky top-32">
            <div class="text-sm leading-7 text-justify text-gray-900">
              <p>ICON / IMAGE</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section>
      <Footer />
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Navbar from "../../fragments/Navbar.vue";
import Footer from "../../fragments/Footer.vue";
import PrimaryButton from "../../components/PrimaryButton.vue";

export default {
  components: { Navbar, Footer, PrimaryButton },

  setup() {
    const words = ["Rancang", "Kerjakan", "Selesaikan"];
    const displayedText = ref(words[0]);
    let index = 0;

    const prefix = ref("Tuntask");
    const suffix = ref("Bersama");

    const experiences = ref([
      {
        id: 1,
        name: "Task Management",
        subTitle: "Atur & Lacak Semua Tugas dengan Mudah",
        description:
          "Kelola tugas dari yang sederhana hingga kompleks dengan sistem yang fleksibel.",
      },
      {
        id: 2,
        name: "Workspaces",
        subTitle: "Organisasi Proyek yang Lebih Terstruktur",
        description:
          "Kelompokkan proyek dalam berbagai workspace untuk tim yang lebih rapi.",
      },
      {
        id: 3,
        name: "Real-Time Notifications",
        subTitle: "Selalu Terhubung dengan Perkembangan Proyek",
        description:
          "Tidak ada lagi tugas terlewat dengan sistem notifikasi real-time.",
      },
      {
        id: 4,
        name: "Project Board",
        subTitle: "Visualisasi Pekerjaan dengan Board Interaktif",
        description:
          "Gunakan tampilan board yang intuitif untuk mengatur tugas dan proyek.",
      },
      {
        id: 5,
        name: "Role & Permission",
        subTitle: "Hak Akses yang Aman & Terkontrol",
        description:
          "Berikan peran sesuai kebutuhan tim dengan sistem hak akses yang fleksibel.",
      },
    ]);

    // State untuk tracking mana yang expanded
    const expanded = ref(experiences.value.map(() => false));

    // Toggle fungsi expand/collapse
    const toggleExpand = (index) => {
      expanded.value[index] = !expanded.value[index];
    };

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
      experiences,
      expanded,
      toggleExpand,
    };
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
