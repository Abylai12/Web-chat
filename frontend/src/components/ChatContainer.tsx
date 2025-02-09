"use client";

import { useEffect, useRef } from "react";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "@/utils/format-time";
import { useChat } from "@/context/ChatContext";

// Define types for message and user
interface Message {
  _id: string;
  senderId: string;
  createdAt: string;
  image?: string;
  text?: string;
}

const ChatContainer = () => {
  const { selectedUser, user } = useAuth();
  const { messages, isMessagesLoading } = useChat();

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === user?._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === user?._id
                      ? user.image || "/avatar.png"
                      : selectedUser?.image || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === user?._id
                  ? "bg-blue-500 text-white" // Sender's message background and text color
                  : "bg-gray-200 text-black" // Receiver's message background and text color
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
