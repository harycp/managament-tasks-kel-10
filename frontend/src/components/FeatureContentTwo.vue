<template>
  <section class="py-16 md:py-24 bg-gray-100">
    <div class="mx-auto w-full max-w-7xl px-4 py-6 lg:py-8">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Gambar Sekarang di Kiri -->
        <div class="rounded-lg overflow-hidden shadow-xl">
          <!-- <img
              src="../assets/kelolaTugas.png"
              alt="Document editing in Notion"
              class="w-full"
            /> -->
          <h1>This is an Image of that feature</h1>
        </div>

        <!-- Konten Sekarang di Kanan -->
        <div>
          <h2 class="text-3xl font-bold text-notion-black mb-6">
            Workspaces Terstruktur.
          </h2>
          <p class="text-gray-600 mb-8">
            Kelompokkan proyek dalam berbagai workspace untuk tim yang lebih
            rapi.
          </p>

          <div class="mt-12 space-y-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <img
                  src="../assets/trophy.svg"
                  alt="Building blocks"
                  class="w-6 h-6"
                />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-notion-black">
                  Proyek Lebih Terorganisir
                </h3>
                <p class="text-gray-600">
                  Pisahkan proyek berdasarkan tim atau kategori yang berbeda.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <img
                  src="../assets/kolaborasi.svg"
                  alt="Collaborative tools"
                  class="w-6 h-6"
                />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-notion-black">
                  Kolaborasi Lebih Mudah
                </h3>
                <p class="text-gray-600">
                  Ajak anggota tim untuk bekerja bersama dalam satu workspace.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <img
                  src="../assets/terpusat.svg"
                  alt="AI-assisted"
                  class="w-6 h-6"
                />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-notion-black">
                  Dokumen Terpusat
                </h3>
                <p class="text-gray-600">
                  Simpan semua informasi proyek dalam satu tempat yang mudah
                  diakses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FeatureContentTwo",
};
</script>
