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

/**
 * 根据权重从数组中随机取出一个元素
 * 权重值越大，被选中的概率越高
 * 权重值代表相对出现概率，例如权重100的元素出现概率是权重1的元素的100倍
 * 稀有度,建议权重值,实际感官,例子
   常见 (Common),1000
   普通 (Normal),100
   精英 (Elite),10
   罕见 (Rare),1
   传说 (Legendary),0.1
 * @param array - 输入数组，元素需要有weight属性
 * @returns 随机选择的数组元素，如果数组为空则返回undefined
 */
export function getWeightedRandomElement<T extends { weight: number }>(array: T[]): T | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }

  // 计算总权重
  const totalWeight = array.reduce((sum, item) => sum + Math.max(item.weight, 0), 0);

  // 如果所有权重都为0，返回undefined
  if (totalWeight === 0) {
    return undefined;
  }

  // 生成 0 到总权重之间的随机数
  const randomWeight = Math.random() * totalWeight;

  // 遍历数组，累积权重直到超过随机权重值
  let cumulativeWeight = 0;
  for (const item of array) {
    cumulativeWeight += Math.max(item.weight, 0); // 确保权重不为负数
    if (cumulativeWeight >= randomWeight) {
      return item;
    }
  }

  // 理论上不会执行到这里，但为了类型安全返回undefined
  return undefined;
}
