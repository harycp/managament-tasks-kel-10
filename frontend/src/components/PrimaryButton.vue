<script>
export default {
  name: "PrimaryButton",
  props: {
    label: {
      type: String,
      default: "",
    },
    additionalClass: {
      type: String,
      default: "",
    },
    btnType: {
      type: String,
      default: "submit",
    },
    path: {
      type: String,
      default: "#",
    },
    inactive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <a
    v-if="btnType === 'link'"
    :href="path"
    class="w-full flex h-full font-medium cursor-pointer items-center justify-center text-base py-0 rounded-md border border-gray-300 text-black hover:text-white md:text-base hover:bg-black transition-all duration-300"
    :class="additionalClass"
  >
    <span v-html="label"></span>
  </a>

  <button
    v-else
    :disabled="inactive"
    :type="btnType"
    class="w-full flex h-full font-medium cursor-pointer items-center justify-center text-base py-0 rounded-md border border-gray-300 text-black hover:text-white md:text-base hover:bg-black transition-all duration-300"
    :class="additionalClass"
  >
    <span v-html="label" class="flex items-center justify-center"></span>
  </button>
</template>
