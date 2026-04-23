import React from 'react';
import { Page, useNavigate } from 'zmp-ui';
import { useThemeStore } from '@/stores/theme.store';
import { 
  QuestionCircleFilled, 
  MessageOutlined, 
  PhoneOutlined, 
  MailOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Collapse, Button, Typography, Tag } from 'antd';

const { Title, Text } = Typography;
const { Panel } = Collapse;

export const SupportPage: React.FC = () => {
    const { isDarkMode } = useThemeStore();
    const navigate = useNavigate();

    const faqData = [
        {
            category: "Chấm công & Điểm danh",
            icon: <ClockCircleOutlined />,
            questions: [
                {
                    q: "Làm thế nào để đăng ký khuôn mặt?",
                    a: "Bạn vào mục 'Tiện ích' -> 'Đăng ký khuôn mặt'. Hãy đảm bảo bạn ở nơi có đủ ánh sáng và làm theo hướng dẫn trên màn hình."
                },
                {
                    q: "Tại sao tôi không thể Check-in dù đã đến đúng vị trí?",
                    a: "Hãy kiểm tra xem bạn đã bật Định vị (GPS) trên điện thoại và cấp quyền quy cập vị trí cho ứng dụng Zalo chưa. Ngoài ra, hãy thử bật Wifi để tăng độ chính xác."
                }
            ]
        },
        {
            category: "Quản lý Công việc",
            icon: <CheckCircleOutlined />,
            questions: [
                {
                    q: "Cách nhận việc mới được giao?",
                    a: "Ngay tại trang chủ mục 'Đang chờ bạn', hãy bấm 'Nhận việc ngay'. Task sẽ chuyển sang trạng thái Đang thực hiện."
                },
                {
                    q: "Tôi cần làm gì khi hoàn thành công việc?",
                    a: "Bấm vào task đang làm, chọn 'Hoàn thành'. Bạn sẽ cần chụp ảnh minh chứng kết quả công việc để gửi cho Admin duyệt."
                }
            ]
        },
        {
            category: "Hóa đơn & Tài chính",
            icon: <FileTextOutlined />,
            questions: [
                {
                    q: "Kê khai hóa đơn nhập hàng như thế nào?",
                    a: "Vào mục 'Hóa đơn & Chứng từ', bấm dấu '+', chọn loại 'Hóa đơn Nhập' và điền thông tin, kèm theo ảnh chụp hóa đơn giấy."
                }
            ]
        }
    ];

    return (
        <Page className={`w-full min-h-screen pb-10 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
            {/* Header */}
            <div className={`px-6 pt-10 pb-16 rounded-b-[40px] text-white shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-[#1e3ba1]'}`}>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                        <QuestionCircleFilled className="text-3xl text-white" />
                    </div>
                    <Title level={2} style={{ margin: 0, color: 'white', fontWeight: 900 }}>Trung tâm Trợ giúp</Title>
                    <Text className="text-white/70 mt-2 font-medium">Chào mừng bạn! Chúng tôi có thể giúp gì cho bạn hôm nay?</Text>
                </div>
            </div>

            {/* Support Actions */}
            <div className="px-5 -mt-8 mb-8 grid grid-cols-2 gap-4">
                <div className={`p-5 rounded-[24px] shadow-sm border flex flex-col gap-3 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-white'}`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <MessageOutlined className="text-lg text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Chat hỗ trợ</span>
                        <span className="text-[11px] text-gray-500 font-medium">Phản hồi trong 5 phút</span>
                    </div>
                    <button className="mt-2 py-2 w-full bg-blue-50 text-blue-600 rounded-xl text-[12px] font-bold border-none active:scale-95 transition-transform">
                        BẮT ĐẦU CHAT
                    </button>
                </div>

                <div className={`p-5 rounded-[24px] shadow-sm border flex flex-col gap-3 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-white'}`}>
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <PhoneOutlined className="text-lg text-green-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Gọi hotline</span>
                        <span className="text-[11px] text-gray-500 font-medium">Sẵn sàng 24/7</span>
                    </div>
                    <button className="mt-2 py-2 w-full bg-green-50 text-green-600 rounded-xl text-[12px] font-bold border-none active:scale-95 transition-transform">
                        GỌI NGAY
                    </button>
                </div>
            </div>

            {/* FAQs */}
            <div className="px-5 mb-8">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className={`text-[17px] font-black m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Các câu hỏi thường gặp</h3>
                    <Tag color="processing" className="m-0 rounded-full font-bold">FAQs</Tag>
                </div>

                <div className="flex flex-col gap-6">
                    {faqData.map((section, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 opacity-60">
                                <span className={isDarkMode ? 'text-white' : 'text-gray-500'}>{section.icon}</span>
                                <span className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>
                                    {section.category}
                                </span>
                            </div>
                            <Collapse 
                                ghost 
                                expandIconPosition="end"
                                className="support-collapse"
                            >
                                {section.questions.map((item, qIdx) => (
                                    <Panel 
                                        header={<span className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.q}</span>} 
                                        key={qIdx}
                                        className={`mb-3 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-white'}`}
                                    >
                                        <p className={`text-[13px] leading-relaxed m-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {item.a}
                                        </p>
                                    </Panel>
                                ))}
                            </Collapse>
                        </div>
                    ))}
                </div>
            </div>

            {/* Still Need Help? */}
            <div className="px-5 mb-8">
                <div className={`p-6 rounded-[28px] relative overflow-hidden ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-600 text-white shadow-xl shadow-blue-200'}`}>
                    {!isDarkMode && <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />}
                    <h4 className={`text-[18px] font-black mb-1 ${isDarkMode ? 'text-blue-400' : 'text-white'}`}>Vẫn cần hỗ trợ?</h4>
                    <p className={`text-[12px] opacity-80 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-white'}`}>Nếu bạn không tìm thấy câu trả lời, hãy gửi thắc mắc trực tiếp cho Admin quản lý.</p>
                    <button className={`px-6 py-3 rounded-xl text-[13px] font-black flex items-center gap-2 border-none active:scale-95 transition-transform ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
                         GỬI YÊU CẦU CHO ADMIN <ArrowRightOutlined />
                    </button>
                </div>
            </div>

            {/* Footer Links */}
            <div className="px-5 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-gray-400 text-[12px] font-medium">
                        <SafetyCertificateOutlined /> Bảo mật
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-[12px] font-medium">
                        <UserOutlined /> Điều khoản
                    </div>
                </div>
                <p className="text-center text-[11px] text-gray-400 opacity-60">© 2024 Vanguard Enterprise OS. All rights reserved.</p>
            </div>
            
            <style>{`
                .support-collapse .ant-collapse-content {
                    background: transparent !important;
                }
                .support-collapse .ant-collapse-item {
                    border-bottom: none !important;
                }
            `}</style>
        </Page>
    );
};

export default SupportPage;
