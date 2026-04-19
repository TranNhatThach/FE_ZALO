import { useEffect } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore, Notification } from '@/stores/notification.store';

export const useNotificationSocket = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        let stompClient: Stomp.Client | null = null;
        let socket: any = null;

        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL || '';
            
            // Log để kiểm tra baseURL
            console.log('Connecting to WebSocket at:', `${baseURL}/ws-notification`);

            // Sử dụng global WebSocket nếu có thể, hoặc SockJS
            socket = new SockJS(`${baseURL}/ws-notification`);
            stompClient = Stomp.over(socket);

            stompClient.debug = () => { };

            stompClient.connect({}, () => {
                console.log('Connected to WebSocket successfully');
                
                if (stompClient) {
                    stompClient.subscribe(`/user/${user.id}/queue/notifications`, (message) => {
                        if (message.body) {
                            try {
                                const notification: Notification = JSON.parse(message.body);
                                addNotification({
                                    ...notification,
                                    createdAt: notification.createdAt || new Date().toISOString()
                                });
                            } catch (e) {
                                console.error('Lỗi parse notification:', e);
                            }
                        }
                    });
                }
            }, (error) => {
                console.warn('STOMP error (possibly connection refused):', error);
            });
        } catch (err) {
            console.error('Lỗi khởi tạo WebSocket:', err);
        }

        return () => {
            try {
                if (stompClient && stompClient.connected) {
                    stompClient.disconnect(() => {
                        console.log('Disconnected from WebSocket');
                    });
                }
            } catch (e) {}
        };
    }, [isAuthenticated, user?.id, addNotification]);
};
