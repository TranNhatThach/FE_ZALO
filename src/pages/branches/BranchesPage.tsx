import React, { useEffect, useState } from 'react';
import { Page } from 'zmp-ui';
import { Typography, Button, Space, Tag, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { BaseTable } from '@/components/Table/BaseTable';
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
      message.error('Lỗi khi tải danh sách chi nhánh');
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
      title: 'Bạn có chắc chắn muốn xóa chi nhánh này?',
      content: 'Tất cả dữ liệu liên quan sẽ bị ảnh hưởng.',
      onOk: async () => {
        try {
          await branchService.delete(id);
          message.success('Đã xóa thành công');
          fetchBranches();
        } catch (error) {
          message.error('Xóa thất bại');
        }
      },
    });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await branchService.toggleStatus(id);
      message.success('Đã cập nhật trạng thái');
      fetchBranches();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên Chi Nhánh',
      dataIndex: 'name',
      render: (name: string) => (
        <Space>
          <EnvironmentOutlined className="text-red-500" />
          <span className="font-medium">{name}</span>
        </Space>
      ),
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      render: (phone: string) => phone || 'N/A',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
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
      title: 'Thao Tác',
      dataIndex: 'actions',
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
    <Page className="space-y-4">
      <div className="flex justify-between items-center">
        <Title level={3} style={{ margin: 0 }}>Quản lý Chi nhánh</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingBranch(null);
            setModalVisible(true);
          }}
        >
          Thêm Chi Nhánh
        </Button>
      </div>

      <BaseTable 
        columns={columns} 
        data={branches} 
        isLoading={loading} 
        rowKey="id" 
      />

      <BranchModal 
        visible={modalVisible} 
        branch={editingBranch} 
        onClose={() => setModalVisible(false)} 
        onSuccess={fetchBranches} 
      />
    </Page>
  );
};

export default BranchesPage;
