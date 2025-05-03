import type { App, Directive } from 'vue';

export interface DirectiveModule {
  name: string;
  default: Directive;
}

const modules = import.meta.glob<DirectiveModule>('./**/*.ts', { eager: true });

export default {
  install(app: App) {
    Object.entries(modules).forEach(([path, mod]) => {
      if (!mod.name || typeof mod.default !== 'object') {
        console.warn(`[Directives] 文件 ${path} 缺少 'name' 导出或默认导出不是有效指令`);
        return;
      }
      app.directive(mod.name, mod.default);
    });
  }
};
