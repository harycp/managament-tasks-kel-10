<script>
export default {
  name: "InputLabel",
  // Define props that the component accepts
  props: {
    label: {
      type: String,
      default: "",
    },

    labelFor: {
      type: String,
      default: "",
    },
    opsional: {
      type: String,
      default: "",
    },
    additionalClass: {
      type: String,
      default: "",
    },
  },
};
</script>

<template>
  <label
    :for="labelFor"
    class="text-base font-semibold text-black"
    :class="additionalClass"
  >
    {{ label }}
    <span class="text-base font-normal text-gray-500">
      {{ opsional }}
    </span>
  </label>

  <!-- Display the text from the `label` prop -->
</template>
