<template>
  <section>
    <DashMain
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Workspace Settings"
    >
      <div class="max-w-2xl mx-auto p-6">
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
        <div class="bg-white border rounded-xl shadow-sm p-6 space-y-6">
          <h2 class="text-lg font-semibold text-gray-800">
            Workspace Settings
          </h2>
          <form @submit.prevent="saveSettings" class="space-y-4">
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
                v-model="form.name"
                required
              />
            </div>
            <div>
              <InputLabel
                for="typeWorkspace"
                label="Tipe Workspace"
                :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
              />
              <div class="relative">
                <select
                  v-model="form.type"
                  id="typeWorkspace"
                  class="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 text-base leading-6 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  required
                >
                  <option value="" disabled>Pilih tipe</option>
                  <option value="engineering_it">Engineering & IT</option>
                  <option value="human_resources">Human Resources</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales_crm">Sales & CRM</option>
                  <option value="operation">Operation</option>
                  <option value="small_business">Small Business</option>
                  <option value="education">Education</option>
                  <option value="student_organization">
                    Student Organization
                  </option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <InputLabel
                for="descriptionWorkspace"
                label="Deskripsi Workspace"
                :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
              />
              <textarea
                v-model="form.description"
                rows="3"
                class="h-22 border-2 w-full rounded-lg p-2.5 text-sm lg:text-base focus:outline-none focus:ring-opacity-50 sm:text-sm border-gray-400 focus:ring-gray-500 focus:borderring-gray-500 hover:border-primary"
              ></textarea>
            </div>

            <div class="h-10 mb-32">
              <PrimaryButton
                :inactive="isSubmitting"
                label="Simpan"
                type="submit"
                :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              />
            </div>
          </form>
        </div>
        <div
          class="mt-6 rounded-xl border border-red-200 bg-white p-6 shadow-sm"
        >
          <h2 class="text-lg font-semibold text-red-600">Danger Zone</h2>
          <p class="mt-1 text-sm text-gray-600">
            Tindakan menghapus workspace tidak dapat diurungkan. Mohon
            pertimbangkan dengan baik sebelum melanjutkan.
          </p>
          <div class="mt-4">
            <PrimaryButton
              @click="openDeleteModal"
              label="Hapus Workspace Ini"
              :additionalClass="'text-sm font-semibold bg-red-600 text-white hover:bg-red-700'"
            />
          </div>
        </div>
      </div>

      <DeleteWorkspacePopup
        :isOpen="isDeleteModalOpen"
        :is-deleting="isSubmitting"
        @close="closeDeleteModal"
        @confirm-delete="handleDeleteWorkspace"
      />
    </DashMain>
  </section>
</template>

<script>
import axios from "axios";
import { useFadeAlert } from "../../composables/useFadeAlert";
import DashMain from "../../fragments/DashMain.vue";
import InputLabel from "../../components/common/InputLabel.vue";
import TextInput from "../../components/common/TextInput.vue";
import PrimaryButton from "../../components/common/PrimaryButton.vue";
import SessionAlert from "../../components/common/SessionAlert.vue";

import ImageSuccess from "../../assets/register-success.svg";
import ImageFailed from "../../assets/register-failed.svg";
import DeleteWorkspacePopup from "../../components/common/DeleteWorkspacePopup.vue";

export default {
  name: "SettingsPage",
  components: {
    DashMain,
    InputLabel,
    TextInput,
    PrimaryButton,
    SessionAlert,
    DeleteWorkspacePopup,
  },
  emits: ["workspaceChanged"],
  data() {
    return {
      imageSrc: ImageSuccess,
      imageSrcFailed: ImageFailed,
      dashboardLoading: true,
      name: "Settings",
      isSubmitting: false,
      isDeleteModalOpen: false,
      form: {
        name: "",
        type: "",
        description: "",
      },
      flashMessages: {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      },
    };
  },
  computed: {
    workspaceId() {
      return this.$route.params.workspaceId;
    },
  },
  methods: {
    async fetchSettings() {
      if (!this.workspaceId) {
        console.error("Workspace ID not found.");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5002/api/workspaces/${this.workspaceId}`,
          {
            withCredentials: true,
          }
        );
        const ws = res.data.data;
        this.form.name = ws.name;
        this.form.type = ws.type;
        this.form.description = ws.description;
      } catch (err) {
        console.error("Failed to fetch workspace settings", err);
      }
    },
    async saveSettings() {
      this.clearFlashMessage();
      this.isSubmitting = true;
      if (!this.workspaceId) {
        console.error("Workspace ID not found.");
        this.isSubmitting = false;
        return;
      }
      try {
        await axios.put(
          `http://localhost:5002/api/workspaces/${this.workspaceId}`, // Gunakan computed property
          this.form,
          {
            withCredentials: true,
          }
        );

        this.$emit("workspaceChanged");

        this.flashMessages.success = {
          title: "Berhasil Disimpan!",
          description: "Berhasil Mengubah Workspace.",
        };

        await this.fetchSettings();
      } catch (err) {
        console.error("Failed to save settings", err);

        this.flashMessages.error = {
          title: "Gagal Menyimpan",
          description: "Terjadi kesalahan saat mengubah workspace.",
        };
      } finally {
        this.isSubmitting = false;
      }
    },
    openDeleteModal() {
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
    },
    async handleDeleteWorkspace() {
      this.clearFlashMessage();
      this.isSubmitting = true;

      try {
        const response = await axios.delete(
          `http://localhost:5002/api/workspaces/${this.workspaceId}`,
          { withCredentials: true }
        );

        const data = await response.data;

        if (!response) {
          this.flashMessages.error = {
            title: "Gagal Menghapus Workspace",
            description: "Kesalahan saat menghapus workspace",
          };
          throw new Error("Gagal menghapus workspace");
        }

        this.flashMessages.success = {
          title: "Workspace Berhasil Dihapus",
          description: "Workspace berhasil dihapus.",
        };

        this.closeDeleteModal();

        setTimeout(() => {
          this.$router.push("/h");
        }, 2000);
      } catch (err) {
        console.error("Failed to delete workspace", err);

        this.flashMessages.error = {
          title: "Gagal Menghapus Workspace",
          description: "Kesalahan saat menghapus workspace",
        };

        this.closeDeleteModal();
        
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
  mounted() {
    document.title = "Settings | Tuntask";
    this.fetchSettings();
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
