import React, { useState, useRef, useEffect } from 'react';
import { Page, Header, useNavigate } from 'zmp-ui';
import { useThemeStore } from '@/stores/theme.store';
import { Input, Button, Avatar, Spin, Typography } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AdminAiAgentPage: React.FC = () => {
    const { isDarkMode } = useThemeStore();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init',
            role: 'ai',
            content: 'Chào sếp! Tôi là Trợ lý AI Quản trị doanh nghiệp. Sếp muốn thống kê chấm công, tạo công việc, hay kiểm tra dữ liệu gì hôm nay?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // TODO: Call actual AI Agent API here
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: 'Đây là tính năng Demo. Sắp tới AI sẽ nhận lệnh này để tự gọi API hệ thống thay sếp nhé!',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const suggestedPrompts = [
        "Ai đi muộn tháng này?",
        "Tạo task cho team Dev",
        "Thống kê hiệu suất"
    ];

    return (
        <Page className={`flex flex-col h-screen overflow-x-hidden ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
            <Header title="Trợ Lý AI Kế Toán/Quản Trị" showBackIcon />
            
            {/* Chat Area - Added scrollbar-hide and overflow-x-hidden */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 mt-12 mb-[160px] scroll-smooth scrollbar-hide">
                <div className="flex flex-col gap-4 w-full">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[88%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Avatar 
                                    icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                                    className={`${msg.role === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'} flex-shrink-0`}
                                />
                                <div className={`p-3 rounded-2xl break-words ${msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : isDarkMode ? 'bg-[#2a2a2c] text-white rounded-tl-none border border-gray-700' : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'}`}
                                >
                                    <Text className={msg.role === 'user' ? 'text-white' : isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
                                        {msg.content}
                                    </Text>
                                    <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-blue-200 text-right' : 'text-gray-400 text-left'}`}>
                                        {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[85%] gap-2 flex-row">
                                <Avatar icon={<RobotOutlined />} className="bg-gradient-to-r from-purple-500 to-indigo-500 flex-shrink-0" />
                                <div className={`p-4 rounded-2xl rounded-tl-none ${isDarkMode ? 'bg-[#2a2a2c]' : 'bg-white shadow-sm'}`}>
                                    <Spin size="small" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={endOfMessagesRef} />
                </div>
            </div>

            {/* Input Area - Adjusted width and z-index */}
            <div 
                className={`fixed left-0 right-0 p-4 border-t z-50 w-full ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-200'}`}
                style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))', maxWidth: '100vw' }}
            >
                {/* Suggestions */}
                <div className="flex gap-2 overflow-x-auto mb-3 pb-1 snap-x scrollbar-hide">
                    {suggestedPrompts.map((prompt, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setInputValue(prompt)}
                            className={`snap-center shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium border cursor-pointer whitespace-nowrap flex items-center gap-1 transition-colors
                                ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50'}
                            `}
                        >
                            <BulbOutlined className={isDarkMode ? "text-yellow-500" : "text-yellow-600"} />
                            {prompt}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 w-full items-center">
                    <Input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={handleSendMessage}
                        placeholder="Nhập lệnh cho Trợ lý..."
                        className={`rounded-full shadow-sm flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : ''}`}
                        size="large"
                    />
                    <Button 
                        type="primary" 
                        shape="circle" 
                        size="large"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="shadow-md bg-blue-600 flex-shrink-0"
                    />
                </div>
            </div>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </Page>
    );
};

export default AdminAiAgentPage;
