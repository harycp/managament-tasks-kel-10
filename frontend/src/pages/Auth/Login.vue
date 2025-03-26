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
              <div class="mb-6">
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
                label="Login"
                :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              />
            </div>

            <p class="text-sm font-light text-gray-500">
              Belum memiliki akun ?
              <a
                href="/register"
                class="font-medium text-primary-600 hover:underline"
                >Daftar disini</a
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
          .required("Username atau email tidak boleh kosong"),
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
          const response = await fetch("http://localhost:5001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.form),
          });

          const data = await response.json();

          if (!response.ok) {
            this.flashMessages.error = {
              title: "Login Gagal",
              description: data.error || "Email atau kata sandi salah.",
            };
            throw new Error(data.error || "Login gagal!");
          }

          // Simpan token ke localStorage
          localStorage.setItem("authToken", data.data.token);

          // Tampilkan pesan sukses
          this.flashMessages.success = {
            title: "Login Berhasil",
            description: "Anda akan dialihkan ke dashboard.",
          };

          // Reset form setelah login berhasil
          this.form = { usernameOrEmail: "", password: "" };

          // Redirect ke dashboard setelah 2 detik
          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 2000);
        } catch (error) {
          console.error("Error:", error);
        }
      }

      setTimeout(() => {
        this.isButtonDisabled = false;
      }, 1000);
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
