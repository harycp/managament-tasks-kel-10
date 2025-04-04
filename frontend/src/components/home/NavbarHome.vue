<template>
  <div class="flex items-center justify-between p-4 rounded-lg">
    <!-- Kiri: Judul Workspace -->
    <div class="flex items-center gap-2">
      <h1 class="text-lg font-bold text-gray-800">Inventaris</h1>
    </div>

    <!-- Kanan: Avatar & Actions -->
    <div class="flex items-center gap-4">
      <!-- Avatar Group -->
      <div class="flex -space-x-2">
        <img
          class="w-8 h-8 rounded-full border-2 border-white"
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Avatar 1"
        />
        <img
          class="w-8 h-8 rounded-full border-2 border-white"
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Avatar 2"
        />
        <img
          class="w-8 h-8 rounded-full border-2 border-white"
          src="https://randomuser.me/api/portraits/men/23.jpg"
          alt="Avatar 3"
        />
      </div>

      <!-- Tombol Share -->
      <button
        class="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-all duration-300"
      >
        Share
      </button>

      <!-- Ikon Chat/Comment -->
      <button class="text-gray-900 hover:text-gray-600">
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M20 2H2v20h2V4h16v12H6v2H4v2h2v-2h16V2h-2zM6 7h12v2H6V7zm8 4H6v2h8v-2z"
              fill="#000000"
            ></path>
          </g>
        </svg>
      </button>

      <!-- Avatar User Aktif -->
      <img
        class="w-10 h-10 rounded-full border-2 border-white"
        src="https://randomuser.me/api/portraits/women/65.jpg"
        alt="Active User"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "NavbarHome",
};
</script>
