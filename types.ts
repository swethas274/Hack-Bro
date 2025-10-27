export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  image?: string; // base64 encoded image
}