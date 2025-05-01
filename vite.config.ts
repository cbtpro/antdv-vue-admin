import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 获取当前环境
const environment = import.meta.env.MODE;
console.log(`当前环境是：${environment}`);

export default defineConfig({
  base: './',
  plugins: [vue()]

});
