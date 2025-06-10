<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Hapus Workspace</h2>
          <button @click="$emit('close')">
            <svg
              class="h-6 w-6 text-gray-600 hover:text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <p class="mb-6 text-sm text-gray-600">
          Apakah Anda yakin ingin menghapus workspace ini? Semua proyek dan
          tugas di dalamnya akan hilang selamanya. Tindakan ini tidak dapat
          dibatalkan.
        </p>

        <div class="flex justify-end gap-4">
          <PrimaryButton
            @click="$emit('close')"
            label="Batal"
            :additionalClass="'py-2 font-semibold'"
          />

          <PrimaryButton
            @click="$emit('confirm-delete')"
            label="Ya, Hapus Workspace"
            :inactive="isDeleting"
            :additionalClass="'py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700'"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import PrimaryButton from "../../components/common/PrimaryButton.vue";

export default {
  name: "DeleteWorkspace",
  components: {
    PrimaryButton,
  },
  props: {
    isOpen: Boolean,
    isDeleting: Boolean,
  },
  emits: ["close", "confirm-delete"],
};
</script>
