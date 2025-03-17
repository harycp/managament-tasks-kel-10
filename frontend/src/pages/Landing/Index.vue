<template>
  <div class="relative w-full h-full bg-white">
    <Navbar />
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Hero Content -->
      <Hero />

      <!-- Demo Content -->
      <Demo />

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
import { ref } from "vue";
import Navbar from "../../fragments/Navbar.vue";
import Footer from "../../fragments/Footer.vue";
import PrimaryButton from "../../components/PrimaryButton.vue";
import Hero from "../../components/Hero.vue";
import Demo from "../../components/Demo.vue";

export default {
  components: { Navbar, Footer, PrimaryButton, Hero, Demo },

  setup() {
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

    const projects = ref([
      {
        name: "Operations",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 8v4l3 3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      },
      {
        name: "IT Projects",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path d="M3 5h18M3 12h18M3 19h18M5 5v14M19 5v14" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      },
      {
        name: "Task Management",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path d="M5 12l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      },
      {
        name: "Admin & Settings",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 8v4l3 3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      },
      {
        name: "Project Management",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="8" cy="6" r="2" fill="currentColor"/>
          <circle cx="8" cy="12" r="2" fill="currentColor"/>
          <circle cx="8" cy="18" r="2" fill="currentColor"/>
        </svg>`,
      },
    ]);

    // State untuk tracking mana yang expanded
    const expanded = ref(experiences.value.map(() => false));

    // Toggle fungsi expand/collapse
    const toggleExpand = (index) => {
      expanded.value[index] = !expanded.value[index];
    };

    return {
      experiences,
      expanded,
      toggleExpand,
      projects,
    };
  },
};
</script>
