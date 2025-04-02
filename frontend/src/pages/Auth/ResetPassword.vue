<!-- <template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <h1 class="text-2xl mb-4">Reset Password</h1>
    <input
      v-model="password"
      type="password"
      placeholder="Enter new password"
      class="border p-2 mb-2"
    />
    <button @click="resetPassword" class="bg-blue-500 text-white p-2">
      Submit
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const password = ref("");
    const route = useRoute();
    const router = useRouter();

    const resetPassword = async () => {
      try {
        await axios.post("http://localhost:5001/api/reset-password", {
          token: route.query.token,
          newPassword: password.value,
        });
        alert("Password berhasil direset");
        router.push("/login");
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    return { password, resetPassword };
  },
};
</script> -->

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
  </section>
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
        password: "",
        confirmPassword: "",
      },
      flashMessages: {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      },
      showPassword: false,
      showConfirmPassword: false,
      isEyeActive: false,
      errors: {},
      schema: yup.object({
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
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.validateField(this.schema, this.form);
      this.isButtonDisabled = true;

      if (isValid) {
        try {
          const response = await axios.post(
            "http://localhost:5001/auth/reset-password",
            {
              token: this.$route.query.token,
              newPassword: this.form.confirmPassword,
            }
          );

          const data = await response.data;

          if (data.error) {
            this.flashMessages.error = {
              title: "Reset Password Gagal",
              description:
                data.error || "Terjadi kesalahan saat reset password.",
            };
            throw new Error(data.error || "Reset password gagal!");
          }

          this.flashMessages.success = {
            title: "Reset Password Berhasil",
            description: "Coba login dengan kata sandi baru.",
          };

          this.form = { password: "", confirmPassword: "" };

          setTimeout(() => {
            this.$router.push("/login");
          }, 4000);
        } catch (error) {
          this.form = { password: "", confirmPassword: "" };

          this.flashMessages.error = {
            title: "Reset Password Gagal",
            description: "Terjadi kesalahan saat reset password.",
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
  mounted() {
    document.title = "Reset Password | Tuntask";
  },
};
</script>
