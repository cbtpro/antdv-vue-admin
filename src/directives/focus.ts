import type { Directive } from 'vue';

const focus: Directive = {
  mounted(el) {
    el.focus();
  }
};

export const name = 'Focus';
export default focus;
