import React, { useState, useRef, useEffect } from 'react';
import { Page, Header, useNavigate } from 'zmp-ui';
import { useThemeStore } from '@/stores/theme.store';
import { Input, Button, Avatar, Spin, Typography, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, BulbOutlined, CheckCircleOutlined, FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  reportUrl?: string;
  imageUrl?: string;
  action?: {
      type: 'CREATE_TASK' | 'GENERATE_REPORT';
      payload: any;
  };
}

const FileArtifact: React.FC<{ url: string }> = ({ url }) => (
    <a 
      href={url} 
      target="_blank" 
      rel="noreferrer"
      className="mt-4 p-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between group active:scale-[0.98] no-underline"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
          <FileTextOutlined style={{ fontSize: '20px' }} />
        </div>
        <div>
          <div className="text-[12px] font-black text-slate-800 uppercase tracking-tight">Tải Báo Cáo</div>
          <div className="text-[10px] text-slate-500 font-medium">Định dạng Word (.docx)</div>
        </div>
      </div>
      <div className="p-2 h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
        <DownloadOutlined style={{ fontSize: '16px' }} />
      </div>
    </a>
  );
  
  const ImageArtifact: React.FC<{ url: string }> = ({ url }) => (
    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-white group relative">
      <img src={url} alt="AI Generated" className="w-full h-auto object-cover max-h-48" />
    </div>
  );

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
    const [typingQueue, setTypingQueue] = useState<string[]>([]);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Hiệu ứng Typewriter để ép nhả chữ dù dữ liệu bị đệm
    useEffect(() => {
        if (typingQueue.length > 0 && !typingIntervalRef.current) {
            typingIntervalRef.current = setInterval(() => {
                setTypingQueue(prev => {
                    if (prev.length === 0) {
                        if (typingIntervalRef.current) {
                            clearInterval(typingIntervalRef.current);
                            typingIntervalRef.current = null;
                        }
                        return prev;
                    }
                    const nextChar = prev[0];
                    const remaining = prev.slice(1);
                    
                    setMessages(msgs => {
                        const lastMsg = msgs[msgs.length - 1];
                        if (lastMsg && lastMsg.role === 'ai') {
                            return [...msgs.slice(0, -1), { ...lastMsg, content: lastMsg.content + nextChar }];
                        }
                        return msgs;
                    });
                    
                    return remaining;
                });
            }, 2); // Cực nhanh: 2ms
        }
    }, [typingQueue]);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentPrompt = inputValue;
        setInputValue('');
        setIsTyping(true);

        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: aiMsgId,
            role: 'ai',
            content: '',
            timestamp: new Date()
        }]);

        try {
            const userData = JSON.parse(localStorage.getItem('zma_user_data') || '{}');
            const tenantName = userData.tenant?.name || 'Doanh nghiệp Vanguard';
            const tenantDesc = userData.tenant?.description || 'Hệ thống quản trị doanh nghiệp';
            const tenantId = userData.tenant?.id || localStorage.getItem('tenant_id') || '1';
            const accessToken = localStorage.getItem('zma_access_token');

            console.log('DEBUG: AI Request with TenantId:', tenantId, 'Token exists:', !!accessToken);
            if (!accessToken) {
                message.warning('Bạn chưa đăng nhập hoặc phiên làm việc hết hạn.');
            }

            const response = await fetch('http://localhost:8001/api/v1/agent/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: currentPrompt,
                    tenant_name: tenantName,
                    tenant_description: tenantDesc,
                    access_token: accessToken,
                    history: messages.slice(-6).map(m => ({
                        role: m.role === 'ai' ? 'assistant' : 'user',
                        content: m.content
                    }))
                }),
                cache: 'no-store'
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                setIsTyping(false);
                let partialData = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    partialData += decoder.decode(value, { stream: true });
                    const lines = partialData.split('\n\n');
                    partialData = lines.pop() || '';

                    for (const line of lines) {
                        const cleanLine = line.replace(/^data: /, '').trim();
                        if (!cleanLine || cleanLine === '[DONE]') continue;

                        try {
                            const data = JSON.parse(cleanLine);
                            if (data.text) {
                                const chars = data.text.split('');
                                setTypingQueue(prev => [...prev, ...chars]);
                            }
                            
                            if (data.report_url) {
                                setMessages(msgs => msgs.map(m => m.id === aiMsgId ? { ...m, reportUrl: data.report_url } : m));
                            }
                            if (data.image_url) {
                                setMessages(msgs => msgs.map(m => m.id === aiMsgId ? { ...m, imageUrl: data.image_url } : m));
                            }
                        } catch (e) {}
                    }
                }
            }
        } catch (error) {
            message.error('Lỗi kết nối AI');
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: 'Lỗi kết nối hệ thống.' } : m));
        } finally {
            setIsTyping(false);
        }
    };
    const suggestedPrompts = [
        "Ai đi muộn tháng này?",
        "Tạo task cho team Dev",
        "Thống kê hiệu suất"
    ];

    return (
        <Page className={`flex flex-col h-screen overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-[#fcfdff]'}`}>
            <Header title="Vanguard AI Assistant" showBackIcon />
            
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide" style={{ paddingBottom: '160px' }}>
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                            {msg.role === 'user' ? (
                                <div className={`px-5 py-3 rounded-[24px] rounded-tr-none max-w-[85%] shadow-sm ${isDarkMode ? 'bg-[#262626] text-white border border-white/5' : 'bg-[#1e3ba1] text-white shadow-blue-900/10'}`}>
                                    <div className="text-[15px] leading-relaxed font-medium">{msg.content}</div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 w-full max-w-[95%]">
                                    <div className="flex gap-3">
                                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-blue-500/20">
                                            <RobotOutlined className="text-white text-[16px]" />
                                        </div>
                                        <div className={`flex-1 px-5 py-4 rounded-[24px] rounded-tl-none ${isDarkMode ? 'bg-[#1a1a1c] text-gray-200 border border-white/5' : 'bg-white text-gray-800 shadow-sm border border-gray-100'}`}>
                                            <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                                                {msg.content || (isTyping && msg.id === messages[messages.length-1].id ? <Spin size="small" /> : '')}
                                            </div>
                                            {msg.reportUrl && <FileArtifact url={msg.reportUrl} />}
                                            {msg.imageUrl && <ImageArtifact url={msg.imageUrl} />}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>
            </div>

            {/* Premium Input Area */}
            <div className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isDarkMode ? 'bg-black/80' : 'bg-white/90'} backdrop-blur-xl border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`} 
                 style={{ 
                     bottom: 'var(--zmp-navigation-bar-height, 64px)',
                     paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
                     paddingTop: '16px',
                     paddingLeft: '16px',
                     paddingRight: '16px'
                 }}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-2 overflow-x-auto mb-4 scrollbar-hide px-1">
                        {suggestedPrompts.map((p, i) => (
                            <button key={i} onClick={() => setInputValue(p)} className={`px-5 py-2.5 rounded-2xl border text-[12px] font-black whitespace-nowrap transition-all active:scale-95 shadow-sm ${isDarkMode ? 'bg-[#1a1a1c] border-white/10 text-gray-400 hover:text-white' : 'bg-white border-gray-100 text-gray-600 hover:text-[#1e3ba1]'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-[28px] border transition-all ${isDarkMode ? 'bg-[#1a1a1c] border-white/10 focus-within:border-blue-500 shadow-2xl' : 'bg-[#f0f2f5] border-gray-100 focus-within:border-blue-400 shadow-inner'}`}>
                        <Input 
                            autoFocus
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={handleSendMessage}
                            placeholder="Hỏi Vanguard AI..."
                            variant="borderless"
                            className={`flex-1 px-4 py-2 font-bold text-[15px] ${isDarkMode ? 'text-white placeholder-gray-600' : 'text-gray-900'}`}
                        />
                        <Button 
                            type="primary" 
                            shape="circle" 
                            icon={<SendOutlined className="text-white" />}
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className={`flex items-center justify-center shadow-lg border-none ${!inputValue.trim() || isTyping ? 'bg-gray-400' : 'bg-gradient-to-tr from-[#1e3ba1] to-[#2563eb]'}`}
                            style={{ width: 44, height: 44 }}
                        />
                    </div>
                </div>
            </div>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </Page>
    );
};

export default AdminAiAgentPage;
