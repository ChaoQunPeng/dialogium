export interface IConversationData {
  type: string;
  speaker?: string;
  contentList?: IConversationItem[];
}

export interface IConversationItem {
  content: string;
}

export interface IPerson {
  id: string;
  name: string;
  gender: number;
  roles: string[];
}
