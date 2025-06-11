<template>
  <div class="prose max-w-none border border-gray-300 rounded-md p-1">
    <div v-if="editor" class="flex items-center gap-2 p-2 border-b">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        Bold
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        Italic
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        List
      </button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

export default {
  components: { EditorContent },
  props: {
    modelValue: { type: String, default: "" },
  },
  data() {
    return { editor: null };
  },
  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value;
      if (isSame) return;
      this.editor.commands.setContent(value, false);
    },
  },
  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit("update:modelValue", this.editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: "p-2 min-h-[150px] focus:outline-none",
        },
      },
    });
  },
  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style scoped>
.prose :deep(p) {
  margin: 0;
}
button {
  @apply px-2 py-1 text-sm border rounded-md;
}
.is-active {
  @apply bg-black text-white;
}
</style>
