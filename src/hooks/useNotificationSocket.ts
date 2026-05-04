import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { vibrate } from 'zmp-sdk';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@/stores/auth.store';
import {
    useNotificationStore,
    Notification
} from '@/stores/notification.store';
import { showNotificationToast } from '@/components/NotificationToast';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/queryKeys';

export const useNotificationSocket = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        let stompClient: Client | null = null;
        let reconnectTimeout: NodeJS.Timeout;

        const connect = () => {
            try {
                /**
                 * DEV:
                 * VITE_API_BASE_URL=http://localhost:8080
                 *
                 * PROD:
                 * VITE_API_BASE_URL=https://be-nckh.fly.dev
                 *
                 * Backend endpoint:
                 * registry.addEndpoint("/ws-notification")
                 */

                const baseURL =
                    import.meta.env.VITE_API_BASE_URL ||
                    'http://localhost:8080';
                
                // Chuẩn hóa: loại bỏ /api ở cuối nếu có để không bị trùng lặp
                const wsBaseURL = baseURL.replace(/\/api$/, '');

                // Lấy token đúng key của ZMA
                const token = localStorage.getItem('zma_access_token');

                const wsUrl = token
                    ? `${wsBaseURL}/ws-notification?token=${token}`
                    : `${wsBaseURL}/ws-notification`;

                console.log('Connecting to WebSocket at:', wsUrl);

                stompClient = new Client({
                    webSocketFactory: () => new SockJS(wsUrl),

                    reconnectDelay: 5000,

                    debug: (msg) => {
                        console.log('STOMP:', msg);
                    },

                    connectHeaders: {},

                    onConnect: () => {
                        console.log(
                            'Connected to WebSocket successfully'
                        );

                        if (!stompClient) return;

                        stompClient.subscribe(
                            '/user/queue/notifications',
                            (message) => {
                                console.log('Received WebSocket message:', message.body);
                                if (message.body) {
                                    try {
                                        const notification: Notification =
                                            JSON.parse(message.body);

                                        addNotification({
                                            ...notification,
                                            createdAt:
                                                notification.createdAt ||
                                                new Date().toISOString()
                                        });

                                        // Hiển thị banner thông báo tức thì kiểu Facebook
                                        showNotificationToast({
                                            title: notification.title,
                                            message: notification.message,
                                            type: notification.type
                                        });
                                        vibrate({});

                                        // Refresh task list and announcements when receiving notification
                                        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
                                        queryClient.invalidateQueries({ queryKey: ['announcements'] });
                                    } catch (error) {
                                        console.error(
                                            'Lỗi parse notification:',
                                            error
                                        );
                                    }
                                }
                            }
                        );
                    },

                    onStompError: (frame) => {
                        console.error(
                            'Broker reported error:',
                            frame.headers['message']
                        );
                        console.error(
                            'Additional details:',
                            frame.body
                        );
                    },

                    onWebSocketError: (error) => {
                        console.warn(
                            'WebSocket error:',
                            error
                        );
                    },

                    onDisconnect: () => {
                        console.log(
                            'Disconnected from WebSocket'
                        );
                    }
                });

                stompClient.activate();
            } catch (error) {
                console.error(
                    'Lỗi khởi tạo WebSocket:',
                    error
                );

                reconnectTimeout = setTimeout(() => {
                    connect();
                }, 5000);
            }
        };

        connect();

        return () => {
            clearTimeout(reconnectTimeout);

            try {
                if (stompClient) {
                    stompClient.deactivate();
                }
            } catch (error) {
                console.error(
                    'Disconnect error:',
                    error
                );
            }
        };
    }, [isAuthenticated, user?.id, addNotification, queryClient]);
};