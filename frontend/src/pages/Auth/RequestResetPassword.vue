<!-- <template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <h1 class="text-2xl mb-4">Forgot Password</h1>
    <input
      v-model="email"
      type="email"
      placeholder="Enter your email"
      class="border p-2 mb-2"
    />
    <button @click="requestResetPassword" class="bg-blue-500 text-white p-2">
      Send Reset Link
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  setup() {
    const email = ref("");

    const requestResetPassword = async () => {
      try {
        await axios.post("https://localhost/user-service/api/request-reset-password", {
          email: email.value,
        });
        alert("Reset link has been sent to your email");
        email.value = "";
      } catch (error) {
        console.log(email);
        alert(error.response.data.message);
      }
    };

    return { email, requestResetPassword };
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
              <!-- Email Field -->
              <div class="mb-2">
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
            </div>

            <!-- Submit Button -->
            <div class="h-10 mb-32">
              <PrimaryButton
                :inactive="isButtonDisabled"
                label="Reset Password"
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

import ImageSuccess from "../../assets/register-success.svg";
import ImageFailed from "../../assets/register-failed.svg";

export default {
  components: {
    Logo,
    InputLabel,
    TextInput,
    PrimaryButton,
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
        email: "",
      },
      flashMessages: {
        error: { title: "", description: "" },
        success: { title: "", description: "" },
      },
      isButtonDisabled: false,
      errors: {},
      schema: yup.object({
        email: yup
          .string()
          .required("Email wajib diisi")
          .email("Masukkan format email yang valid"),
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
            "https://localhost/user-service/auth/request-reset-password",
            {
              email: this.form.email,
            }
          );

          console.log(response);

          const data = await response.data;

          if (data.error) {
            this.flashMessages.error = {
              title: "Request Reset Password Gagal",
              description: data.error || "Email tidak ditemukan.",
            };
            throw new Error(data.error || "Reset password gagal!");
          }

          this.flashMessages.success = {
            title: "Request Reset Password Berhasil",
            description: "Harap cek email anda.",
          };

          this.form = { email: "" };

          setTimeout(() => {
            this.$router.push("/reset-password");
          }, 4000);
        } catch (error) {
          this.form = { email: "" };

          this.flashMessages.error = {
            title: "Request Reset Password Gagal",
            description: "Email anda tidak ditemukan.",
          };
          console.error("Error:", error);
        }
      }

      setTimeout(() => {
        this.isButtonDisabled = false;
      }, 1000);
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
    document.title = "Reset Password | Tuntask";
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
