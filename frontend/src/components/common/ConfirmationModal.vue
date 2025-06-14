<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4"
    >
      <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
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
          {{ message }}
        </p>

        <div class="flex justify-end gap-4">
          <PrimaryButton
            @click="$emit('close')"
            label="Cancel"
            :additionalClass="'py-2 font-semibold'"
          />

          <PrimaryButton
            @click="$emit('confirm')"
            label="Delete"
            :inactive="isDeleting"
            :additionalClass="'py-2 text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import PrimaryButton from "./PrimaryButton.vue";
export default {
  name: "ConfirmationModal",
  components: { PrimaryButton },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Konfirmasi Aksi",
    },
    message: {
      type: String,
      default: "Apakah Anda yakin ingin melanjutkan?",
    },
    confirmText: {
      type: String,
      default: "Konfirmasi",
    },
    cancelText: {
      type: String,
      default: "Batal",
    },
  },
  emits: ["confirm", "close"],
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
