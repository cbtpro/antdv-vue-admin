import { cloneDeep } from 'lodash-es';

/**
 * 深拷贝
 * @param obj 对象
 * @returns 新对象
 */
export const deepClone = <T>(obj: T) => {
  return cloneDeep(obj);
};
