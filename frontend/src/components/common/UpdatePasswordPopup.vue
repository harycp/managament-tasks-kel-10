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
          <h2 class="text-lg font-semibold text-gray-900">Ubah Kata Sandi</h2>

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

        <div class="space-y-4">
          <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
            <!-- Form Structure -->
            <div>
              <div class="mb-2">
                <InputLabel
                  for="oldPassword"
                  label="Kata sandi lama"
                  :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
                />
                <TextInput
                  id="oldPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  name="oldPassword"
                  placeholder="Masukkan kata sandi lama"
                  autocomplete="current-old-password"
                  v-model="form.oldPassword"
                  :error="errors.oldPassword"
                  :additionalClass="'w-full'"
                  @keyup="validateField(this.schema, this.form, 'oldPassword')"
                >
                  <div class="absolute top-1/2 -translate-y-1/2 right-[5%]">
                    <!-- EyeToggle component -->
                    <EyeToggle
                      :showPassword="showOldPassword"
                      :isActive="isEyeActive"
                      @toggle="toggleOldPasswordVisibility"
                    />
                  </div>
                </TextInput>
              </div>
              <!-- Password Field -->
              <div class="mb-2">
                <InputLabel
                  for="password"
                  label="Kata sandi baru"
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
                  @keydown="validateField(this.schema, this.form, 'password')"
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
              <!-- Confirm Password Field -->
              <div class="mb-2">
                <InputLabel
                  for="confirmPassword"
                  label="Konfirmasi kata sandi baru"
                  :additionalClass="'mb-2 text-sm font-medium text-gray-900'"
                />
                <TextInput
                  id="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  name="confirmPassword"
                  placeholder="Masukkan konfirmasi kata sandi baru"
                  autocomplete="current-confirm-password"
                  v-model="form.confirmPassword"
                  :error="errors.confirmPassword"
                  :additionalClass="'w-full'"
                  @keyup="
                    validateField(this.schema, this.form, 'confirmPassword')
                  "
                >
                  <div class="absolute top-1/2 -translate-y-1/2 right-[5%]">
                    <!-- EyeToggle component -->
                    <EyeToggle
                      :showPassword="showConfirmPassword"
                      :isActive="isEyeActive"
                      @toggle="toggleConfirmPasswordVisibility"
                    />
                  </div>
                </TextInput>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="h-10 mb-32">
              <PrimaryButton
                :inactive="isButtonDisabled"
                label="Reset Kata Sandi"
                :additionalClass="'text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import * as yup from "yup";
import axios from "axios";
import { useFadeAlert } from "../../composables/useFadeAlert";
import { useFormValidation } from "../../composables/useFormValidation";

import PrimaryButton from "../../components/common/PrimaryButton.vue";
import SessionAlert from "../../components/common/SessionAlert.vue";
import Logo from "../../components/layout/Logo.vue";
import InputLabel from "../../components/common/InputLabel.vue";
import TextInput from "../../components/common/TextInput.vue";
import EyeToggle from "../../components/common/EyeToggle.vue";
import PasswordRule from "../../components/common/PasswordRule.vue";
import ProgressBar from "../../components/common/ProgressBar.vue";

import ImageSuccess from "../../assets/register-success.svg";
import ImageFailed from "../../assets/register-failed.svg";

export default {
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
  components: {
    Logo,
    InputLabel,
    TextInput,
    PrimaryButton,
    EyeToggle,
    SessionAlert,
    PasswordRule,
    ProgressBar,
  },
  data() {
    return {
      imageSrc: ImageSuccess,
      imageSrcFailed: ImageFailed,
      form: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
      flashMessages: {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      },
      showPassword: false,
      showConfirmPassword: false,
      showOldPassword: false,
      isEyeActive: false,
      errors: {},
      schema: yup.object({
        oldPassword: yup
          .string()
          .min(8, "Kata sandi lama minimal harus berisi 8 karakter")
          .required("Kata sandi lama tidak boleh kosong"),
        password: yup
          .string()
          .min(8, "Kata sandi baru minimal harus berisi 8 karakter")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].+$/,
            "Kata sandi baru harus memiliki setidaknya satu huruf kecil, satu huruf besar, satu angka, dan satu simbol"
          )
          .required("Kata sandi baru tidak boleh kosong"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password")], "Konfirmasi kata sandi baru tidak sama")
          .required("Konfirmasi kata sandi baru wajib diisi"),
      }),
      isButtonDisabled: false,
      oneSpecialIsValid: false,
      minCharIsValid: false,
      oneNumberIsValid: false,
    };
  },
  props: {
    title: String,
    user: Object,
    isOpen: Boolean,
  },
  emits: ["close"],
  methods: {
    async handleSubmit() {
      const isValid = await this.validateField(this.schema, this.form);
      this.isButtonDisabled = true;

      if (isValid) {
        try {
          const response = await axios.put(
            "https://localhost/user-service/api/update-password",
            {
              id: this.user.id,
              oldPassword: this.form.oldPassword,
              newPassword: this.form.confirmPassword,
            },
            { withCredentials: true }
          );

          const data = await response.data;

          if (data.error) {
            this.flashMessages.error = {
              title: "Ubah Kata Sandi Gagal",
              description:
                data.error || "Terjadi kesalahan saat mengubah kata sandi.",
            };
            throw new Error(data.error || "Reset kata sandi gagal!");
          }

          this.flashMessages.success = {
            title: "Ubah Kata Sandi Berhasil",
            description: "Kata sandi anda berhasil diubah.",
          };

          this.form = { oldPassword: "", password: "", confirmPassword: "" };

          setTimeout(() => {
            this.$emit("close");
          }, 2000);
        } catch (error) {
          this.form = { oldPassword: "", password: "", confirmPassword: "" };

          this.flashMessages.error = {
            title: "Ubah Kata Sandi Gagal",
            description: "Terjadi kesalahan saat mengubah kata sandi.",
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
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    toggleOldPasswordVisibility() {
      this.showOldPassword = !this.showOldPassword;
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
};
</script>
