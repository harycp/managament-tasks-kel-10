<template>
  <section class="relative">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <SessionAlert
          v-if="flashMessages.error.title"
          btnTitle="Periksa Kembali"
          :title="flashMessages.error.title"
          :image="imageFailedSrc"
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

      <div
        class="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <a
            href="#"
            class="flex justify-center items-center mb-6 text-2xl font-semibold text-gray-900"
          >
            <Logo />
          </a>
          <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
            <!-- Form Structure -->
            <div>
              <!-- Nama Lengkap Field -->
              <div class="mb-6">
                <InputLabel
                  for="name"
                  label="Nama Lengkap"
                  :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
                />
                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Masukkan nama lengkap"
                  autocomplete="current-name"
                  v-model="form.name"
                  :error="errors.name"
                  :additionalClass="'w-full'"
                  @keyup="validateField(this.schema, this.form, 'name')"
                />
              </div>
              <!-- Email Field -->
              <div class="mb-6">
                <InputLabel
                  for="email"
                  label="Email"
                  :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
                />
                <TextInput
                  id="email"
                  type="text"
                  name="email"
                  placeholder="Masukkan email"
                  autocomplete="current-email"
                  v-model="form.email"
                  :error="errors.email"
                  :additionalClass="'w-full'"
                  @keyup="validateField(this.schema, this.form, 'email')"
                />
              </div>

              <!-- username Field -->
              <div class="mb-6">
                <InputLabel
                  for="username"
                  label="Username"
                  :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
                />
                <TextInput
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Masukkan username"
                  autocomplete="current-username"
                  v-model="form.username"
                  :error="errors.username"
                  :additionalClass="'w-full'"
                  @keyup="validateField(this.schema, this.form, 'username')"
                />
              </div>

              <!-- Password Field -->
              <div class="mb-6">
                <InputLabel
                  for="password"
                  label="Password"
                  :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
                />
                <TextInput
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  placeholder="Masukkan kata sandi"
                  autocomplete="current-password"
                  v-model="form.password"
                  :error="errors.password"
                  :additionalClass="'w-full'"
                  @keyup="validateField(this.schema, this.form, 'password')"
                >
                  <div class="absolute top-1/2 -translate-y-1/2 right-[5%]">
                    <!-- EyeToggle component -->
                    <EyeToggle
                      :showPassword="showPassword"
                      :isActive="isEyeActive"
                      @toggle="togglePasswordVisibility"
                    />
                  </div>
                </TextInput>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="h-12 mb-32">
              <PrimaryButton
                :inactive="isButtonDisabled"
                label="Register"
                :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              />
            </div>

            <!-- OAuth Login -->
            <div class="flex items-center justify-center gap-4 mt-6">
              <!-- Tombol Google -->
              <button
                @click="handleOAuthLogin('google')"
                class="flex items-center px-4 py-2 border rounded-lg shadow-md bg-white hover:bg-gray-100"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                  class="w-5 h-5 mr-2"
                  alt="Google Logo"
                />
                <span class="text-sm font-medium text-gray-700">Google</span>
              </button>

              <!-- Tulisan "Atau" di tengah -->
              <span class="text-gray-500 font-medium">Atau</span>

              <!-- Tombol GitHub -->
              <button
                @click="handleOAuthLogin('github')"
                class="flex items-center px-4 py-2 border rounded-lg shadow-md text-black hover:bg-gray-900 hover:text-white"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                  class="w-5 h-5 mr-2"
                  alt="GitHub Logo"
                />
                <span class="text-sm font-medium">GitHub</span>
              </button>
            </div>

            <p class="text-sm font-light text-gray-500">
              Sudah memiliki akun ?
              <a
                href="/login"
                class="font-medium text-primary-600 hover:underline"
                >Login disini</a
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import * as yup from "yup";
import { useFadeAlert } from "../../composables/useFadeAlert";
import { useFormValidation } from "../../composables/useFormValidation";

import PrimaryButton from "../../components/common/PrimaryButton.vue";
import EyeToggle from "../../components/common/EyeToggle.vue";
import SessionAlert from "../../components/common/SessionAlert.vue";
import Logo from "../../components/layout/Logo.vue";
import InputLabel from "../../components/common/InputLabel.vue";
import TextInput from "../../components/common/TextInput.vue";

import ImageSuccess from "../../assets/register-success.svg";
import ImageFailed from "../../assets/register-failed.svg";

export default {
  components: {
    Logo,
    InputLabel,
    TextInput,
    PrimaryButton,
    EyeToggle,
    SessionAlert,
  },
  props: {
    title: String,
  },
  data() {
    return {
      imageSrc: ImageSuccess,
      imageFailedSrc: ImageFailed,
      form: {
        name: "",
        email: "",
        username: "",
        password: "",
      },
      flashMessages: {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      },
      showPassword: false,
      isEyeActive: false,
      isButtonDisabled: false,
      errors: {},
      schema: yup.object({
        name: yup.string().required("Nama lengkap tidak boleh kosong"),
        email: yup.string().required("Email tidak boleh kosong"),
        username: yup.string().required("Username tidak boleh kosong"),
        password: yup.string().required("Kata sandi tidak boleh kosong"),
      }),
    };
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.validateField(this.schema, this.form);
      this.isButtonDisabled = true;

      if (isValid) {
        try {
          const response = await fetch("http://localhost:5001/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.form),
          });

          const data = await response.json();

          if (!response.ok) {
            this.flashMessages.error = {
              title: "Pendaftaran Gagal",
              description: data.error || "Terjadi kesalahan saat mendaftar.",
            };
            throw new Error(data.error || "Registrasi gagal!");
          }

          // Jika berhasil, reset form
          this.form = {
            name: "",
            email: "",
            username: "",
            password: "",
          };

          // Tampilkan pesan sukses
          this.flashMessages.success = {
            title: "Pendaftaran Berhasil",
            description: "Silakan masuk dengan akun Anda.",
          };

          // Redirect ke halaman login setelah 2 detik
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        } catch (error) {
          console.error("Error:", error);
        }
      }

      setTimeout(() => {
        this.isButtonDisabled = false;
      }, 1000);
    },
    async handleOAuthLogin(provider) {
      const oauthUrls = {
        google: "http://localhost:5001/auth/google",
        github: "http://localhost:5001/auth/github",
      };

      window.location.href = oauthUrls[provider]; // Redirect langsung ke Google/GitHub OAuth
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    clearFlashMessage() {
      this.flashMessages = {
        error: { title: null, description: null },
        success: { title: null, description: null },
      };
    },
  },
  watch: {
    title: {
      immediate: true,
      handler(title) {
        document.title = title;
      },
    },
  },
  setup() {
    const { errors, validateField } = useFormValidation();
    const { beforeEnter, enter, leave } = useFadeAlert();

    return {
      beforeEnter,
      enter,
      leave,
      errors,
      validateField,
    };
  },
};
</script>
