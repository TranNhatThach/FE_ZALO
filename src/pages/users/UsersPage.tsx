import React, { useState } from 'react';
import { Typography, Button, Space, Tag, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseTable } from '@/components/Table/BaseTable';
import UserModal from '@/components/UserModal';
import UserFilter, { FilterParams } from '@/components/Filter/UserFilter';
import { User } from '@/types/auth.types';
import { userService } from '@/services/user.service';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 1. Quản lý filters
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    role: '',
    status: '',
  });

  // 2. Sử dụng useQuery để fetch dữ liệu
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
    // Client-side filtering logic
    select: (data) => {
      let filtered = [...data];
      if (filters.search) {
        const keyword = filters.search.toLowerCase();
        filtered = filtered.filter(u => 
          u.name?.toLowerCase().includes(keyword) || u.email?.toLowerCase().includes(keyword)
        );
      }
      if (filters.status) {
        filtered = filtered.filter(u => u.status?.toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.role) {
        filtered = filtered.filter(u => u.roles.some(r => r.toLowerCase() === filters.role.toLowerCase()));
      }
      return filtered;
    }
  });

  // 3. Sử dụng useMutation cho các hành động thay đổi dữ liệu
  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      message.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => message.error('Delete failed'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => userService.toggleStatus(id),
    onSuccess: () => {
      message.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => message.error('Update status failed'),
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      content: 'This action cannot be undone.',
      onOk: () => deleteMutation.mutateAsync(id),
    });
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
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
        isLoading={isLoading} 
        rowKey="id" 
      />

      <UserModal 
        visible={modalVisible} 
        user={editingUser} 
        onClose={() => setModalVisible(false)} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['users'] })} 
      />
    </div>
  );
};

export default UsersPage;