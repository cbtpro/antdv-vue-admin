<template>
  <div class="editor-container">
    <div class="control-group">
      <div class="button-group">
        <a-button size="small" @click="editor?.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor?.isActive('bold') }">
          加粗
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor?.isActive('italic') }">
          斜体
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor?.isActive('strike') }">
          删除线
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor?.isActive('code') }">
          行内代码
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().unsetAllMarks().run()">
          清除样式
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().clearNodes().run()">
          清除节点
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor?.isActive('paragraph') }">
          段落
        </a-button>
        <a-select size="small" placeholder="选择标题等级" style="width: 160px"
          @change="(level: Level) => editor?.chain().focus().toggleHeading({ level }).run()"
          :value="getCurrentHeadingLevel()">
          <a-select-option :value="''">正文</a-select-option>
          <a-select-option :value="1">标题一 (H1)</a-select-option>
          <a-select-option :value="2">标题二 (H2)</a-select-option>
          <a-select-option :value="3">标题三 (H3)</a-select-option>
          <a-select-option :value="4">标题四 (H4)</a-select-option>
          <a-select-option :value="5">标题五 (H5)</a-select-option>
          <a-select-option :value="6">标题六 (H6)</a-select-option>
        </a-select>
        <a-button size="small" @click="editor?.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor?.isActive('bulletList') }">
          无序列表
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor?.isActive('orderedList') }">
          有序列表
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor?.isActive('codeBlock') }">
          代码块
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor?.isActive('blockquote') }">
          引用
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().setHorizontalRule().run()">
          水平线
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().setHardBreak().run()">
          强制换行
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().undo().run()">
          撤销
        </a-button>
        <a-button size="small" @click="editor?.chain().focus().redo().run()">
          重做
        </a-button>
      </div>
    </div>
    <EditorContent :editor="editor" class="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { Level } from '@tiptap/extension-heading';

interface IProps {
  value?: string;
  placeholder?: string;
}

defineOptions({
  name: 'RichEditor',
});
const props = withDefaults(defineProps<IProps>(), {
  value: '',
  placeholder: '请输入内容'
});

const emit = defineEmits(['update:value']);

const renderedHtml = ref('');

const editor = useEditor({
  content: props.value || '<p></p>',
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder,
      emptyEditorClass: 'is-editor-empty',
    }),
  ],
  editorProps: {
    attributes: {
      spellcheck: 'false',
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit('update:value', html);
    renderedHtml.value = html;
  }
});

