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
              <!-- Email Field -->
              <div class="mb-2">
                <InputLabel
                  for="usernameOrEmail"
                  label="Username atau Email"
                  :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
                />
                <TextInput
                  id="usernameOrEmail"
                  type="text"
                  name="usernameOrEmail"
                  placeholder="Masukkan username atau email"
                  autocomplete="current-usernameOrEmail"
                  v-model="form.usernameOrEmail"
                  :error="errors.usernameOrEmail"
                  :additionalClass="'w-full'"
                  @keyup="
                    validateField(this.schema, this.form, 'usernameOrEmail')
                  "
                />
              </div>
              <!-- Password Field -->
              <div class="mb-2">
                <InputLabel
                  for="password"
                  label="Kata Sandi"
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
            <div class="h-10 mb-32">
              <PrimaryButton
                :inactive="isButtonDisabled"
                label="Login"
                :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              />
            </div>
          </form>

          <!-- OAuth Login -->
          <div class="mt-2">
            <p class="text-center text-gray-600 text-sm font-medium mb-4">
              Atau masuk dengan
            </p>

            <div class="flex flex-col gap-3">
              <!-- Tombol Google -->
              <button
                @click="handleOAuthLogin('google')"
                class="flex text-sm font-semibold items-center justify-center w-full h-10 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-black hover:text-white md:text-base hover:bg-black transition-all duration-300"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                  class="w-5 h-5 mr-2"
                  alt="Google Logo"
                />
                Masuk dengan Google
              </button>

              <!-- Tombol GitHub -->
              <button
                @click="handleOAuthLogin('github')"
                class="group flex items-center justify-center w-full h-10 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-black text-sm font-semibold md:text-base transition-all duration-300 hover:text-white hover:bg-black"
              >
                <svg
                  class="w-5 h-5 mr-2 transition-all duration-300 fill-black group-hover:fill-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.385 0.6 0.113 0.793-0.26 0.793-0.577 0-0.285-0.01-1.04-0.015-2.04-3.338 0.726-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.09-0.745 0.083-0.73 0.083-0.73 1.205 0.085 1.84 1.237 1.84 1.237 1.07 1.834 2.805 1.304 3.49 0.997 0.108-0.775 0.42-1.304 0.76-1.603-2.665-0.3-5.466-1.332-5.466-5.93 0-1.31 0.467-2.38 1.236-3.22-0.124-0.303-0.536-1.523 0.116-3.176 0 0 1.008-0.322 3.3 1.23 0.96-0.267 1.98-0.4 3-0.405 1.02 0.005 2.04 0.138 3 0.405 2.292-1.552 3.3-1.23 3.3-1.23 0.652 1.653 0.24 2.873 0.116 3.176 0.77 0.84 1.236 1.91 1.236 3.22 0 4.608-2.805 5.625-5.475 5.92 0.43 0.372 0.815 1.103 0.815 2.222 0 1.603-0.015 2.897-0.015 3.292 0 0.32 0.19 0.694 0.8 0.577 4.765-1.585 8.2-6.083 8.2-11.385 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                Masuk dengan GitHub
              </button>
            </div>
          </div>

          <p class="text-sm text-center font-light text-gray-500">
            Belum memiliki akun ?
            <a
              href="/register"
              class="font-medium text-primary-600 hover:underline"
              >Daftar disini</a
            >
          </p>
          <p class="text-sm text-center font-light text-gray-500">
            Lupa Password ?
            <a
              href="/request-reset-password"
              class="font-medium text-primary-600 hover:underline"
              >Klik disini</a
            >
          </p>
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
      imageSrcFailed: ImageFailed,
      form: {
        usernameOrEmail: "",
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
        usernameOrEmail: yup
          .string()
          .trim()
          .required("Username atau email wajib diisi")
          .test(
            "is-username-or-email",
            "Masukkan format username atau email yang valid",
            (value) => {
              const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
              const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;

              return emailRegex.test(value) || usernameRegex.test(value);
            }
          ),
        password: yup
          .string()
          .min(8, "Kata sandi minimal 8 karakter")
          .max(32, "Kata sandi maksimal 32 karakter")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=|`~{}\[\]:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_\-+=|`~{}\[\]:;"'<>,.?/]{8,}$/,
            "Kata sandi harus mengandung minimal 8 karakter, huruf besar, huruf kecil, angka, dan simbol"
          )
          .required("Kata sandi wajib diisi"),
      }),
    };
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.validateField(this.schema, this.form);
      this.isButtonDisabled = true;

      if (isValid) {
        try {
          const response = await fetch(
            "http://localhost/user-service/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(this.form),
              credentials: "include",
            }
          );

          const data = await response.json();

          if (!response.ok) {
            this.flashMessages.error = {
              title: "Login Gagal",
              description: data.error || "Email atau kata sandi salah.",
            };
            throw new Error(data.error || "Login gagal!");
          }

          this.flashMessages.success = {
            title: "Login Berhasil",
            description: "Anda akan dialihkan ke dashboard.",
          };

          this.form = { usernameOrEmail: "", password: "" };

          setTimeout(() => {
            this.$router.push("/h");
          }, 2000);
        } catch (error) {
          this.form = { usernameOrEmail: "", password: "" };

          this.flashMessages.error = {
            title: "Login Gagal",
            description: "Email atau kata sandi salah.",
          };
          console.error("Error:", error);
        }
      }

      setTimeout(() => {
        this.isButtonDisabled = false;
      }, 1000);
    },
    async handleOAuthLogin(provider) {
      const oauthUrls = {
        google: "http://localhost/user-service/auth/google",
        github: "http://localhost/user-service/auth/github",
      };

      window.location.href = oauthUrls[provider];
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    clearFlashMessage() {
      this.flashMessages = {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
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
  mounted() {
    document.title = "Login | Tuntask";
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
