<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
      >
        <div class="px-6 py-5">
          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
            >
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-600">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl"
        >
          <button
            @click="$emit('confirm')"
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          >
            {{ confirmText }}
          </button>
          <button
            @click="$emit('close')"
            type="button"
            class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ConfirmationModal",
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
