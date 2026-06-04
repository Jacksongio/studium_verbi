"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface ChatContextValue {
  activeChatId: Id<"chats"> | null;
  setActiveChatId: (id: Id<"chats"> | null) => void;
}

const ChatContext = createContext<ChatContextValue>({
  activeChatId: null,
  setActiveChatId: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeChatId, setActiveChatIdLocal] = useState<Id<"chats"> | null>(
    null
  );

  const saveLastChat = useMutation(api.userPreferences.setLastChat);

  const setActiveChatId = useCallback(
    (id: Id<"chats"> | null) => {
      setActiveChatIdLocal(id);
      if (id) {
        saveLastChat({ chatId: id }).catch(() => {});
      }
    },
    [saveLastChat]
  );

  const contextValue = useMemo(
    () => ({ activeChatId, setActiveChatId }),
    [activeChatId, setActiveChatId]
  );

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}
