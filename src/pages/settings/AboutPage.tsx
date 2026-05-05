import React from 'react';
import { Page, Header, useNavigate } from 'zmp-ui';
import { useThemeStore } from '../../stores/theme.store';
import {
  TeamOutlined,
  ShoppingOutlined,
  CheckSquareOutlined,
  CalculatorOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GithubOutlined
} from '@ant-design/icons';

const AboutPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  return (
    <Page className={`pb-10 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#eff6ff]'}`}>
      <Header
        title="Về ZM BusinessFlow"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className={`${isDarkMode ? 'bg-[#121212] text-white' : 'bg-white text-gray-900'}`}
      />

      <div className="px-5 pt-6 space-y-6">
        {/* Hero Section */}
        <div className={`rounded-[30px] p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/5' : 'bg-white'
          }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[28px] flex items-center justify-center shadow-2xl mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-white text-[42px] font-black italic tracking-tighter">ZM</span>
          </div>

          <h1 className={`text-[24px] font-black m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ZM BusinessFlow</h1>
          <p className="text-[14px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-2">Enterprise Operating System</p>

          <div className={`mt-6 px-4 py-2 rounded-full text-[12px] font-black ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'
            }`}>
            VERSION 1.1.4• 2026
          </div>
        </div>

        {/* Introduction */}
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest pl-2">Giới thiệu dự án</span>
          <div className={`rounded-[24px] p-6 shadow-sm ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <p className={`text-[14px] leading-relaxed font-medium m-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>ZM BusinessFlow</strong> là nền tảng quản trị doanh nghiệp thế hệ mới, được thiết kế chuyên biệt để vận hành mượt mà trên hệ sinh thái Zalo. Dự án tập trung vào việc tối ưu hóa hiệu suất làm việc và mang lại trải nghiệm quản lý di động cao cấp.
            </p>
          </div>
        </div>

        {/* Core Modules Grid */}
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest pl-2">Phân hệ cốt lõi</span>
          <div className="grid grid-cols-2 gap-4">
            <ModuleCard
              icon={<TeamOutlined className="text-blue-500" />}
              title="Nhân sự"
              desc="Quản lý nhân viên & Chấm công AI"
              isDarkMode={isDarkMode}
            />
            <ModuleCard
              icon={<ShoppingOutlined className="text-orange-500" />}
              title="Hàng hóa"
              desc="Kho hàng & Nhà cung cấp"
              isDarkMode={isDarkMode}
            />
            <ModuleCard
              icon={<CheckSquareOutlined className="text-green-500" />}
              title="Công việc"
              desc="Giao việc & Quản lý tiến độ"
              isDarkMode={isDarkMode}
            />
            <ModuleCard
              icon={<CalculatorOutlined className="text-teal-500" />}
              title="Tài chính"
              desc="Hóa đơn & Dòng tiền"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest pl-2">Thông tin liên hệ</span>
          <div className={`rounded-[24px] overflow-hidden shadow-sm ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <ContactRow
              icon={<GlobalOutlined className="text-blue-500" />}
              label="Website"
              value="https://businesmanager.vercel.app/"
              isDarkMode={isDarkMode}
            />
            <div className={`h-[1px] ml-14 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
            <ContactRow
              icon={<MailOutlined className="text-red-400" />}
              label="Email hỗ trợ"
              value=""
              isDarkMode={isDarkMode}
            />
            <div className={`h-[1px] ml-14 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
            <ContactRow
              icon={<PhoneOutlined className="text-green-500" />}
              label="Hotline"
              value=""
              isDarkMode={isDarkMode}
            />
            <div className={`h-[1px] ml-14 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
            <ContactRow
              icon={<EnvironmentOutlined className="text-orange-500" />}
              label="Địa chỉ"
              value=""
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 flex flex-col items-center opacity-40">
          <p className={`text-[11px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Powered by Vanguard AI Engine
          </p>
          <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
            © 2026 ZM BusinessFlow. All rights reserved.
          </p>
        </div>
      </div>
    </Page>
  );
};

const ModuleCard = ({ icon, title, desc, isDarkMode }: any) => (
  <div className={`p-5 rounded-[24px] border transition-all active:scale-95 ${isDarkMode ? 'bg-[#1a1a1c] border-white/5' : 'bg-white border-gray-100'
    }`}>
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[20px] mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
      {icon}
    </div>
    <h3 className={`text-[14px] font-black m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
    <p className="text-[10px] text-gray-500 font-bold mt-1 leading-tight">{desc}</p>
  </div>
);

const ContactRow = ({ icon, label, value, isDarkMode }: any) => (
  <div className="flex items-center gap-4 px-5 py-4 active:bg-gray-50/50 transition-colors">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value}</span>
    </div>
  </div>
);

export default AboutPage;
