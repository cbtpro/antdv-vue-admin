import { cloneDeep } from 'lodash-es';


/**
 * 生成安全随机数
 * @param min 最小范围
 * @param max 最大范围
 * @param isFloat 是否是小数
 * @returns
 */
export const random = (min = 0, max = 100, isFloat = false) => {
	const array = new Uint32Array(1);
	const maxUint = 0xffffffff;
	const randomNumber = crypto.getRandomValues(array)[0] / maxUint;
	const randomRangeValue = (max - min + 1) * randomNumber + min;
	return isFloat ? randomRangeValue : Math.floor(randomRangeValue);
};

/**
 * 生成随机字符串
 * @param len
 * @param min
 * @param max
 * @returns
 */
export const randomString = (len = true, min = 7, max = 7) => {
	let str = '';
	let range = min;
	const arr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_-+=';
	// 随机产生
	if (len) {
		range = random(min, max);
	}
	for (let i = 0; i < range; i++) {
		const pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos];
	}
	return str;
};

/**
 * 深拷贝
 * @param obj 对象
 * @returns 新对象
 */
export const deepClone = <T>(obj: T) => {
  return cloneDeep<T>(obj);
};
