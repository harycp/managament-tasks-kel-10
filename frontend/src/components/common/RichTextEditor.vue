<template>
  <div class="prose max-w-none border border-gray-300 rounded-md">
    <div
      v-if="editor"
      class="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50 rounded-t-md"
    >
      <div class="flex items-center gap-1">
        <button @click="editor.chain().focus().undo().run()" title="Undo">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.5 8C9.85 8 7.45 8.99 5.6 10.6L2 7v9h9l-3.6-3.6A8.01 8.01 0 0 1 20 16a8.01 8.01 0 0 1-5.66 2.34L13 19.7A9.95 9.95 0 0 0 22 16c0-4.08-2.5-7.58-6-9.1V4h-2.5v4z"
            ></path>
          </svg>
        </button>
        <button @click="editor.chain().focus().redo().run()" title="Redo">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8H4v2h7.5c2.1 0 3.96 1.2 4.85 3.05L19 16l-2.78-2.78A5.96 5.96 0 0 0 11.5 11H4v2h7.5c.71 0 1.38.19 1.95.53l2.77 2.77L22 16V7l-3.6 3.6z"
            ></path>
          </svg>
        </button>
      </div>

      <div class="h-5 border-l mx-2"></div>

      <select
        @change="handleHeadingChange"
        class="text-sm border rounded-md px-2 py-1 bg-white"
      >
        <option value="0" :selected="!isHeadingActive">Paragraph</option>
        <option value="1" :selected="editor.isActive('heading', { level: 1 })">
          Heading 1
        </option>
        <option value="2" :selected="editor.isActive('heading', { level: 2 })">
          Heading 2
        </option>
        <option value="3" :selected="editor.isActive('heading', { level: 3 })">
          Heading 3
        </option>
      </select>

      <div class="h-5 border-l mx-2"></div>

      <div class="flex items-center gap-1">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          title="Bold"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79c0-2.26-1.75-4-4.25-4H7v14h7.04c2.1 0 3.71-1.7 3.71-3.78c0-1.52-.86-2.82-2.15-3.43zM10 6.5h3.04c.94 0 1.71.72 1.71 1.61c0 .92-.77 1.64-1.71 1.64H10V6.5zm3.5 8.5H10v-3h3.5c.98 0 1.75.79 1.75 1.75s-.77 1.25-1.75 1.25z"
            ></path>
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          title="Italic"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"
            ></path>
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }"
          title="Underline"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"
            ></path>
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          title="Strikethrough"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M18.5 7.5H6c-.55 0-1-.45-1-1s.45-1 1-1h12.5c.55 0 1 .45 1 1s-.45 1-1 1zM4 12h16v2H4v-2zm2 5.5h12.5c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1z"
            ></path>
          </svg>
        </button>
      </div>

      <div class="h-5 border-l mx-2"></div>

      <div class="flex items-center gap-1">
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          title="Bullet List"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M4 18h16v-2H4v2zm0-5h16v-2H4v2zm0-7v2h16V6H4z"
            ></path>
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          title="Numbered List"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 11.9v-.9H2v1zm5-6v2h14V6H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"
            ></path>
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          title="Blockquote"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"
            ></path>
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          title="Code Block"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6l6 6l1.4-1.4zm5.2 0l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4z"
            ></path>
          </svg>
        </button>
      </div>

      <div class="h-5 border-l mx-2"></div>

      <div class="flex items-center gap-1">
        <button
          @click="editor.chain().focus().setHorizontalRule().run()"
          title="Horizontal Rule"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13H5v-2h14v2z"></path>
          </svg>
        </button>
      </div>
    </div>

    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline"; // <-- 1. Impor ekstensi Underline

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
      // 2. Tambahkan Underline ke dalam daftar extensions
      extensions: [StarterKit, Underline],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit("update:modelValue", this.editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: "p-4 min-h-[150px] focus:outline-none",
        },
      },
    });
  },
  beforeUnmount() {
    this.editor.destroy();
  },
  methods: {
    handleHeadingChange(event) {
      const level = parseInt(event.target.value);
      if (level === 0) {
        // Jika memilih "Paragraph"
        this.editor.chain().focus().setParagraph().run();
      } else {
        this.editor.chain().focus().toggleHeading({ level: level }).run();
      }
    },
  },
  computed: {
    isHeadingActive() {
      return (
        this.editor.isActive("heading", { level: 1 }) ||
        this.editor.isActive("heading", { level: 2 }) ||
        this.editor.isActive("heading", { level: 3 })
      );
    },
  },
};
</script>

<style scoped>
/* Styling untuk Tiptap agar terlihat seperti Notion/Docs */
.prose :deep(p) {
  margin-top: 0;
  margin-bottom: 0;
}
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  margin-top: 1em;
  margin-bottom: 0.5em;
}
.prose :deep(ul),
.prose :deep(ol) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 1.5em;
}
.prose :deep(blockquote) {
  margin-left: 0;
  padding-left: 1em;
  border-left: 3px solid #e2e8f0;
}
.prose :deep(pre) {
  background: #f1f5f9;
  color: #334155;
  font-family: "JetBrains Mono", monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

/* Styling untuk Toolbar */
button,
select {
  @apply px-2 py-1 text-sm bg-transparent border-none rounded-md text-gray-700 hover:bg-gray-200;
}
.is-active {
  @apply bg-gray-800 text-white hover:bg-gray-800;
}
</style>
