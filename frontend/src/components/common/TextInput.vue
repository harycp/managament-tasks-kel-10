<template>
  <div>
    <div class="relative flex items-center">
      <input
        :id="id"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :readonly="onlyRead"
        :class="[
          'h-12 border-2 w-full rounded-lg p-2.5 text-sm lg:text-base focus:outline-none focus:ring-opacity-50 sm:text-sm',
          additionalClass,
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-400 focus:ring-gray-500 focus:borderring-gray-500 hover:border-primary',
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <slot class="absolute inset-y-0 right-0 flex items-center pr-3"></slot>
    </div>
    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "TextInput",
  props: {
    id: { type: String, default: "" },
    type: { type: String, default: "text" },
    name: { type: String, default: "" },
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    additionalClass: { type: String, default: "" },
    onlyRead: { type: Boolean, default: false },
    error: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
};
</script>
