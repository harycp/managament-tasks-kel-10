<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
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
      <div class="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Hapus Akun</h2>
          <button @click="$emit('close')">
            <svg
              class="w-4 h-4 text-gray-900 hover:text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
              ></path>
            </svg>
          </button>
        </div>

        <p class="text-sm text-gray-600 mb-6">
          Tindakan ini akan menghapus akun Anda secara permanen. Pastikan Anda
          yakin dengan keputusan ini.
        </p>

        <div class="flex justify-end gap-4">
          <PrimaryButton
            @click="$emit('close')"
            label="Batal"
            :additionalClass="'py-2 font-semibold'"
          />

          <PrimaryButton
            @click="handleSubmit"
            label="Hapus"
            :additionalClass="'py-2 text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import axios from "axios";
import { useFadeAlert } from "../../composables/useFadeAlert";
import { useFormValidation } from "../../composables/useFormValidation";
import { useRouter } from "vue-router";

import PrimaryButton from "../../components/common/PrimaryButton.vue";
import SessionAlert from "../../components/common/SessionAlert.vue";
import Logo from "../../components/layout/Logo.vue";
import InputLabel from "../../components/common/InputLabel.vue";
import TextInput from "../../components/common/TextInput.vue";
import EyeToggle from "../../components/common/EyeToggle.vue";

import ImageSuccess from "../../assets/register-success.svg";
import ImageFailed from "../../assets/register-failed.svg";

export default {
  setup() {
    const { errors } = useFormValidation();
    const { beforeEnter, enter, leave } = useFadeAlert();
    const router = useRouter();

    return {
      beforeEnter,
      enter,
      leave,
      errors,
      router,
    };
  },
  components: {
    Logo,
    InputLabel,
    TextInput,
    PrimaryButton,
    EyeToggle,
    SessionAlert,
  },
  data() {
    return {
      imageSrc: ImageSuccess,
      imageSrcFailed: ImageFailed,
      flashMessages: {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      },
    };
  },
  props: {
    user: Object,
    isOpen: Boolean,
  },
  emits: ["close"],
  methods: {
    async handleSubmit() {
      this.isButtonDisabled = true;

      try {
        const response = await axios.delete(
          `http://localhost/user-service/api/users/${this.user.id}`,
          { withCredentials: true }
        );

        const data = await response.data;

        if (data.error) {
          this.flashMessages.error = {
            title: "Hapus Akun Gagal",
            description: data.error || "Terjadi kesalahan saat menghapus akun.",
          };
          throw new Error(data.error || "Hapus akun gagal!");
        }

        this.flashMessages.success = {
          title: "Hapus Akun Berhasil",
          description: "Akun anda berhasil dihapus.",
        };

        setTimeout(async () => {
          await axios.post(
            "http://localhost/user-service/auth/logout",
            {},
            { withCredentials: true }
          );
          this.router.push("/login");
        }, 2000);
      } catch (error) {
        this.flashMessages.error = {
          title: "Hapus Akun Gagal",
          description: "Terjadi kesalahan saat menghapus akun.",
        };
        console.error("Error:", error);
      }
    },

    clearFlashMessage() {
      this.flashMessages = {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      };
    },
  },
};
</script>
