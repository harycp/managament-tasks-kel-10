<template>
  <div
    class="w-72 bg-white border border-gray-200 rounded-xl shadow-sm flex-shrink-0 flex flex-col max-h-full relative"
  >
    <div
      class="drag-handle px-4 pt-3 pb-2 border-b border-gray-100 flex justify-between items-center cursor-move"
    >
      <input
        v-if="isEditingName"
        ref="inputListName"
        v-model="editedListName"
        @keyup.enter="saveListName"
        @blur="saveListName"
        @keyup.esc="cancelEdit"
        class="text-sm font-medium text-gray-800 bg-transparent border-b-2 border-gray-500 focus:outline-none w-full cursor-text"
      />
      <h3 v-else class="text-sm font-medium text-gray-800 truncate">
        {{ list.name }}
      </h3>

      <button
        @click.stop="toggleMenu"
        class="text-gray-400 hover:text-gray-600 text-xs ml-2 cursor-pointer"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
          ></path>
        </svg>
      </button>
    </div>

    <div
      v-if="isMenuOpen"
      ref="settingsMenu"
      class="absolute top-12 right-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
    >
      <ul>
        <li>
          <a
            @click.prevent="startEdit"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >Ubah Nama List</a
          >
        </li>
        <li>
          <a
            @click.prevent="promptForDelete"
            class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            >Hapus List Ini</a
          >
        </li>
      </ul>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-2">
      <div
        v-if="!list.tasks || list.tasks.length === 0"
        class="text-center text-sm text-gray-400 italic py-6"
      >
        No tasks yet
      </div>
    </div>

    <button
      class="mt-auto text-sm flex items-center gap-2 text-gray-500 hover:text-gray-600 px-4 py-2 text-left transition"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
      <span>Add a task</span>
    </button>

    <transition name="modal-fade">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        @click.self="cancelDelete"
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
                  viewBox="0 0 24 24"
                  fill="currentColor"
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
                      d="M3 3h16v2H5v14h14v2H3V3zm18 0h-2v18h2V3zM11 15h2v2h-2v-2zm2-8h-2v6h2V7z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">Hapus List</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-600">
                    {{ deleteConfirmationMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl"
          >
            <button
              @click="handleDeleteConfirm"
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:text-sm"
            >
              Ya, Hapus
            </button>
            <button
              @click="cancelDelete"
              class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ListComponent",
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isMenuOpen: false,
      isEditingName: false,
      editedListName: "",
      showDeleteConfirm: false, // State untuk kontrol modal
    };
  },
  computed: {
    // Computed property untuk membuat pesan dinamis
    deleteConfirmationMessage() {
      return `Apakah Anda yakin ingin menghapus list "${this.list.name}"? Semua task di dalamnya juga akan terhapus secara permanen. Aksi ini tidak dapat dibatalkan.`;
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    startEdit() {
      this.editedListName = this.list.name;
      this.isEditingName = true;
      this.closeMenu();
      this.$nextTick(() => {
        this.$refs.inputListName.focus();
      });
    },
    cancelEdit() {
      this.isEditingName = false;
      this.editedListName = "";
    },
    saveListName() {
      if (!this.isEditingName) return; // Mencegah double trigger
      if (
        this.editedListName.trim() &&
        this.editedListName !== this.list.name
      ) {
        this.$emit("update-list-name", {
          listId: this.list.id,
          newName: this.editedListName.trim(),
        });
      }
      this.isEditingName = false;
    },

    // Method untuk MEMBUKA modal
    promptForDelete() {
      this.showDeleteConfirm = true;
      this.closeMenu();
    },

    // Method saat user mengklik "Ya, Hapus"
    handleDeleteConfirm() {
      this.$emit("delete-list", this.list.id);
      this.showDeleteConfirm = false;
    },

    // Method saat user membatalkan
    cancelDelete() {
      this.showDeleteConfirm = false;
    },

    handleClickOutside(event) {
      if (
        this.$refs.settingsMenu &&
        !this.$refs.settingsMenu.contains(event.target)
      ) {
        this.closeMenu();
      }
    },
  },
  watch: {
    isMenuOpen(isOpen) {
      if (isOpen) {
        document.addEventListener("click", this.handleClickOutside, true);
      } else {
        document.removeEventListener("click", this.handleClickOutside, true);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  },
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
