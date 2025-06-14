<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
    >
      <div class="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ currentStepTitle }}
          </h2>

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

        <!-- Step 1: Password -->
        <div v-if="step === 1" class="space-y-4">
          <p class="text-sm text-gray-500">
            Email anda saat ini adalah
            <span class="font-semibold text-gray-900">{{ user.email }}</span
            >.
          </p>
          <input
            type="password"
            v-model="password"
            placeholder="Masukkan kata sandi"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <PrimaryButton
            @click="verifyPassword"
            :inactive="isButton1Disabled"
            label="Lanjutkan"
            :additionalClass="'py-2 text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
          />
        </div>

        <!-- Step 2: New Email -->
        <div v-else-if="step === 2" class="space-y-4">
          <input
            type="email"
            v-model="newEmail"
            placeholder="Masukkan email baru"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <PrimaryButton
            @click="sendVerificationCode"
            :inactive="isButton2Disabled"
            label="Kirim Kode Verifikasi"
            :additionalClass="'py-2 text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
          />
        </div>

        <!-- Step 3: OTP -->
        <div v-else-if="step === 3" class="space-y-4">
          <input
            type="text"
            v-model="otp"
            maxlength="6"
            placeholder="Enter OTP code"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <PrimaryButton
            @click="verifyAndUpdateEmail"
            :inactive="isButton3Disabled"
            label="Konfirmasi dan Perbarui Email"
            :additionalClass="'py-2 text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black'"
          />
        </div>

        <p v-if="errorMessage" class="mt-3 text-sm text-red-500">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script>
import axios from "axios";
import PrimaryButton from "./PrimaryButton.vue";

export default {
  components: { PrimaryButton },
  props: {
    isOpen: Boolean,
    user: Object,
  },
  emits: ["close"],
  data() {
    return {
      step: 1,
      password: "",
      newEmail: "",
      otp: "",
      errorMessage: "",
      isButton1Disabled: false,
      isButton2Disabled: false,
      isButton3Disabled: false,
    };
  },
  computed: {
    currentStepTitle() {
      switch (this.step) {
        case 1:
          return "Konfirmasi Email";
        case 2:
          return "Masukkan Email Baru";
        case 3:
          return "Masukkan Kode OTP";
        default:
          return "";
      }
    },
  },
  methods: {
    async verifyPassword() {
      this.errorMessage = "";
      try {
        await axios.post(
          "http://localhost:5000/user-service/api/verify-password",
          {
            userId: this.user.id,
            password: this.password,
          },
          { withCredentials: true }
        );
        this.isButton1Disabled = true;
        this.step = 2;
      } catch (error) {
        this.isButton1Disabled = false;
        this.errorMessage = "Incorrect password. Please try again.";
      }
    },
    async sendVerificationCode() {
      this.errorMessage = "";
      try {
        await axios.post(
          "http://localhost:5000/user-service/api/request-otp",
          {
            email: this.user.email,
            newEmail: this.newEmail,
          },
          {
            withCredentials: true,
          }
        );
        this.isButton2Disabled = true;
        this.step = 3;
      } catch {
        this.isButton2Disabled = false;
        this.errorMessage = "Failed to send code. Please check your email.";
      }
    },
    async verifyAndUpdateEmail() {
      this.errorMessage = "";
      try {
        await axios.post(
          "http://localhost:5000/user-service/api/update-email",
          {
            otp: this.otp,
            email: this.newEmail,
          },
          {
            withCredentials: true,
          }
        );
        this.isButton3Disabled = true;
        this.$emit("close");
        this.user.email = this.newEmail;
      } catch (error) {
        console.log(error);
        this.isButton3Disabled = false;
        this.errorMessage = "Invalid or expired OTP code.";
      }
    },
  },
};
</script>
