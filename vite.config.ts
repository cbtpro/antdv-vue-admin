import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueMacros from 'vue-macros/vite';
import Inspect from 'vite-plugin-inspect';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

import components from 'unplugin-vue-components/vite';
import { AntDesignXVueResolver } from 'ant-design-x-vue/resolver';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
        vueJsx: vueJsx(),
      },
    }),

    Inspect(),
    vueDevTools(),
    components({
      resolvers: [AntDesignXVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 512,
    rollupOptions: {
      output: {
        manualChunks: {
          'ant-design-vue': ['ant-design-vue', '@ant-design/icons-vue'],
          '@tiptap': [
            '@tiptap/extension-bullet-list',
            '@tiptap/extension-code-block-lowlight',
            '@tiptap/extension-heading',
            '@tiptap/extension-horizontal-rule',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
            '@tiptap/extension-list-item',
            '@tiptap/extension-ordered-list',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-strike',
            '@tiptap/extension-text-style',
            // '@tiptap/pm',
            '@tiptap/starter-kit',
            '@tiptap/vue-3',
          ],
          'vue-bundle': ['pinia', 'vue', 'vue-i18n', 'vue-router'],
          vuedraggable: ['vuedraggable'],
        },
      },
    },
  },
  server: {
    proxy: {
      // 将 /api 开头的请求代理到后端服务
      '/api': {
        target: 'http://localhost:3001', // 你的 ai-app-server 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 如果你也有 WebSocket：
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
