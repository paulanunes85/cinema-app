import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:4000';

interface UseSocketOptions {
  projectId: string | undefined;
}

interface UseSocketReturn {
  isConnected: boolean;
  onlineUsers: string[];
  subscribe: <T>(event: string, handler: (data: T) => void) => () => void;
}

export function useSocket({ projectId }: UseSocketOptions): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || !projectId) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join:project', { projectId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('users:online', (data: { userIds: string[] }) => {
      setOnlineUsers(data.userIds);
    });

    socket.on('user:online', (data: { userId: string }) => {
      setOnlineUsers((prev) =>
        prev.includes(data.userId) ? prev : [...prev, data.userId],
      );
    });

    socket.on('user:offline', (data: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setOnlineUsers([]);
    };
  }, [projectId]);

  const subscribe = useCallback(
    <T>(event: string, handler: (data: T) => void): (() => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};

      socket.on(event, handler);
      return () => {
        socket.off(event, handler);
      };
    },
    [],
  );

  return { isConnected, onlineUsers, subscribe };
}
