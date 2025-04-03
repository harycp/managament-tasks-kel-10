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
              <div class="mb-2">
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
              <!-- username Field -->
              <div class="mb-2">
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
                  autocomplete="current-new-password"
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
                <div class="flex justify-between w-full items-center p-2">
                  <p class="text-sm">Kekuatan kata sandi</p>
                  <div class="w-32 h-3">
                    <ProgressBar
                      :progress="passwordStrength"
                      :color="passwordStrengthColor"
                    />
                  </div>
                </div>
                <ul class="flex justify-between w-full text-sm">
                  <li>
                    <PasswordRule
                      :active="oneSpecialIsValid"
                      :color="passwordStrengthColor"
                      >1 Spesial Karakter</PasswordRule
                    >
                  </li>
                  <li>
                    <PasswordRule
                      :active="minCharIsValid"
                      :color="passwordStrengthColor"
                      >8 Karakter</PasswordRule
                    >
                  </li>
                  <li>
                    <PasswordRule
                      :active="oneNumberIsValid"
                      :color="passwordStrengthColor"
                      >1 Angka</PasswordRule
                    >
                  </li>
                </ul>
              </div>
            </div>
            <!-- Submit Button -->
            <div class="h-10 mb-32">
              <PrimaryButton
                :inactive="isButtonDisabled"
                label="Register"
                :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import * as yup from "yup";
import axios from "axios";
import { useFadeAlert } from "../../composables/useFadeAlert";
import { useFormValidation } from "../../composables/useFormValidation";

import PrimaryButton from "../../components/common/PrimaryButton.vue";
import EyeToggle from "../../components/common/EyeToggle.vue";
import SessionAlert from "../../components/common/SessionAlert.vue";
import Logo from "../../components/layout/Logo.vue";
import InputLabel from "../../components/common/InputLabel.vue";
import TextInput from "../../components/common/TextInput.vue";
import ProgressBar from "../../components/common/ProgressBar.vue";
import PasswordRule from "../../components/common/PasswordRule.vue";

import ImageSuccess from "../../assets/register-success.svg";
import ImageFailed from "../../assets/register-failed.svg";

export default {
  components: {
    Logo,
    InputLabel,
    TextInput,
    PrimaryButton,
    ProgressBar,
    PasswordRule,
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
      oneSpecialIsValid: false,
      minCharIsValid: false,
      oneNumberIsValid: false,
      errors: {},
      schema: yup.object({
        name: yup
          .string()
          .trim()
          .min(3, "Nama lengkap minimal 3 karakter")
          .max(50, "Nama lengkap maksimal 50 karakter")
          .matches(
            /^[a-zA-Z\s]+$/,
            "Nama lengkap hanya boleh berisi huruf dan spasi"
          )
          .required("Nama lengkap wajib diisi"),

        username: yup
          .string()
          .trim()
          .min(5, "Username minimal 5 karakter")
          .max(20, "Username maksimal 20 karakter")
          .matches(
            /^[a-zA-Z0-9_]+$/,
            "Username hanya boleh mengandung huruf, angka, dan underscore (_)"
          )
          .required("Username wajib diisi"),

        password: yup
          .string()
          .min(8, "Kata sandi baru minimal harus berisi 8 karakter")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].+$/,
            "Kata sandi baru harus memiliki setidaknya satu huruf kecil, satu huruf besar, satu angka, dan satu simbol"
          )
          .required("Kata sandi baru tidak boleh kosong"),
      }),
    };
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.validateField(this.schema, this.form);
      this.isButtonDisabled = true;

      if (isValid) {
        try {
          const response = await axios.post(
            "http://localhost:5001/auth/verify-email",
            {
              token: this.$route.query.token,
              userData: this.form,
            }
          );

          const data = await response.data;

          if (data.error) {
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
          this.form = {
            name: "",
            email: "",
            username: "",
            password: "",
          };
          this.flashMessages.error = {
            title: "Pendaftaran Gagal",
            description: "Terjadi kesalahan saat mendaftar.",
          };

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
    "form.password": {
      immediate: true,
      handler(newValue, oldValue) {
        const schema = yup.string().min(8);
        const schema2 = yup.string().matches(/^(?=.*[@$!%*?&]).+$/);
        const schema3 = yup.string().matches(/^(?=.*\d).+$/);
        schema
          .validate(newValue, { abortEarly: false })
          .then((_) => {
            this.minCharIsValid = true;
          })
          .catch((_) => {
            this.minCharIsValid = false;
          });
        schema2
          .validate(newValue, { abortEarly: false })
          .then((_) => {
            this.oneSpecialIsValid = true;
          })
          .catch((_) => {
            this.oneSpecialIsValid = false;
          });
        schema3
          .validate(newValue, { abortEarly: false })
          .then((_) => {
            this.oneNumberIsValid = true;
          })
          .catch((_) => {
            this.oneNumberIsValid = false;
          });
      },
    },
  },
  computed: {
    passwordStrength() {
      return (
        (this.minCharIsValid ? 100 / 3 : 0) +
        (this.oneNumberIsValid ? 100 / 3 : 0) +
        (this.oneSpecialIsValid ? 100 / 3 : 0)
      );
    },
    passwordStrengthColor() {
      if (this.passwordStrength === 100) {
        return "green-400";
      } else if (this.passwordStrength >= (100 / 3) * 2) {
        return "orange-400";
      } else if (this.passwordStrength >= 100 / 3) {
        return "red-400";
      } else {
        return "gray-200";
      }
    },
  },
  mounted() {
    document.title = "Register | Tuntask";
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
