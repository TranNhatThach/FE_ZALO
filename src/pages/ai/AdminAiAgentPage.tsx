import React, { useState, useRef, useEffect } from 'react';
import { Page, Header, useNavigate } from 'zmp-ui';
import { useThemeStore } from '@/stores/theme.store';
import { Input, Button, Avatar, Spin, Typography, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, BulbOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  action?: {
      type: 'CREATE_TASK' | 'GENERATE_REPORT';
      payload: any;
  };
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

        // Giả lập AI nhận diện ý định tạo Task
        const isTaskRequest = inputValue.toLowerCase().includes('tạo task') || inputValue.toLowerCase().includes('giao việc');

        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: isTaskRequest 
                    ? 'Tôi đã soạn thảo nội dung công việc dựa trên yêu cầu của sếp. Sếp kiểm tra lại và nhấn xác nhận để giao việc nhé!'
                    : 'Đây là tính năng Demo. Sắp tới AI sẽ nhận lệnh này để tự gọi API hệ thống theo ý sếp.',
                timestamp: new Date(),
                action: isTaskRequest ? {
                    type: 'CREATE_TASK',
                    payload: {
                        title: 'Kiểm tra tiến độ kho',
                        description: 'Thực hiện kiểm kê 10 mặt hàng sắp hết trong kho chi nhánh 1',
                        priority: 'HIGH',
                        deadline: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')
                    }
                } : undefined
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
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 mb-[160px] scroll-smooth scrollbar-hide relative">
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
                                    
                                    {/* Tool Action Card */}
                                    {msg.action?.type === 'CREATE_TASK' && (
                                        <div className={`mt-3 p-3 rounded-xl border ${isDarkMode ? 'bg-[#1a1a1c] border-gray-700' : 'bg-blue-50 border-blue-100 shadow-inner'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <BulbOutlined className="text-yellow-500" />
                                                <span className="font-bold text-[13px] text-blue-600 uppercase tracking-tight">Dự thảo công việc</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Tiêu đề</span>
                                                    <span className={`text-[13px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{msg.action.payload.title}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Mô tả</span>
                                                    <span className={`text-[12px] opacity-80 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{msg.action.payload.description}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-white/40 p-2 rounded-lg mt-2">
                                                    <div>
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">Ưu tiên</span>
                                                        <span className="text-red-500 font-black text-[11px] uppercase">{msg.action.payload.priority}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">Hạn chót</span>
                                                        <span className={`text-[11px] font-black ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{msg.action.payload.deadline}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                block 
                                                className="mt-4 rounded-lg bg-blue-600 font-black text-[12px] h-9 shadow-sm"
                                                onClick={() => message.success('Đã xác nhận và tạo task thành công!')}
                                            >
                                                XÁC NHẬN GIAO VIỆC
                                            </Button>
                                        </div>
                                    )}

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
