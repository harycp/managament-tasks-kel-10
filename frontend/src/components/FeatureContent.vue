<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-0">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold text-notion-black mb-6">
            Kelola Tugas dengan Mudah.
          </h2>
          <p class="text-gray-600 mb-8">
            Atur dan lacak semua tugas dari yang sederhana hingga kompleks
            dengan sistem yang fleksibel.
          </p>

          <div class="mt-12 space-y-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <img
                  src="../assets/task.svg"
                  alt="Building blocks"
                  class="w-6 h-6"
                />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-notion-black">
                  Buat & Atur Tugas
                </h3>
                <p class="text-gray-600">
                  Tambahkan tugas dengan detail lengkap sesuai kebutuhan proyek.
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
                <h3 class="text-lg font-medium text-notion-black">
                  Pantau Perkembangan
                </h3>
                <p class="text-gray-600">
                  Lihat progres setiap tugas dalam tampilan yang jelas.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <img
                  src="../assets/due.svg"
                  alt="AI-assisted"
                  class="w-6 h-6"
                />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-notion-black">
                  Tetapkan Deadline
                </h3>
                <p class="text-gray-600">
                  Pastikan semua tugas selesai tepat waktu dengan pengingat.
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
  name: "FeatureContent",
};
</script>
