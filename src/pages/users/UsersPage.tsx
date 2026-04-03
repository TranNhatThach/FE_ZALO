import React, { useEffect, useState } from 'react';
import { Typography, Button, Space, Tag, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import BaseTable from '@/components/BaseTable';
import UserModal from './components/UserModal';
import { User } from '@/types/auth.types';
import { userService } from '@/services/user.service';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Fetch users error:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const columns = [
    {
      header: 'Name',
      key: 'name',
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
      header: 'Email',
      key: 'email',
    },
    {
      header: 'Roles',
      key: 'roles',
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
      header: 'Status',
      key: 'status',
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
      header: 'Actions',
      key: 'actions',
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
      <div className="flex justify-between items-center">
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

      <BaseTable 
        columns={columns} 
        data={users} 
        loading={loading} 
        rowKey={(u) => u.id} 
      />

      <UserModal 
        visible={modalVisible} 
        user={editingUser} 
        onClose={() => setModalVisible(false)} 
        onSuccess={fetchUsers} 
      />
    </div>
  );
};

export default UsersPage;
