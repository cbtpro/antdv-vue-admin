import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import '@/assets/layout-footer.less';
import '@/style.css';
import App from '@/App.vue';
import router from '@/router';
import en from '@/locales/en';
import zh from '@/locales/zh';
import { useAppStore } from '@/stores/app';
import Directives from './directives';

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: {
    en,
    zh,
  },
});

const app = createApp(App);
const pinia = createPinia();
app.use(Directives);
app.use(router);
app.use(pinia);
app.use(i18n);
app.use(Antd);

const appStore = useAppStore(pinia);
appStore.initSettings();
i18n.global.locale.value = appStore.locale;

app.mount('#app');
