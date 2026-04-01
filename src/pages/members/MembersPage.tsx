import React, { useState } from "react";
import { Input, Button, Card, Avatar, Tag, Space, Typography, Row, Col, Badge, ConfigProvider, theme, Drawer, Menu } from "antd";
import { 
  SearchOutlined, FilterOutlined, PlusOutlined, TeamOutlined, RiseOutlined, RightOutlined,
  AppstoreOutlined, SolutionOutlined, IdcardOutlined, ShoppingCartOutlined, ShopOutlined,
  ContainerOutlined, FileTextOutlined, AccountBookOutlined, PieChartOutlined, FormOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Page } from "zmp-ui";
import { useThemeStore } from "../../stores/theme.store";

const { Title, Text } = Typography;

interface Member {
  id: number;
  name: string;
  department: string;
  role: string;
  roleColor: string;
  avatar: string | null;
  status: "online" | "away" | "offline";
  initials?: string;
}

const members: Member[] = [
  // ... Keep members list
  {
    id: 1,
    name: "Nguyễn Văn An",
    department: "Trưởng phòng Kỹ thuật",
    role: "ADMIN",
    roleColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    avatar: "https://i.pravatar.cc/40?img=1",
    status: "online",
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    department: "Thiết kế UI/UX",
    role: "NHÂN VIÊN",
    roleColor: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
    avatar: "https://i.pravatar.cc/40?img=5",
    status: "online",
  },
  {
    id: 3,
    name: "Lê Minh Tuấn",
    department: "Phát triển Mobile",
    role: "NHÂN VIÊN",
    roleColor: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
    avatar: "https://i.pravatar.cc/40?img=3",
    status: "online",
  },
  {
    id: 4,
    name: "Phạm Thành",
    department: "Quản lý dự án",
    role: "MANAGER",
    roleColor: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    avatar: null,
    initials: "PT",
    status: "away",
  },
];

const MembersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const { isDarkMode, primaryColor, toggleSidebar } = useThemeStore();

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <Page className={`members-page-container ${isDarkMode ? 'bg-[#000000]' : 'bg-[#f8f9fa]'}`}>
        {/* Top Header Row */}
        <div className={`flex items-center justify-between px-5 pt-12 pb-4 transition-colors ${isDarkMode ? 'bg-[#000000]' : 'bg-[#f8f9fa]'}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className={`${isDarkMode ? 'text-blue-400' : 'text-blue-900'} hover:opacity-70`}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
              </svg>
            </button>
            <span className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
              Enterprise Hub
            </span>
          </div>
          <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} shadow-sm`}>
            <img src="https://i.pravatar.cc/100?img=9" alt="avatar" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="px-5 pt-2 pb-24">
          {/* Page Header Area */}
          <div className="mb-6">
            <Title level={2} className="!m-0 !font-black !text-[26px] dark:text-white">
              Thành viên
            </Title>
            <Text className="text-gray-500 dark:text-gray-400 font-medium text-[13px]">Quản lý đội ngũ nhân sự và phân quyền</Text>
          </div>

          {/* Search Area */}
          <div className="mb-6 flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Tìm kiếm tên, bộ phận..."
                prefix={<SearchOutlined className="text-gray-400 mr-2" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border-none h-14 shadow-sm dark:bg-gray-800 font-medium !text-gray-600"
                size="large"
              />
            </div>
            <Button 
              icon={<FilterOutlined className="text-blue-900 text-lg" />} 
              className="rounded-2xl flex items-center justify-center h-14 w-14 border-none shadow-sm dark:bg-gray-800 bg-[#f0f2f5]" 
            />
          </div>

          {/* Stats Section */}
          <div className="mb-6">
            {/* Total Personnel Card */}
            <Card className="rounded-[24px] shadow-sm border-none overflow-hidden dark:bg-gray-800 mb-4 py-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-black text-gray-500 uppercase tracking-widest">TỔNG NHÂN SỰ</span>
                <TeamOutlined className="text-blue-900 text-xl" />
              </div>
              <div className="text-[42px] font-black text-blue-900 dark:text-blue-400 leading-none">124</div>
              <div className="flex items-center gap-1 mt-3">
                <RiseOutlined className="text-gray-400 text-xs" />
                <span className="text-gray-400 text-[11px] font-bold">+12% tháng này</span>
              </div>
            </Card>

            {/* Row of smaller cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-[24px] shadow-sm border-none dark:bg-gray-800 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-black text-gray-500 uppercase tracking-tight leading-none">ĐANG LÀM</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>
                <div className="text-[34px] font-black text-gray-900 dark:text-white leading-none mb-1">98</div>
                <Text className="text-[11px] text-gray-400 font-bold">Active now</Text>
              </Card>
              <Card className="rounded-[24px] shadow-sm border-none dark:bg-gray-800 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-black text-gray-500 uppercase tracking-tight leading-none">ĐANG NGHỈ</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>
                <div className="text-[34px] font-black text-gray-900 dark:text-white leading-none mb-1">26</div>
                <Text className="text-[11px] text-gray-400 font-bold">On leave</Text>
              </Card>
            </div>
          </div>

          {/* Member List Section */}
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[13px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">DANH SÁCH NHÂN VIÊN</span>
            <Button type="link" className="text-blue-600 dark:text-blue-400 font-black text-[13px] p-0">Xem tất cả</Button>
          </div>

          <div className="space-y-3">
            {filtered.map((member) => (
              <Card key={member.id} className="rounded-[22px] shadow-sm border-none dark:bg-gray-800 py-0" styles={{ body: { padding: '14px 18px' } }}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      src={member.avatar || undefined}
                      size={54}
                      className="rounded-full shadow-sm border-2 border-white dark:border-gray-700 bg-blue-500 font-bold"
                    >
                      {!member.avatar && member.initials}
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${member.status === "online" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-black text-gray-900 dark:text-white truncate tracking-tight">{member.name}</div>
                    <div className="text-[12px] text-gray-400 font-medium truncate">{member.department}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag 
                      bordered={false} 
                      className={`!rounded-full px-3 py-0.5 font-black text-[9px] m-0 ${member.roleColor}`}
                    >
                      {member.role}
                    </Tag>
                    <RightOutlined className="text-gray-400 text-[12px]" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Global Floating Action Button */}
        <button
          className="fixed bottom-28 right-6 w-16 h-16 rounded-[22px] bg-blue-900 text-white flex items-center justify-center z-40 shadow-xl transition-all active:scale-95 hover:bg-blue-800"
          style={{ boxShadow: "0 8px 20px rgba(23, 37, 84, 0.4)" }}
        >
          <PlusOutlined style={{ fontSize: '28px', fontWeight: 'bold' }} />
        </button>
      </Page>
    </ConfigProvider>
  );
};

export default MembersPage;

