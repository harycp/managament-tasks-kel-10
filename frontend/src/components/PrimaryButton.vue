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
    class="w-full flex h-full cursor-pointer items-center justify-center text-base py-0 rounded-md border-2 border-black text-black hover:text-white md:text-base hover:bg-black"
    :class="additionalClass"
  >
    <span v-html="label"></span>
  </a>

  <button
    v-else
    :disabled="inactive"
    :type="btnType"
    class="w-full h-full bg-blue-800 cursor-pointer text-base py-0 shadow-md rounded-lg text-white md:text-base hover:bg-blue-900 active:bg-blue-950"
    :class="additionalClass"
  >
    <span v-html="label" class="flex items-center justify-center"></span>
  </button>
</template>
