import React, { useEffect, useState } from 'react';
import { Typography, Button, Space, Tag, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined, EnvironmentOutlined } from '@ant-design/icons';
import BaseTable from '../../components/BaseTable';
import BranchModal from './components/BranchModal';
import { Branch } from '../../types/branch.types';
import { branchService } from '../../services/branch.service';

const { Title } = Typography;

const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const data = await branchService.getAll();
      setBranches(data);
    } catch (error) {
      console.error('Fetch branches error:', error);
      message.error('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this branch?',
      content: 'All data associated with this branch will be affected.',
      onOk: async () => {
        try {
          await branchService.delete(id);
          message.success('Deleted successfully');
          fetchBranches();
        } catch (error) {
          message.error('Delete failed');
        }
      },
    });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await branchService.toggleStatus(id);
      message.success('Status updated');
      fetchBranches();
    } catch (error) {
      message.error('Update status failed');
    }
  };

  const columns = [
    {
      header: 'Branch Name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <EnvironmentOutlined className="text-red-500" />
          <span className="font-medium">{name}</span>
        </Space>
      ),
    },
    {
      header: 'Address',
      key: 'address',
    },
    {
      header: 'Phone',
      key: 'phone',
      render: (phone: string) => phone || 'N/A',
    },
    {
      header: 'Status',
      key: 'status',
      render: (status: string, record: Branch) => (
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
      render: (_: any, record: Branch) => (
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
        <Title level={3} style={{ margin: 0 }}>Branch Management</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingBranch(null);
            setModalVisible(true);
          }}
        >
          Add Branch
        </Button>
      </div>

      <BaseTable 
        columns={columns} 
        data={branches} 
        loading={loading} 
        rowKey={(b) => b.id} 
      />

      <BranchModal 
        visible={modalVisible} 
        branch={editingBranch} 
        onClose={() => setModalVisible(false)} 
        onSuccess={fetchBranches} 
      />
    </div>
  );
};

export default BranchesPage;
