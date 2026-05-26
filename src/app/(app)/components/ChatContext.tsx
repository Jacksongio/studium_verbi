"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
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
  // Track whether the user (or auto-restore) has made a selection.
  // Using a ref so it doesn't trigger re-renders or become a dependency.
  const hasSelected = useRef(false);

  const prefsResult = useQuery(api.userPreferences.get);
  const chats = useQuery(api.chats.listChats);
  const saveLastChat = useMutation(api.userPreferences.setLastChat);

  // Always start with a new chat (null). Users can click a past chat in the sidebar.

  const setActiveChatId = useCallback(
    (id: Id<"chats"> | null) => {
      hasSelected.current = true;
      setActiveChatIdLocal(id);
      if (id) {
        saveLastChat({ chatId: id }).catch(() => {});
      }
    },
    [saveLastChat]
  );

  return (
    <ChatContext.Provider value={{ activeChatId, setActiveChatId }}>
      {children}
    </ChatContext.Provider>
  );
}
