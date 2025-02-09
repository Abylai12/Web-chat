import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ChatHeader = () => {
  const { onlineUsers, selectedUser } = useAuth();

  if (!selectedUser) {
    return null; // Handle the case when there's no selected user
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.image || "/avatar.png"}
                alt={selectedUser.userName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.userName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => console.log("hi")}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
