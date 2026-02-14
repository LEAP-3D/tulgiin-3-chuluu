export type ConversationItem = {
  id: string;
  order_id: string;
  user_profile_id: string;
  worker_profile_id: string;
  last_message_at?: string | null;
};

export type ProfileInfo = {
  id: string;
  name: string;
  role: "user" | "worker";
  workTypes: string[];
};

export type MessageItem = {
  id: string;
  body: string;
  sender_profile_id: string;
  created_at: string;
  conversation_id?: string;
  read_at?: string | null;
};

export type TypingPayload = {
  sender_profile_id: string;
  is_typing: boolean;
  conversation_id?: string;
};
