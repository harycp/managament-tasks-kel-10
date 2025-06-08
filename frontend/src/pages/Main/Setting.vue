<template>
  <section>
    <DashMain
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Workspace Settings"
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
      <div class="max-w-2xl mx-auto p-6">
        <div class="bg-white border rounded-xl shadow-sm p-6 space-y-6">
          <h2 class="text-lg font-semibold text-gray-800">
            Workspace Settings
          </h2>
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
                <!-- Custom arrow -->
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
                :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              />
            </div>
          </form>
          <!-- Delete Workspace -->
          <div class="pt-6 border-t mt-10">
            <h3 class="text-sm font-semibold text-red-600 mb-2">Danger Zone</h3>
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-700">
                Menghapus workspace akan menghapus semua data terkait.
              </p>
              <button
                @click="confirmDelete"
                class="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
              >
                Hapus Workspace
              </button>
            </div>
          </div>
        </div>
      </div>
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

import ImageSuccess from "../../assets/register-success.svg";
import ImageFailed from "../../assets/register-failed.svg";

export default {
  name: "SettingsPage",
  components: { DashMain, InputLabel, TextInput, PrimaryButton },
  props: {
    workspaceId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imageSrc: ImageSuccess,
      imageSrcFailed: ImageFailed,
      dashboardLoading: true,
      name: "Settings",
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
  methods: {
    async fetchSettings() {
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
      try {
        await axios.put(
          `http://localhost:5002/api/workspaces/${this.workspaceId}`,
          this.form,
          {
            withCredentials: true,
          }
        );
        alert("Settings saved successfully!");
      } catch (err) {
        console.error("Failed to save settings", err);
        alert("Failed to save. Please try again.");
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
