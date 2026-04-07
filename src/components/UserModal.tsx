import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Tag, Button, Typography, Space, Divider, message } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  SafetyCertificateOutlined, 
  IdcardOutlined,
  SaveOutlined,
  CloseOutlined,
  LockOutlined
} from '@ant-design/icons';
import { User } from '@/types/auth.types';
import { userService } from '@/services/user.service';

const { Text, Title } = Typography;
const { Option } = Select;

interface UserModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ visible, user, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!user;

  useEffect(() => {
    if (visible) {
      if (user) {
        form.setFieldsValue({
          ...user,
          roles: user.roles || ['STAFF'],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: 'ACTIVE',
          roles: ['STAFF'],
        });
      }
    }
  }, [visible, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEdit && user) {
        await userService.update(user.id, values);
        message.success({
          content: 'Updated user information successfully',
          style: { marginTop: '10vh' },
        });
      } else {
        await userService.create(values);
        message.success({
          content: 'New user created successfully',
          style: { marginTop: '10vh' },
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Submit error:', error);
      message.error(error?.message || 'Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={480}
      className="premium-modal"
      title={
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg ${isEdit ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
            {isEdit ? <IdcardOutlined className="text-xl" /> : <UserOutlined className="text-xl" />}
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>{isEdit ? 'Edit User' : 'Create New User'}</Title>
            <Text type="secondary" className="text-xs">
              {isEdit ? 'Update details for ' + user.name : 'Enter details for the new staff member'}
            </Text>
          </div>
        </div>
      }
    >
      <Divider className="my-4" />
      
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className="user-form"
      >
        <div className="grid grid-cols-1 gap-x-4">
          <Form.Item
            name="name"
            label={<Text strong className="text-gray-600">Full Name</Text>}
            rules={[{ required: true, message: 'Full name is required' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="e.g. John Doe"
              className="rounded-lg h-10 border-gray-200"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Text strong className="text-gray-600">Email Address</Text>}
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />} 
              placeholder="john@example.com"
              className="rounded-lg h-10 border-gray-200"
              disabled={isEdit}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<Text strong className="text-gray-600">Phone Number</Text>}
            rules={[{ required: true, message: 'Phone number is required' }]}
          >
            <Input 
              prefix={<PhoneOutlined className="text-gray-400" />} 
              placeholder="0987 654 321"
              className="rounded-lg h-10 border-gray-200"
            />
          </Form.Item>

          {!isEdit && (
            <Form.Item
              name="password"
              label={<Text strong className="text-gray-600">Initial Password</Text>}
              rules={[{ required: true, message: 'Initial password is required' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="********"
                className="rounded-lg h-10 border-gray-200"
              />
            </Form.Item>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="roles"
              label={<Text strong className="text-gray-600">Roles</Text>}
              rules={[{ required: true, message: 'Select at least one role' }]}
            >
              <Select 
                mode="multiple" 
                placeholder="Assign roles"
                className="w-full"
                maxTagCount="responsive"
                suffixIcon={<SafetyCertificateOutlined />}
              >
                <Option value="ADMIN">Admin</Option>
                <Option value="MANAGER">Manager</Option>
                <Option value="STAFF">Staff</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label={<Text strong className="text-gray-600">Account Status</Text>}
            >
              <Select className="w-full">
                <Option value="ACTIVE">
                  <Tag color="success" className="m-0 border-none">Active</Tag>
                </Option>
                <Option value="INACTIVE">
                  <Tag color="error" className="m-0 border-none">Inactive</Tag>
                </Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <Divider className="my-6" />

        <div className="flex justify-end items-center space-x-3">
          <Button 
            onClick={onClose} 
            icon={<CloseOutlined />}
            className="rounded-lg h-10 px-6 border-gray-200 hover:border-gray-400 hover:text-gray-600"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            loading={loading}
            icon={<SaveOutlined />}
            className="rounded-lg h-10 px-8 bg-gradient-to-r from-blue-600 to-indigo-500 border-none shadow-md hover:shadow-lg transition-all"
          >
            {isEdit ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserModal;
