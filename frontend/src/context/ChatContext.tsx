"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuth } from "./AuthContext";

interface Message {
  _id: string;
  senderId: string;
  text?: string;
  image?: string;
  createdAt: string;
}

export interface MessageData {
  text?: string;
  image?: string;
}

interface ChatContextProps {
  isMessagesLoading: boolean;
  messages: Message[] | [];
  setMessages: Dispatch<SetStateAction<Message[] | []>>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessageData) => Promise<void>;
  setMessagesLoading: Dispatch<SetStateAction<boolean>>;
}

export const ChatContext = createContext<ChatContextProps>({
  isMessagesLoading: false,
  messages: [],
  setMessages: () => {},
  getMessages: async () => {},
  sendMessage: async () => {},
  setMessagesLoading: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMessagesLoading, setMessagesLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedUser, socket } = useAuth();

  const getMessages = async (userId: string) => {
    setMessagesLoading(true);
    try {
      const res = await axiosInstance.get(`/api/v1/messages/${userId}`);
      setMessages(res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async (messageData: MessageData) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/messages/send/${selectedUser?._id}`,
        messageData
      );
      const newMessage = res.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!selectedUser || !socket) return;

    // Define subscribeToMessages function inside useEffect to avoid re-creations
    const subscribeToMessages = () => {
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser =
          newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    };

    const unsubscribeFromMessages = () => {
      if (socket) {
        socket.off("newMessage");
      }
    };

    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, socket]); // Only re-run the effect when selectedUser or socket change

  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        setMessagesLoading,
        setMessages,
        getMessages,
        messages,
        isMessagesLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
