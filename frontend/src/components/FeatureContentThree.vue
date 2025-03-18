<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="mx-auto w-full max-w-7xl px-4 py-6 lg:py-8">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2
            class="text-lg sm:text-xl md:text-3xl font-bold text-notion-black mb-5"
          >
            Board Interaktif.
          </h2>
          <p class="text-gray-500 text-base mb-8">
            Gunakan tampilan board yang intuitif untuk mengatur tugas dan proyek
            dengan lebih efektif.
          </p>

          <div class="mt-12 space-y-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <img
                  src="../assets/dragdrop.svg"
                  alt="Building blocks"
                  class="w-6 h-6"
                />
              </div>
              <div class="ml-4">
                <h3
                  class="text-base sm:text-base md:text-lg font-medium text-notion-black"
                >
                  Seret & Lepas
                </h3>
                <p class="text-gray-500 text-base">
                  Atur tugas dengan mudah melalui fitur drag & drop.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <img
                  src="../assets/pantau.svg"
                  alt="Collaborative tools"
                  class="w-6 h-6"
                />
              </div>
              <div class="ml-4">
                <h3
                  class="text-base sm:text-base md:text-lg font-medium text-notion-black"
                >
                  Filter & Label
                </h3>
                <p class="text-gray-500 text-base">
                  Kelompokkan tugas berdasarkan kategori, prioritas, atau
                  deadline.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <img
                  src="../assets/fleksibel.svg"
                  alt="AI-assisted"
                  class="w-6 h-6"
                />
              </div>
              <div class="ml-4">
                <h3
                  class="text-base sm:text-base md:text-lg font-medium text-notion-black"
                >
                  Tampilan yang Fleksibel
                </h3>
                <p class="text-gray-500 text-base">
                  Gunakan tampilan grid atau list sesuai kebutuhan tim.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg overflow-hidden shadow-xl">
          <!-- <img
              src="../assets/kelolaTugas.png"
              alt="Document editing in Notion"
              class="w-full"
            /> -->
          <h1>This is an Image of that feature</h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FeatureContentThree",
};
</script>
