import React, { useEffect, useState } from 'react';
import { Typography, Button, Space, Tag, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { BaseTable } from '@/components/Table/BaseTable';
import UserModal from './components/UserModal';
import UserFilter, { FilterParams } from '@/components/Filter/UserFilter'; 
import { User } from '@/types/auth.types';
import { userService } from '@/services/user.service';

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <Title level={3} style={{ margin: 0 }}>Employee Management</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingUser(null);
            setModalVisible(true);
          }}
        >
          Add Employee
        </Button>
      </div>

      {/* 4. CHÈN COMPONENT FILTER VÀO ĐÂY */}
      <UserFilter 
        onFilterChange={handleFilterChange} 
        onReset={handleResetFilter} 
      />

      <BaseTable 
        columns={columns} 
        data={users} 
        isLoading={loading} 
        rowKey="id" 
      />

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