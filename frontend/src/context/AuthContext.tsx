"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { apiURL } from "@/utils/api-url";
import { axiosInstance } from "@/lib/axios";
import { io, Socket } from "socket.io-client";

export interface User {
  _id: string;
  email: string;
  userName: string;
  image?: string;
  created_at: string;
}

interface Message {
  _id: string;
  senderId: string;
  text?: string;
  image?: string;
  createdAt: string;
}

interface Login {
  email: string;
  password: string;
}

export interface MessageData {
  text?: string;
  image?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoggingIn: boolean;
  onlineUsers: string[]; // Add online users state
  socket: Socket | null;
  selectedUser: User | null;
  login: (credentials: Login) => Promise<void>;
  logout: () => void;
  authCheck: () => Promise<void>;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoggingIn: false,
  onlineUsers: [],
  socket: null,
  selectedUser: null,
  login: async () => {},
  logout: () => {},
  authCheck: async () => {},
  setSelectedUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const router = useRouter();

  const login = async ({ email, password }: Login) => {
    setIsLoggingIn(true);
    try {
      const response = await axiosInstance.post(`/api/v1/auth/login`, {
        email,
        password,
      });

      if (response.status === 200 && response.data.user) {
        localStorage.setItem("token", response.data.user.fullName);
        setToken(response.data.user.fullName);
        setUser(response.data.user);
        toast.success("Logged in successfully");
        router.push("/home");
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const connectSocket = (userId: string) => {
    if (socket?.connected) return;

    const newSocket = io(apiURL, {
      query: { userId },
    });

    newSocket.connect();
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/v1/auth/logout");
      localStorage.removeItem("token");
      setUser(null);
      disconnectSocket();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const authCheck = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/auth/check");
      if (res.status === 200 && res.data) {
        const { user } = res.data;
        setUser(user);
        connectSocket(user._id);
      }
    } catch (error) {
      setUser(null);
      disconnectSocket();
    }
  };

  useEffect(() => {
    if (token) {
      authCheck();
    } else {
      setToken(localStorage.getItem("token"));
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        onlineUsers,
        socket,
        user,
        isLoggingIn,
        login,
        logout,
        authCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