watch(
  () => props.value,
  (newVal) => {
    if (editor.value && newVal !== editor.value.getHTML()) {
      editor.value.commands.setContent(newVal || '<p></p>');
    }
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
const getCurrentHeadingLevel = () => {
  for (let i = 1; i <= 6; i++) {
    if (editor.value?.isActive('heading', { level: i })) {
      return i;
    }
  }
  return '';
};
</script>

<style lang="less">
@import '@/assets/editor.less';
</style>
<style lang="less" scoped>
.editor-container {
  max-width: 100%;
  margin: 2px auto;

  display: flex;
  flex-direction: column;

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: .25rem;
    padding: 4px;
  }

  .control-group {
    align-items: flex-start;
    background-color: var(--white);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    // padding: 1.5rem
  }

  .control-group .sticky {
    position: sticky;
    top: 0
  }

  [data-node-view-wrapper]>.control-group {
    padding: 0
  }

  // button {
  //   background: var(--gray-2);
  //   border-radius: .5rem;
  //   border: none;
  //   color: var(--black);
  //   font-family: inherit;
  //   font-size: .875rem;
  //   font-weight: 500;
  //   line-height: 1.15;
  //   margin: none;
  //   padding: .375rem .625rem;
  //   transition: all .2s cubic-bezier(.65, .05, .36, 1)
  // }

  // button:hover {
  //   background-color: var(--gray-3);
  //   color: var(--black-contrast)
  // }

  // button[disabled] {
  //   background: var(--gray-1);
  //   color: var(--gray-4)
  // }

  // button:checked {
  //   accent-color: var(--purple)
  // }

  // button.primary {
  //   background: var(--black);
  //   color: var(--white)
  // }

  // button.primary:hover {
  //   background-color: var(--black-contrast)
  // }

  // button.primary[disabled] {
  //   background: var(--gray-1);
  //   color: var(--gray-4)
  // }

  button.is-active {
    background: var(--purple);
    color: var(--white)
  }

  button.is-active:hover {
    background-color: var(--purple-contrast);
    color: var(--white)
  }

  // button:not([disabled]) {
  //   cursor: pointer
  // }

  .editor {
    border: 1px solid #ccc;
    padding: 1px;
    max-width: 800px;
    min-height: 100px;
    max-height: 800px;
    background: #fff;
    overflow-y: auto;



    :deep(.tiptap) {
      caret-color: var(--purple);
      margin: 1.5rem;

      p.is-editor-empty:first-child::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }

      :first-child {
        margin-top: 0
      }

      &:focus {
        outline: none
      }

      ::-webkit-scrollbar-track {
        background-clip: padding-box;
        background-color: transparent;
        border: 4px solid transparent;
        border-radius: 8px
      }

      ::-webkit-scrollbar-thumb {
        background-clip: padding-box;
        background-color: #0000;
        border: 4px solid rgba(0, 0, 0, 0);
        border-radius: 8px
      }

      :hover::-webkit-scrollbar-thumb {
        background-color: #0000001a
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: #00000026
      }

      ::-webkit-scrollbar-button {
        display: none;
        height: 0;
        width: 0
      }

      ::-webkit-scrollbar-corner {
        background-color: transparent
      }



      input[type=text],
      textarea {
        background-color: unset;
        border: 1px solid var(--gray-3);
        border-radius: .5rem;
        color: var(--black)
      }

      input[type=text]::-moz-placeholder,
      textarea::-moz-placeholder {
        color: var(--gray-4)
      }

      input[type=text]::placeholder,
      textarea::placeholder {
        color: var(--gray-4)
      }

      input[type=text]:hover,
      textarea:hover {
        background-color: unset;
        border-color: var(--gray-4)
      }

      input[type=text]:focus-visible,
      input[type=text]:focus,
      textarea:focus-visible,
      textarea:focus {
        border-color: var(--purple);
        outline: none
      }

      select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="Gray" d="M7 10l5 5 5-5z"/></svg>');
        background-repeat: no-repeat;
        background-position: right .1rem center;
        background-size: 1.25rem 1.25rem;
        padding-right: 1.25rem
      }

      select:focus {
        outline: 0
      }

      form {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        gap: .25rem
      }

      .hint {
        align-items: center;
        background-color: var(--yellow-light);
        border-radius: .5rem;
        border: 1px solid var(--gray-2);
        display: flex;
        flex-direction: row;
        font-size: .75rem;
        gap: .25rem;
        line-height: 1.15;
        padding: .3rem .5rem
      }

      .hint.purple-spinner,
      .hint.error {
        justify-content: center;
        text-align: center;
        width: 100%
      }

      .hint .badge {
        background-color: var(--gray-1);
        border: 1px solid var(--gray-3);
        border-radius: 2rem;
        color: var(--gray-5);
        font-size: .625rem;
        font-weight: 700;
        line-height: 1;
        padding: .25rem .5rem
      }

      .hint.purple-spinner {
        background-color: var(--purple-light)
      }

      .hint.purple-spinner:after {
        content: "";
        background-image: url("data:image/svg+xml;utf8,<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='28px' height='30px' viewBox='0 0 24 30' style='enable-background:new 0 0 50 50;' xml:space='preserve'><rect x='0' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0' dur='0.6s' repeatCount='indefinite'/></rect><rect x='10' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0.2s' dur='0.6s' repeatCount='indefinite'/></rect><rect x='20' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0.4s' dur='0.6s' repeatCount='indefinite'/></rect></svg>");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        height: 1rem;
        width: 1rem
      }

      .hint.error {
        background-color: var(--red-light)
      }

      .label,
      .label-small,
      .label-large {
        color: var(--black);
        font-size: .8125rem;
        font-weight: 500;
        line-height: 1.15
      }

      .label-small {
        color: var(--gray-5);
        font-size: .75rem;
        font-weight: 400
      }

      .label-large {
        font-size: .875rem;
        font-weight: 700
      }

      hr {
        border: none;
        border-top: 1px solid var(--gray-3);
        margin: 0;
        width: 100%
      }

      kbd {
        background-color: var(--gray-2);
        border: 1px solid var(--gray-2);
        border-radius: .25rem;
        font-size: .6rem;
        line-height: 1.15;
        padding: .1rem .25rem;
        text-transform: uppercase
      }



      .flex-row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: space-between;
        width: 100%
      }

      .switch-group {
        align-items: center;
        background: var(--gray-2);
        border-radius: .5rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex: 0 1 auto;
        justify-content: flex-start;
        padding: .125rem
      }

      .switch-group label {
        align-items: center;
        border-radius: .375rem;
        color: var(--gray-5);
        cursor: pointer;
        display: flex;
        flex-direction: row;
        font-size: .75rem;
        font-weight: 500;
        gap: .25rem;
        line-height: 1.15;
        min-height: 1.5rem;
        padding: 0 .375rem;
        transition: all .2s cubic-bezier(.65, .05, .36, 1)
      }

      .switch-group label:has(input:checked) {
        background-color: var(--white);
        color: var(--black-contrast)
      }

      .switch-group label:hover {
        color: var(--black)
      }

      .switch-group label input {
        display: none;
        margin: unset
      }

      .output-group {
        background-color: var(--gray-1);
        display: flex;
        flex-direction: column;
        font-family: JetBrainsMono, monospace;
        font-size: .75rem;
        gap: 1rem;
        margin-top: 2.5rem;
        padding: 1.5rem
      }

      .output-group label {
        color: var(--black);
        font-size: .875rem;
        font-weight: 700;
        line-height: 1.15
      }
    }

    ::-webkit-scrollbar {
      height: 14px;
      width: 14px
    }


  }

}
</style>
