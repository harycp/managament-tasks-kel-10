<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <SessionAlert
          v-if="flashMessages.error.title"
          btnTitle="Periksa Kembali"
          :title="flashMessages.error.title"
          :image="imageSrcFailed"
          @close-alert="clearFlashMessage"
        >
          {{ flashMessages.error.description }}
        </SessionAlert>

        <SessionAlert
          v-else-if="flashMessages.success.title"
          btnTitle="Tutup"
          :title="flashMessages.success.title"
          :image="imageSrc"
          @close-alert="clearFlashMessage"
        >
          {{ flashMessages.success.description }}
        </SessionAlert>
      </transition>
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Buat Workspace</h2>
          <button
            @click="closePopup"
            class="text-gray-600 hover:text-gray-800 text-xl"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 
                1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 
                1.414L10 11.414l-4.293 4.293a1 1 0 
                01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 
                010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <InputLabel
              for="nameBoard"
              label="Nama Board"
              :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
            />
            <TextInput
              id="nameBoard"
              type="text"
              name="nameBoard"
              placeholder="Masukkan nama board"
              autocomplete="current-nameBoard"
              v-model="form.nameBoard"
              required
            />
          </div>
          <div>
            <InputLabel
              for="visibilityBoard"
              label="Tipe Visibilitas"
              :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
            />
            <select
              v-model="form.visibilityBoard"
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="" disabled>Pilih tipe</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div class="h-10 mb-32">
            <PrimaryButton
              :inactive="isSubmitting"
              :label="isSubmitting ? 'Menyimpan...' : 'Simpan'"
              :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
            />
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script>
import axios from "axios";
import { useFadeAlert } from "../../composables/useFadeAlert";
import InputLabel from "./InputLabel.vue";
import TextInput from "./TextInput.vue";
import PrimaryButton from "./PrimaryButton.vue";
import SessionAlert from "./SessionAlert.vue";

import ImageSuccess from "../../assets/register-success.svg";
import ImageFailed from "../../assets/register-failed.svg";

export default {
  components: { InputLabel, TextInput, PrimaryButton, SessionAlert },
  props: {
    isOpen: Boolean,
    user: Object,
    workspace: Object,
  },
  emits: ["close", "boardCreated"],
  data() {
    return {
      imageSrc: ImageSuccess,
      imageSrcFailed: ImageFailed,
      form: {
        nameBoard: "",
        visibilityBoard: "",
      },
      flashMessages: {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      },
      isSubmitting: false,
      error: null,
    };
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    async submitForm() {
      this.isSubmitting = true;
      this.error = null;

      try {
        const payload = {
          name: this.form.nameBoard,
          visibility: this.form.visibilityBoard,
          workspace_id: this.workspace.id,
        };

        const response = await axios.post(
          `http://localhost/project-service/api/workspaces/${this.workspace.id}/boards`,
          {
            ...payload,
          },
          {
            withCredentials: true,
          }
        );

        const data = await response.data;

        if (!response) {
          this.flashMessages.error = {
            title: "Gagal Membuat Board",
            description: data.error || "Kesalahan saat membuat board",
          };
          throw new Error(data.error || "Gagal membuat board");
        }

        this.flashMessages.success = {
          title: "Board Berhasil Dibuat",
          description: "Board telah berhasil dibuat",
        };

        this.form = {
          nameBoard: "",
          visibilityBoard: "",
        };

        setTimeout(() => {
          // Emit event ke parent agar bisa refetch data
          this.$emit("boardCreated");
          this.closePopup();
        }, 2000);
      } catch (err) {
        console.log(err);
        this.form = {
          nameBoard: "",
          visibilityBoard: "",
        };

        this.flashMessages.error = {
          title: "Gagal Membuat Board",
          description: "Terjadi kesalahan saat membuat board",
        };

        setTimeout(() => {
          this.isSubmitting = false;
        }, 1000);
      }
    },

    clearFlashMessage() {
      this.flashMessages = {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      };
    },
  },

  setup() {
    const { beforeEnter, enter, leave } = useFadeAlert();

    return {
      beforeEnter,
      enter,
      leave,
    };
  },
};
</script>
