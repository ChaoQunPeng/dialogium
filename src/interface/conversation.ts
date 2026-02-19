/**
 * 表示单个对话项的数据结构
 * 包含类型和内容数组
 */
export interface IConversationItem {
  /** 对话项类型（如：text文本，choice选择等） */
  type: string;
  /** 对话内容数组 */
  contentList: string[];
}
