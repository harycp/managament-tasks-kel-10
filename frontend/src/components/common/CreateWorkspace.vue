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
              for="nameWorkspace"
              label="Nama Workspace"
              :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
            />
            <TextInput
              id="nameWorkspace"
              type="text"
              name="nameWorkspace"
              placeholder="Masukkan nama workspace"
              autocomplete="current-nameWorkspace"
              v-model="form.nameWorkspace"
              required
            />
          </div>
          <div>
            <InputLabel
              for="typeWorkspace"
              label="Tipe Workspace"
              :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
            />
            <select
              v-model="form.typeWorkspace"
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="" disabled>Pilih tipe</option>
              <option value="engineering_it">Engineering & IT</option>
              <option value="human_resources">Human Resources</option>
              <option value="marketting">Marketing</option>
              <option value="sales_crm">Sales & CRM</option>
              <option value="operation">Operation</option>
              <option value="small_business">Small Business</option>
              <option value="education">Education</option>
              <option value="student_organization">Student Organization</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <InputLabel
              for="descriptionWorkspace"
              label="Deskripsi Workspace"
              :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
            />
            <textarea
              v-model="form.descriptionWorkspace"
              rows="3"
              class="h-22 border-2 w-full rounded-lg p-2.5 text-sm lg:text-base focus:outline-none focus:ring-opacity-50 sm:text-sm border-gray-400 focus:ring-gray-500 focus:borderring-gray-500 hover:border-primary"
            ></textarea>
          </div>

          <div class="h-10 mb-32">
            <PrimaryButton
              :inactive="isSubmitting"
              label="Simpan"
              :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
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
  },
  emits: ["close", "workspaceCreated"],
  data() {
    return {
      imageSrc: ImageSuccess,
      imageSrcFailed: ImageFailed,
      form: {
        nameWorkspace: "",
        typeWorkspace: "",
        descriptionWorkspace: "",
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
          name: this.form.nameWorkspace,
          type: this.form.typeWorkspace,
          description: this.form.descriptionWorkspace,
          owner_id: this.user.id,
        };

        const response = await axios.post(
          "https://localhost/workspace-service/api/workspaces",
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
            title: "Gagal Membuat Workspace",
            description: data.error || "Kesalahan saat membuat workspace",
          };
          throw new Error(data.error || "Gagal membuat workspace");
        }

        this.flashMessages.success = {
          title: "Workspace Berhasil Dibuat",
          description: "Workspace telah berhasil dibuat",
        };

        // Emit event ke parent agar bisa refetch data
        this.$emit("workspaceCreated");

        this.form = {
          nameWorkspace: "",
          typeWorkspace: "",
          descriptionWorkspace: "",
        };

        setTimeout(() => {
          // Emit event ke parent agar bisa refetch data
          this.$emit("workspaceCreated");
          this.closePopup();
        }, 2000);
      } catch (err) {
        console.log(err);
        this.form = {
          nameWorkspace: "",
          typeWorkspace: "",
          descriptionWorkspace: "",
        };

        this.flashMessages.error = {
          title: "Gagal Membuat Workspace",
          description: "Terjadi kesalahan saat membuat workspace",
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
