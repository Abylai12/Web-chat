import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

interface User {
  _id: string;
  email: string;
  userName: string;
  image?: string;
  created_at: string;
}

interface ChatStore {
  users: User[];
  isUsersLoading: boolean;
  getUsers: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
  users: [],
  isUsersLoading: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/v1/messages/users");
      set({ users: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ isUsersLoading: false });
    }
  },
}));
