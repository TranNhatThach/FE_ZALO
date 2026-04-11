import React, { useEffect, useState } from 'react';
import { Typography, Button, Space, Tag, Modal, message } from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined,
  MenuOutlined, SearchOutlined, FilterOutlined, TeamOutlined, RightOutlined
} from '@ant-design/icons';
import { BaseTable } from '@/components/Table/BaseTable';
import UserModal from './components/UserModal';
import UserFilter, { FilterParams } from '@/components/Filter/UserFilter'; 
import { User } from '@/types/auth.types';
import { userService } from '@/services/user.service';
import { useThemeStore } from '@/stores/theme.store';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 2. Thêm state quản lý giá trị của bộ lọc
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    role: '',
    status: '',
  });

  // 3. Sửa hàm fetchUsers để nhận filter params
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      // 1. Chỉ gọi hàm getAll() không có tham số
      const data = await userService.getAll(); 
      
      // 2. Tự lọc dữ liệu ở Client dựa trên state `filters` hiện tại
      let filteredData = data;

       if (filters.search) {
         const keyword = filters.search.toLowerCase();
         filteredData = filteredData.filter(user => 
           (user.name?.toLowerCase().includes(keyword)) || 
           (user.email?.toLowerCase().includes(keyword))
         );
       }

       if (filters.status) {
         filteredData = filteredData.filter(user => 
           user.status?.toLowerCase() === filters.status.toLowerCase()
         );
       }

       if (filters.role) {
         filteredData = filteredData.filter(user => 
           user.roles.some(r => r.toLowerCase() === filters.role.toLowerCase())
         );
       }

       // 3. Cập nhật state bằng danh sách đã lọc
       setUsers(filteredData);
      
    } catch (error) {
      console.error('Fetch users error:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters]);


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await userService.delete(id);
          message.success('Deleted successfully');
          fetchUsers();
        } catch (error) {
          message.error('Delete failed');
        }
      },
    });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await userService.toggleStatus(id);
      message.success('Status updated');
      fetchUsers();
    } catch (error) {
      message.error('Update status failed');
    }
  };

  // Các hàm xử lý từ UserFilter truyền lên
  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleResetFilter = () => {
    setFilters({ search: '', role: '', status: '' });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name: string, record: User) => (
        <Space>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="font-medium">{name || 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      render: (roles: string[]) => (
        <Space size={[0, 4]} wrap>
          {roles.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string, record: User) => (
        <Space>
          <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
          <Button 
            type="text" 
            size="small" 
            icon={<SyncOutlined />} 
            onClick={() => handleToggleStatus(record.id)}
          />
        </Space>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      className: 'text-right',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            type="text" 
            onClick={() => handleEdit(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            type="text" 
            danger 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const { setSidebarCollapsed, isSidebarCollapsed } = useThemeStore();
  
  // Thống kê đơn giản
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const inactiveUsers = users.filter(u => u.status !== 'ACTIVE').length;

  return (
    <div className="flex flex-col w-full h-full bg-[#f4f5f9] relative pb-20">
      
      {/* 1. Header Area */}
      <div className="bg-[#f4f5f9] flex items-center justify-between px-4 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-10 h-10 flex items-center justify-start border-none bg-transparent outline-none p-0 cursor-pointer active:opacity-70"
          >
            <MenuOutlined className="text-xl text-[#006af5]" />
          </button>
          <span className="text-[18px] font-bold text-[#006af5]">Enterprise Hub</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#f4b6a8] flex flex-col items-center justify-end overflow-hidden">
           {/* Fake user avatar illustration matching design */}
           <div className="w-[18px] h-[18px] rounded-full bg-[#333] mb-0.5"></div>
           <div className="w-[30px] h-[12px] bg-[#333] rounded-t-full"></div>
        </div>
      </div>

      <div className="px-4">
        {/* 2. Title Section */}
        <div className="mb-4 mt-2">
          <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight m-0 mb-1 tracking-tight">Thành viên</h1>
          <p className="text-gray-500 text-[13px] m-0">Quản lý đội ngũ nhân sự và phân quyền</p>
        </div>

        {/* 3. Search & Filter Bar */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 flex items-center bg-white h-[48px] rounded-[16px] px-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <SearchOutlined className="text-gray-400 text-[18px] mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên, bộ phận..." 
              value={filters.search}
              onChange={(e) => handleFilterChange({...filters, search: e.target.value})}
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-800 placeholder-gray-400"
            />
          </div>
          <button className="w-[48px] h-[48px] rounded-[16px] bg-[#f8f9fc] border-none shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-center outline-none active:bg-gray-100 cursor-pointer">
            <FilterOutlined className="text-[#006af5] text-[18px]" />
          </button>
        </div>

        {/* 4. Statistics Dashboard */}
        <div className="mb-8">
          {/* Main Card (White with blue accent) */}
          <div className="bg-white rounded-[20px] p-5 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.04)] mb-3">
            <div className="relative z-10">
              <span className="text-[#374151] text-[12px] font-bold tracking-wider uppercase block mb-1">
                TỔNG NHÂN SỰ
              </span>
              <div className="text-[#002f87] text-[36px] font-extrabold leading-tight mb-2">
                {totalUsers}
              </div>
              <div className="flex items-center text-gray-500 text-[11px] font-medium">
                <span className="text-gray-400 mr-1">📈</span> ~ +12% tháng này
              </div>
            </div>
            {/* Team Icon Decoration */}
            <div className="absolute right-5 top-5">
              <TeamOutlined className="text-[#006af5] text-2xl" />
            </div>
          </div>

          {/* Sub Cards Row */}
          <div className="flex gap-3">
            {/* Active Card */}
            <div className="flex-1 bg-white rounded-[20px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-[#4b5563] text-[12px] font-bold tracking-wider uppercase">ĐANG LÀM</span>
                 <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
               </div>
               <div className="text-[28px] font-extrabold text-[#111827] mb-1 leading-none">{activeUsers}</div>
               <span className="text-gray-400 text-[11px]">Active now</span>
            </div>

            {/* On Leave Card */}
            <div className="flex-1 bg-white rounded-[20px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-[#4b5563] text-[12px] font-bold tracking-wider uppercase">ĐANG NGHỈ</span>
                 <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
               </div>
               <div className="text-[28px] font-extrabold text-[#111827] mb-1 leading-none">{inactiveUsers}</div>
               <span className="text-gray-400 text-[11px]">On leave</span>
            </div>
          </div>
        </div>

        {/* 5. Members List */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[#4b5563] text-[12px] font-bold tracking-wider uppercase m-0">Danh sách nhân viên</h3>
            <button className="text-[#006af5] text-[12px] font-bold border-none bg-transparent outline-none m-0 p-0 active:opacity-70">
              Xem tất cả
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {users.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleEdit(item)}
                className="bg-white rounded-[20px] p-4 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative active:bg-gray-50 transition-colors cursor-pointer"
              >
                
                {/* Avatar */}
                <div className="relative">
                  <div className="w-[46px] h-[46px] rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-[18px] overflow-hidden">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.name?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  {/* Status dot */}
                  <div className={`absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full border-2 border-white ${item.status === 'ACTIVE' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}`}></div>
                </div>

                {/* Info */}
                <div className="ml-3 flex-1 min-w-0 pr-2">
                  <h4 className="text-[15px] font-bold text-gray-900 m-0 truncate leading-tight mb-1">
                    {item.name}
                  </h4>
                  <div className="text-gray-500 text-[12px] truncate">
                    {item.email}
                  </div>
                </div>

                {/* Role Badge */}
                <div className="mr-8">
                  {item.roles?.map(role => (
                    <span 
                      key={role} 
                      className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase mr-1
                        ${role.includes('ADMIN') ? 'bg-[#dbeafe] text-[#1e40af]' : 
                          role.includes('MANAGER') ? 'bg-[#ede9fe] text-[#5b21b6]' : 
                          'bg-[#f3f4f6] text-[#4b5563]'}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <RightOutlined className="text-gray-400 text-[12px] absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Floating Action Button (+) */}
      <button 
        onClick={() => {
          setEditingUser(null);
          setModalVisible(true);
        }}
        className="fixed right-5 bottom-[80px] w-[56px] h-[56px] rounded-full bg-[#1e3ba1] text-white shadow-[0_4px_14px_rgba(30,59,161,0.4)] flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20 cursor-pointer"
      >
        <PlusOutlined className="text-2xl" />
      </button>

      {/* Modals from old UsersPage */}
      <UserModal 
        visible={modalVisible} 
        user={editingUser} 
        onClose={() => setModalVisible(false)} 
        onSuccess={() => fetchUsers()} 
      />
    </div>
  );
};

export default UsersPage;