import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useThemeStore } from '@/stores/theme.store';
import {
  MenuOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  RightOutlined
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

  const activeUsers = users.filter((u: any) => u.status === 'ACTIVE').length;

  return (
    <div className={`flex flex-col w-full h-full relative pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f9]'}`}>

      {/* 1. Header Area */}
      <div className={`flex items-center justify-between px-4 pt-6 pb-2 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f9]'}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-sm border-none outline-none cursor-pointer transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800' : 'bg-white'}`}
          >
            <MenuOutlined className={`text-[18px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
          <div>
            <div className={`text-[11px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enterprise Hub</div>
            <div className={`text-[16px] font-bold leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quản lý Nhân sự</div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden shadow-sm">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Title */}
        <div className="mb-4">
          <h1 className={`text-[24px] font-extrabold m-0 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Thành viên</h1>
          <p className={`text-[13px] m-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quản lý và thiết lập quyền truy cập</p>
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
          <div className={`flex-1 rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50'}`}>
              <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></span>
            </div>
            <div className={`text-[24px] font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{users.length}</div>
            <div className={`text-[12px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tổng cộng</div>
          </div>
          <div className={`flex-1 rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isDarkMode ? 'bg-green-900/40' : 'bg-green-50'}`}>
              <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`}></span>
            </div>
            <div className={`text-[24px] font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeUsers}</div>
            <div className={`text-[12px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Đang làm</div>
          </div>
        </div>

        {/* 4. Lists */}
        <div>
          <h3 className={`text-[15px] font-bold mb-3 ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Danh sách ({filteredUsers.length})</h3>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className={`text-center py-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Đang tải...</div>
            ) : filteredUsers.map((user: any, index: number) => (
              <div
                key={user.id || index}
                onClick={() => {
                  setEditingUser(user);
                  setModalVisible(true);
                }}
                className={`rounded-[20px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between active:scale-[0.98] transition-transform ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800 active:bg-gray-800' : 'bg-white active:bg-gray-50 border border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-[18px]">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {/* Status Dot */}
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-[#1a1a1c]' : 'border-white'} ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                  <div>
                    <h4 className={`font-bold m-0 text-[15px] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[12px] font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{user.email || 'No email'}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        {user.roles?.[0] || 'USER'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                  <RightOutlined className="text-[12px]" />
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default UsersPage;