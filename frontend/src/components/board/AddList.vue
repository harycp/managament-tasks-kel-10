<template>
  <div class="w-72 flex-shrink-0">
    <div
      v-if="!isEditing"
      @click="showForm"
      class="cursor-pointer px-4 py-2 text-sm text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
    >
      + {{ buttonText }}
    </div>

    <div
      v-else
      class="bg-white border border-gray-300 rounded-xl p-3 shadow-sm space-y-2"
    >
      <input
        ref="inputName"
        v-model="newListName"
        @keyup.enter="handleAddList"
        @keyup.esc="hideForm"
        type="text"
        placeholder="Enter list title..."
        class="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <div class="flex gap-2">
        <button
          @click="handleAddList"
          class="bg-gray-600 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-gray-700"
        >
          Add List
        </button>
        <button
          @click="hideForm"
          class="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddList",
  props: {
    hasLists: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
      newListName: "",
    };
  },
  computed: {
    buttonText() {
      return this.hasLists ? "Add another list" : "Add a list";
    },
  },
  methods: {
    showForm() {
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs.inputName.focus();
      });
    },
    hideForm() {
      this.isEditing = false;
      this.newListName = "";
    },
    handleAddList() {
      const trimmed = this.newListName.trim();
      if (!trimmed) return;
      this.$emit("add-list", trimmed);
      this.hideForm();
    },
  },
};
</script>
