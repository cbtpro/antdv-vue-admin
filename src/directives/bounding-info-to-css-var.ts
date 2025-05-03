import type { DirectiveBinding, Directive } from 'vue';

const PREFIX = '--bounding-info-';
interface IOptions {
  prefix?: string;
}

const setStyles = (el: HTMLElement, options: IOptions = {}) => {
  const { prefix = PREFIX } = options;
  const boundingClientRectInfo = el.getBoundingClientRect();
  const { width, height, top, right, bottom, left, x, y } = boundingClientRectInfo;
  const rawStylesStr = el.getAttribute('style');
  const rawStyles = rawStylesStr ? rawStylesStr.split(';').filter((item) => !!item && !item.includes(prefix)) : [];
  const bindingStyles = [
    {
      name: 'width',
      value: width
    },
    {
      name: 'height',
      value: height
    },
    {
      name: 'top',
      value: top
    },
    {
      name: 'right',
      value: right
    },
    {
      name: 'bottom',
      value: bottom
    },
    {
      name: 'left',
      value: left
    },
    {
      name: 'x',
      value: x
    },
    {
      name: 'y',
      value: y
    }
  ].map((item) => `${prefix}${item.name}: ${item.value}px`);
  const newStyles = rawStyles.concat(bindingStyles);
  el.setAttribute('style', newStyles.join(';'));
};
const boundingInfoToCssVar: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    setStyles(el, binding.arg as IOptions);
  },
  updated(el: HTMLElement, binding: DirectiveBinding, vnode, prevVnode) {
    setStyles(el, binding.arg as IOptions);
  }
  // beforeUnmount(el: HTMLElement, binding: DirectiveBinding) {
  //   console.log(el)
  // }
};

export const name = 'BoundingInfoToCssVar';
export default boundingInfoToCssVar

