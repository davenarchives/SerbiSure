export interface ChatConversation {
  id: number | string;
  name: string;
  badge: string;
  avatar: string;
  time: string;
  message: string;
  online: boolean;
}

type ChatListener = () => void;

class ChatStore {
  private chats: ChatConversation[] = [
    {
      id: 1,
      name: 'Vincente Ganda',
      badge: 'Cleaner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      time: '2m ago',
      message: 'Good morning po, Ma\'am Maja!',
      online: true,
    },
    {
      id: 2,
      name: 'Tiya Kalood',
      badge: 'Babysitter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      time: '1h ago',
      message: 'Thank you po, Ma\'am!',
      online: true,
    },
    {
      id: 3,
      name: 'Sisa',
      badge: 'Yaya/Cook',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      time: 'Mon',
      message: 'You: See you tomorrow!',
      online: true,
    },
  ];

  private listeners: ChatListener[] = [];

  getChats(): ChatConversation[] {
    return this.chats;
  }

  addOrUpdateChat(chat: ChatConversation) {
    const existingIndex = this.chats.findIndex(
      (c) => c.name.toLowerCase() === chat.name.toLowerCase() || c.id === chat.id
    );

    if (existingIndex >= 0) {
      // Update existing and move to top
      this.chats[existingIndex] = { ...this.chats[existingIndex], ...chat, time: 'Just now' };
      const updated = this.chats.splice(existingIndex, 1)[0];
      if (updated) {
        this.chats.unshift(updated);
      }
    } else {
      // Prepend new chat
      this.chats.unshift({ ...chat, time: 'Just now' });
    }

    this.notify();
  }

  subscribe(listener: ChatListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const chatStore = new ChatStore();
