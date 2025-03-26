<template>
  <div
    id="alert"
    class="flex z-50 fixed lg:w-[30%] w-[60%] left-1/2 top-1/2 -translate-y-1/2 text-black -translate-x-1/2 bg-white border-2 border-gray-300 shadow-xl rounded-2xl p-5 flex-col items-center justify-center text-center gap-2 lg:gap-4"
  >
    <h1 class="font-bold text-base lg:text-2xl">{{ title }}</h1>
    <p class="text-xs lg:text-base lg:whitespace-nowrap">
      <slot />
    </p>
    <img v-if="image" :src="image" alt="alert-image" class="w-[20%] p-1" />

    <a
      v-if="btnType === 'link'"
      target="_blank"
      href="https://mail.google.com"
      class="rounded-lg bg-gray-300 p-2 w-full text-xs lg:text-base font-semibold"
      @click="removeAlert"
    >
      {{ btnTitle }}
    </a>
    <!-- text-sm font-semibold bg-black text-white hover:bg-white hover:!text-black -->
    <button
      v-else
      @click="removeAlert"
      class="w-full flex h-full font-semibold text-sm text-white cursor-pointer items-center justify-center py-2.5 rounded-md border bg-black border-gray-300 hover:bg-white hover:text-black md:text-base transition-all duration-300"
    >
      {{ btnTitle }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    btnTitle: String,
    image: {
      type: String,
      default: "",
    },
    btnType: {
      type: String,
      default: "close",
    },
  },
  methods: {
    removeAlert() {
      this.$emit("close-alert"); // Meminta parent untuk menghapus flash message
    },
  },
};
</script>
