import React from 'react';
import { Typography, Progress, Badge, Avatar, Spin } from 'antd';
import { Page } from 'zmp-ui';
import {
  BellOutlined,
  ArrowUpOutlined,
  UserOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  EllipsisOutlined,
  RightOutlined
} from '@ant-design/icons';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard.api';
import { QUERY_KEYS } from '@/api/queryKeys';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const today = dayjs().locale('vi').format('dddd, D [Tháng] M, YYYY');

  // Empty data for fallbacks
  const activityData: any[] = [];
  const contractData: any[] = [];

  // Fetch real summary data
  const { data: stats, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.SUMMARY,
    queryFn: async () => {
        const res = await dashboardApi.getSummary();
        console.log("Dashboard Data Fetched:", res);
        return res;
    },
  });

  const statsData = stats || {
    totalEmployees: 0,
    todayAttendance: 0,
    pendingTasks: 0,
    totalProducts: 0,
    inventoryValue: 0,
    operationalEfficiency: 0,
    weeklyActivity: [],
    recentTasks: []
  };

  return (
    <Page className={`
      min-h-screen pb-24 p-4 pt-2 space-y-6 max-w-lg mx-auto overflow-hidden transition-all duration-300
      ${isDarkMode ? 'bg-black text-white' : 'bg-[#fbfcff] text-gray-800'}
    `}>
      {isLoading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm"><Spin /></div>}
      
      {/* Welcome greeting */}
      <div className="space-y-0.5 px-0.5">
        <Title level={3} style={{ margin: 0, fontWeight: 800 }} className={isDarkMode ? 'text-white' : 'text-[#1a1f36]'}>
          Chào, {user?.fullName || user?.name || user?.username || 'Quản trị viên'}
        </Title>
        <Text className="text-gray-400 text-[13px] font-semibold">
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </Text>
      </div>

      {/* Main Revenue Highlight Card */}
      <div className={`rounded-[28px] p-7 text-white shadow-2xl relative overflow-hidden group transition-all ${isDarkMode ? 'bg-gradient-to-br from-[#1e3a8a] to-[#000000] shadow-blue-900/20' : 'bg-gradient-to-br from-[#1a3faf] to-[#0d225c] shadow-blue-200/50'}`}>
        <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
           <ThunderboltOutlined style={{ fontSize: '180px' }} />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="space-y-1">
            <Text className="text-white/60 text-[10px] uppercase font-heavy tracking-[0.2em]">Giá trị kho (Ước tính)</Text>
            <div className="text-3xl font-black mt-1 tracking-tight">
                {statsData.inventoryValue.toLocaleString('vi-VN')} VNĐ
            </div>
          </div>

          <div className="inline-flex items-center bg-white/10 backdrop-blur-xl rounded-full px-4 py-1.5 text-[11px] font-bold border border-white/20">
            <ArrowUpOutlined className="mr-1.5 text-emerald-400" />
            <span>+12.5%</span>
          </div>
        </div>
      </div>

      {/* Two-column Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className={`rounded-[28px] p-5 shadow-sm border ${isDarkMode ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'} hover:shadow-md transition-shadow`}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
            <UserOutlined className="text-[#4f46e5] text-lg" />
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Tổng nhân sự</div>
            <div className={`text-2xl font-black leading-none ${isDarkMode ? 'text-white' : 'text-[#1a1f36]'}`}>
                {statsData.totalEmployees}
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className={`rounded-[28px] p-5 shadow-sm border ${isDarkMode ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'} hover:shadow-md transition-shadow`}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-cyan-900/30' : 'bg-cyan-50'}`}>
            <ThunderboltOutlined className="text-[#0891b2] text-lg" />
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Việc cần làm</div>
            <div className={`text-2xl font-black leading-none ${isDarkMode ? 'text-white' : 'text-[#1a1f36]'}`}>
                {statsData.pendingTasks}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal List Card */}
      <div className={`rounded-[28px] p-5 flex items-center justify-between border ${isDarkMode ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
            <FileTextOutlined className="text-indigo-400 text-xl" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mã hàng trong kho</div>
            <div className={`text-2xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-[#1a1f36]'}`}>
                {statsData.totalProducts}
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contractData}>
              <Bar
                dataKey="value"
                fill={isDarkMode ? '#3b82f6' : '#1a3faf'}
                radius={[3, 3, 0, 0]}
                barSize={12}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Activity Chart Section */}
      <div className={`rounded-[32px] p-6 border shadow-sm space-y-7 relative group transition-all ${isDarkMode ? 'bg-[#121212] border-gray-800' : 'bg-white border-gray-50'}`}>
        <div className="flex items-center justify-between">
          <Title level={5} style={{ margin: 0, fontSize: '13px' }} className={`font-extrabold uppercase tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-[#1a1f36]'}`}>
            Hoạt động tháng
          </Title>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
            <EllipsisOutlined className="text-gray-300 text-xl" />
          </div>
        </div>

        <div style={{ width: '100%', height: 192 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statsData.weeklyActivity.length > 0 ? statsData.weeklyActivity : activityData} margin={{ top: 0, right: 0, left: -45, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDarkMode ? '#64748b' : '#adb5bd', fontSize: 11, fontWeight: 700 }}
                dy={12}
              />
              <Tooltip
                cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(242, 245, 252, 0.4)' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                  color: isDarkMode ? '#f8fafc' : '#1e293b'
                }}
              />
              <Bar
                dataKey="value"
                radius={[12, 12, 12, 12]}
                barSize={34}
              >
                {(statsData.weeklyActivity.length > 0 ? statsData.weeklyActivity : activityData).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value > 0 ? (isDarkMode ? '#3b82f6' : '#1a3faf') : (isDarkMode ? '#1e293b' : '#e5e7eb')}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Business Health Section with Custom Progress UI */}
      <div className="space-y-5 px-1 pt-2">
        <Title level={5} style={{ margin: 0, fontSize: '13px' }} className={`font-extrabold uppercase tracking-[0.15em] ${isDarkMode ? 'text-gray-400' : 'text-[#1a1f36]'}`}>
          Sức khỏe doanh nghiệp
        </Title>
        <div className={`rounded-[32px] p-6 border shadow-sm space-y-7 transition-all ${isDarkMode ? 'bg-[#121212] border-gray-800' : 'bg-white border-gray-50'}`}>
          <div className="space-y-3.5">
            <div className="flex justify-between items-end">
              <Text className={`text-[11px] font-extrabold tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-[#475569]'}`}>HIỆU SUẤT VẬN HÀNH</Text>
              <Text className={`text-[11px] font-black ${isDarkMode ? 'text-blue-400' : 'text-[#1a3faf]'}`}>{statsData.operationalEfficiency.toFixed(1)}%</Text>
            </div>
            <Progress percent={statsData.operationalEfficiency} showInfo={false} strokeColor={isDarkMode ? '#3b82f6' : '#1a3faf'} railColor={isDarkMode ? '#1e293b' : '#f1f5f9'} size={12} strokeLinecap="round" />
          </div>

          <div className="space-y-3.5">
            <div className="flex justify-between items-end">
              <Text className={`text-[11px] font-extrabold tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-[#475569]'}`}>ĐÁNH GIÁ RỦI RO</Text>
              <Text className="text-[11px] font-black text-[#ef4444]">8%</Text>
            </div>
            <Progress percent={8} showInfo={false} strokeColor="#ef4444" railColor={isDarkMode ? '#1e293b' : '#f1f5f9'} size={12} strokeLinecap="round" />
          </div>

          <div className="space-y-3.5">
            <div className="flex justify-between items-end">
              <Text className={`text-[11px] font-extrabold tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-[#475569]'}`}>TỶ LỆ GIỮ CHÂN</Text>
              <Text className={`text-[11px] font-black ${isDarkMode ? 'text-gray-400' : 'text-[#64748b]'}`}>98.5%</Text>
            </div>
            <Progress percent={98.5} showInfo={false} strokeColor={isDarkMode ? '#64748b' : '#64748b'} railColor={isDarkMode ? '#1e293b' : '#f1f5f9'} size={12} strokeLinecap="round" />
          </div>
        </div>
      </div>

      {/* Task List / Agenda Section */}
      <div className="space-y-5 px-1 pt-2">
        <div className="flex items-center justify-between">
          <Title level={5} style={{ margin: 0, fontSize: '13px' }} className={`font-extrabold uppercase tracking-[0.15em] ${isDarkMode ? 'text-gray-400' : 'text-[#1a1f36]'}`}>
            Công việc gần đây
          </Title>
          <div className="text-[#2563eb] text-[11px] font-black tracking-widest hover:underline cursor-pointer uppercase">Xem tất cả</div>
        </div>

        <div className="space-y-4 pb-8">
          {statsData.recentTasks.map((task: any, idx: number) => {
            const date = dayjs(task.createdAt || task.dueDate);
            const tagColor = task.priority === 'HIGH' 
              ? (isDarkMode ? 'bg-red-950/30 text-red-500 border-red-900/50' : 'bg-red-50 text-red-600 border border-red-100')
              : (isDarkMode ? 'bg-blue-950/30 text-blue-500 border-blue-900/50' : 'bg-blue-50 text-blue-600 border border-blue-100');
            
            return (
              <div key={task.id || idx} className={`rounded-[26px] p-4.5 border shadow-sm flex items-center justify-between transition-all active:scale-[0.99] duration-200 ${isDarkMode ? 'bg-[#121212] border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-50 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-5">
                  <div className={`w-16 h-16 rounded-[22px] flex flex-col items-center justify-center border shadow-inner ${isDarkMode ? 'bg-red-900/10 border-red-900/20' : 'bg-red-50/40 border-red-50/50'}`}>
                    <div className="text-[9px] font-extrabold text-red-500 uppercase tracking-wider mb-0.5">{date.format('MMM')}</div>
                    <div className={`text-2xl font-black leading-none ${isDarkMode ? 'text-white' : 'text-[#1a1f36]'}`}>{date.format('DD')}</div>
                  </div>
                  <div>
                    <div className={`font-extrabold text-[15px] mb-1.5 leading-tight ${isDarkMode ? 'text-white' : 'text-[#1a1f36]'}`}>{task.title}</div>
                    <div className="flex items-center space-x-2.5">
                      <div className={`text-[8px] font-bold px-2 py-0.5 rounded-[6px] shadow-sm uppercase ${tagColor}`}>{task.priority}</div>
                      <div className="text-[10px] font-bold text-gray-400 tracking-wide uppercase italic opacity-80">{task.category}</div>
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <RightOutlined className="text-gray-200 text-xs" />
                </div>
              </div>
            );
          })}
          {statsData.recentTasks.length === 0 && (
            <div className="py-10 text-center text-gray-400 font-medium">Chưa có công việc nào</div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;
