import React, { useState } from 'react';
import { Page } from 'zmp-ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useThemeStore } from '@/stores/theme.store';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  SyncOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { userService } from '@/services/user.service';
import UserModal from './components/UserModal';
import { User } from '@/types/auth.types';
import { message, Popconfirm } from 'antd';

const ROLE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  ADMIN:   { label: 'QUẢN TRỊ', color: '#1d4ed8', bg: '#eff6ff' },
  MANAGER: { label: 'QUẢN LÝ', color: '#059669', bg: '#ecfdf5' },
  STAFF:   { label: 'NHÂN VIÊN', color: '#475569', bg: '#f1f5f9' },
};

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'MANAGER' | 'STAFF'>('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  const getRoleKey = (u: any): string => {
    return ((u.roleName || (u.roles && u.roles[0]) || 'STAFF') as string).toUpperCase();
  };

  const filtered = (users as any[]).filter((u: any) => {
    const role = getRoleKey(u);
    const name = (u.fullName || u.name || u.username || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'ALL' || role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalStaff = (users as any[]).filter(u => !getRoleKey(u).includes('ADMIN')).length;
  const totalAdmin = (users as any[]).filter(u => getRoleKey(u).includes('ADMIN')).length;
  const activeCount = (users as any[]).filter((u: any) => u.isActive === true).length;

  const handleCreate = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      message.success('Đã xóa nhân viên!');
      refetch();
    } catch {
      message.error('Lỗi khi xóa!');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await userService.restore(id);
      message.success('Đã khôi phục nhân viên!');
      refetch();
    } catch {
      message.error('Lỗi khi khôi phục!');
    }
  };

  const handleSuccess = () => {
    setModalVisible(false);
    queryClient.invalidateQueries({ queryKey: ['users'] });
    refetch();
  };

  return (
    <Page
      className={`flex flex-col w-full h-full relative pb-24 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#eff6ff]'}`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className={`text-[22px] font-black tracking-tight m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quản lý Nhân sự
          </h1>
          <p className={`text-[12px] font-medium m-0 mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Tạo và quản lý thành viên trong tổ chức
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center border-none cursor-pointer transition-all active:scale-95 ${isDarkMode ? 'bg-[#1a1a1c] text-gray-400' : 'bg-white text-gray-500 shadow-sm'}`}
        >
          <SyncOutlined spin={isLoading} className="text-[18px]" />
        </button>
      </div>

      <div className="px-4 mt-2">
        {/* Stats Cards */}
        <div className="flex gap-3 mb-5">
          <div
            className={`flex-1 rounded-[24px] p-4 border transition-all duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800 shadow-xl' : 'bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
          >
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <TeamOutlined className={`text-[18px] ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className={`text-[28px] font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalStaff}
            </div>
            <div className={`text-[10px] font-black uppercase tracking-[0.1em] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Nhân sự
            </div>
          </div>

          <div
            className={`flex-1 rounded-[24px] p-4 border transition-all duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800 shadow-xl' : 'bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
          >
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <CrownOutlined className={`text-[18px] ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div className={`text-[28px] font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalAdmin}
            </div>
            <div className={`text-[10px] font-black uppercase tracking-[0.1em] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Quản trị
            </div>
          </div>

          <div
            className={`flex-1 rounded-[24px] p-4 border transition-all duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800 shadow-xl' : 'bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
          >
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <CheckCircleOutlined className={`text-[18px] ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div className={`text-[28px] font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {activeCount}
            </div>
            <div className={`text-[10px] font-black uppercase tracking-[0.1em] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Hoạt động
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-4 flex gap-2">
          <div
            className={`flex-1 flex items-center h-[46px] rounded-[14px] px-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800' : 'bg-white shadow-sm'}`}
          >
            <SearchOutlined className={`text-[18px] mr-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-[14px] font-medium ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'}`}
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center border-none cursor-pointer transition-all active:scale-95 ${filterOpen ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') : (isDarkMode ? 'bg-[#1a1a1c] border border-gray-800 text-gray-400' : 'bg-white text-gray-600 shadow-sm')}`}
          >
            <FilterOutlined className="text-[18px]" />
          </button>
        </div>

        {/* Role Filter Pills */}
        {filterOpen && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['ALL', 'ADMIN', 'MANAGER', 'STAFF'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-black border transition-all active:scale-95 cursor-pointer ${roleFilter === r
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                  : (isDarkMode ? 'bg-[#1a1a1c] border-gray-800 text-gray-500 hover:text-gray-300' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50')
                }`}
              >
                {r === 'ALL' && <TeamOutlined />}
                {r === 'ADMIN' && <SafetyCertificateOutlined />}
                {r === 'MANAGER' && <SolutionOutlined />}
                {r === 'STAFF' && <UserOutlined />}
                {r === 'ALL' ? 'Tất cả' : r === 'ADMIN' ? 'Quản trị' : r === 'MANAGER' ? 'Quản lý' : 'Nhân viên'}
              </button>
            ))}
          </div>
        )}

        {/* List */}
        <div>
          <h3 className={`text-[14px] font-bold mb-3 ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Danh sách ({filtered.length})
          </h3>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <SyncOutlined spin className="text-[24px] text-blue-500 mb-2" />
                <p className="text-[13px] font-medium">Đang tải dữ liệu...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={`text-center py-10 font-medium ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Không tìm thấy nhân viên nào.
              </div>
            ) : (
              filtered.map((user: any, index: number) => {
                const displayName = user.fullName || user.name || user.username || (user.email?.split('@')[0] ?? 'Thành viên');
                const roleKey = getRoleKey(user);
                const badge = ROLE_BADGE[roleKey] || ROLE_BADGE.STAFF;
                const initials = displayName.charAt(0).toUpperCase();

                return (
                  <div
                    key={user.id || index}
                    className={`group rounded-[20px] p-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800' : 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]'}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className="w-[52px] h-[52px] rounded-[18px] flex items-center justify-center overflow-hidden shadow-sm"
                          style={{ background: roleKey === 'ADMIN' ? 'linear-gradient(135deg,#1d4ed8,#7c3aed)' : 'linear-gradient(135deg,#3b82f6,#60a5fa)' }}
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={displayName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '';
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-white font-black text-[20px]">{initials}</span>
                          )}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-[16px] h-[16px] rounded-full border-[3px] ${isDarkMode ? 'border-[#1a1a1c]' : 'border-white'} ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-black text-[15px] truncate tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {displayName}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-[6px] text-[9px] font-black uppercase tracking-widest shrink-0"
                            style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.color}20` }}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <span className={`text-[11px] truncate mt-0.5 font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                           {user.phone ? <><IdcardOutlined className="mr-1" /> {user.phone}</> : user.email || 'Chưa cập nhật liên hệ'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className={`w-[36px] h-[36px] rounded-[12px] flex items-center justify-center border-none cursor-pointer text-[15px] transition-all active:scale-90 ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white' : 'bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white shadow-sm'}`}
                        title="Chỉnh sửa"
                      >
                        <EditOutlined />
                      </button>
                      {(user as any).isDeleted ? (
                        <button
                          onClick={() => handleRestore(user.id)}
                          className={`w-[36px] h-[36px] rounded-[12px] flex items-center justify-center border-none cursor-pointer text-[15px] transition-all active:scale-90 ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-green-600 hover:text-white' : 'bg-gray-50 text-gray-500 hover:bg-green-600 hover:text-white shadow-sm'}`}
                          title="Khôi phục"
                        >
                          <UndoOutlined />
                        </button>
                      ) : (
                        <Popconfirm
                          title="Xóa nhân viên này?"
                          onConfirm={() => handleDelete(user.id)}
                          okText="Xóa"
                          cancelText="Huỷ"
                          okButtonProps={{ danger: true }}
                        >
                          <button
                            className={`w-[36px] h-[36px] rounded-[12px] flex items-center justify-center border-none cursor-pointer text-[15px] transition-all active:scale-90 ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white' : 'bg-gray-50 text-gray-500 hover:bg-red-600 hover:text-white shadow-sm'}`}
                            title="Xóa"
                          >
                            <DeleteOutlined />
                          </button>
                        </Popconfirm>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* FAB - Thêm nhân viên mới */}
      <button
        onClick={handleCreate}
        className="fixed right-5 bottom-[90px] w-[56px] h-[56px] rounded-full bg-blue-600 text-white shadow-[0_8px_24px_rgba(37,99,235,0.45)] flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20 cursor-pointer"
      >
        <PlusOutlined className="text-[22px]" />
      </button>

      {/* Modal */}
      {modalVisible && (
        <UserModal
          visible={modalVisible}
          user={editingUser}
          onClose={() => setModalVisible(false)}
          onSuccess={handleSuccess}
        />
      )}
    </Page>
  );
};

export default UsersPage;