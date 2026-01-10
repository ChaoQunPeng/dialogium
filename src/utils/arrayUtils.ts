/**
 * 从数组中随机取出一个元素
 * @param array - 输入数组
 * @returns 随机选择的数组元素，如果数组为空则返回undefined
 */
export function getRandomElement<T>(array: T[]): T | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
