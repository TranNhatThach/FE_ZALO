import React, { useState } from 'react';
import { Page } from 'zmp-ui';
import { useQuery } from '@tanstack/react-query';
import { useThemeStore } from '@/stores/theme.store';
import {
  MenuOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  RightOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { userService } from '@/services/user.service';
import UserModal from '@/components/UserModal';
import { User } from '@/types/auth.types';

const UsersPage: React.FC = () => {
  const { setSidebarCollapsed, isSidebarCollapsed, isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  const filteredUsers = users.filter((u: any) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const staffOnly = users.filter((u: any) => {
    const role = (u.roleName || (u.roles && u.roles[0]) || '').toUpperCase();
    return !role.includes('ADMIN');
  });

  const activeStaff = staffOnly.filter((u: any) => u.isActive === true).length;

  return (
    <Page className={`flex flex-col w-full h-full relative pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f9]'}`}>

      {/* 1. Page Title Area */}
      <div className="px-4 pt-4 pb-2">
        <h1 className={`text-[24px] font-black tracking-tight m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Workforce</h1>
        <p className={`text-[12px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Quản lý Nhân sự</p>
      </div>

      <div className="px-4 mt-4">
        <div className="mb-5 flex flex-col gap-1 relative z-10">
          <h1 className={`text-[28px] font-black m-0 leading-tight tracking-tight ${isDarkMode ? 'text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]' : 'text-gray-900 drop-shadow-sm'}`}>Thành viên</h1>
          <p className={`text-[13px] font-medium m-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quản lý và thiết lập quyền truy cập</p>
        </div>

        {/* 2. Search Bar */}
        <div className="mb-6 flex gap-2">
          <div className={`flex-1 flex items-center h-[48px] rounded-[16px] px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800' : 'bg-white'}`}>
            <SearchOutlined className={`text-[20px] mr-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-[15px] font-medium ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'}`}
            />
          </div>
          <button className={`w-[48px] h-[48px] rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-center border-none cursor-pointer transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
            <FilterOutlined className="text-[20px]" />
          </button>
        </div>

        {/* 3. Thống kê */}
        <div className="flex gap-3 mb-6">
          <div className={`flex-1 rounded-[24px] p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)] ${isDarkMode ? 'bg-gradient-to-br from-[#1a1a1c] to-[#202024] border border-gray-800' : 'bg-gradient-to-br from-white to-blue-50/30 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'}`}>
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <MenuOutlined className="text-[16px]" />
            </div>
            <div className={`text-[28px] font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{staffOnly.length}</div>
            <div className={`text-[12px] font-bold tracking-wide uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nhân viên</div>
          </div>
          <div className={`flex-1 rounded-[24px] p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(16,185,129,0.15)] ${isDarkMode ? 'bg-gradient-to-br from-[#1a1a1c] to-[#202024] border border-gray-800' : 'bg-gradient-to-br from-white to-green-50/30 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'}`}>
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
              <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
            </div>
            <div className={`text-[28px] font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeStaff}</div>
            <div className={`text-[12px] font-bold tracking-wide uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Đang hoạt động</div>
          </div>
        </div>

        {/* 4. Lists */}
        <div>
          <h3 className={`text-[15px] font-bold mb-3 ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Danh sách ({filteredUsers.length})</h3>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className={`text-center py-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Đang tải...</div>
            ) : users
                .filter((u: any) => {
                  const role = (u.roleName || (u.roles && u.roles[0]) || '').toUpperCase();
                  // Chỉ ẩn những ai là Admin, còn lại hiện hết cho chắc chắn
                  const isAdmin = role.includes('ADMIN');
                  const matchesSearch = 
                    (u.fullName || u.name || u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
                  return !isAdmin && matchesSearch;
                })
                .map((user: any, index: number) => {
                  const displayName = user.fullName || user.name || user.username || (user.email ? user.email.split('@')[0] : 'Thành viên');
                  const role = (user.roleName || (user.roles && user.roles[0]) || 'USER').toUpperCase();
                  const roleLabel = role.includes('ADMIN') ? 'QUẢN TRỊ' : 'NHÂN VIÊN';
                  
                  return (
                    <div
                      key={user.id || index}
                      onClick={() => {
                        setEditingUser(user);
                        setModalVisible(true);
                      }}
                      className={`group rounded-[24px] p-4 flex items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] active:scale-[0.98] ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800 hover:bg-[#202024]' : 'bg-white border border-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-[50px] h-[50px] rounded-[16px] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center shadow-sm overflow-hidden border border-gray-100/10">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={displayName} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-[20px]">
                                {displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          {/* Status Dot */}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] shadow-sm z-10 ${isDarkMode ? 'border-[#1a1a1c]' : 'border-white'} ${user.isActive ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className={`font-black m-0 text-[16px] tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900 group-hover:text-blue-600 transition-colors'}`}>
                            {displayName}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[12px] font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{user.phone || user.email || 'Chưa cập nhật liên hệ'}</span>
                            <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                              {roleLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110'}`}>
                        <RightOutlined className="text-[14px]" />
                      </div>
                    </div>
                  )
                })}
            {filteredUsers.length === 0 && !isLoading && (
              <div className={`text-center py-8 font-medium ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Không tìm thấy thành viên!</div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => {
          setEditingUser(null);
          setModalVisible(true);
        }}
        className="fixed right-5 bottom-[90px] w-[56px] h-[56px] rounded-full bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)] flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20 cursor-pointer"
      >
        <PlusOutlined className="text-[24px]" />
      </button>

      {modalVisible && (
        <UserModal
          visible={modalVisible}
          user={editingUser}
          onClose={() => setModalVisible(false)}
          onSuccess={() => setModalVisible(false)}
        />
      )}
    </Page>
  );
};

export default UsersPage;