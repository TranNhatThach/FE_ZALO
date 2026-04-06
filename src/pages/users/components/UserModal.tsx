import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { User } from '../../../types/auth.types';
import { userService } from '../../../services/user.service';

interface UserModalProps {
  visible?: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ visible, user, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const isEdit = !!user;

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [visible, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit && user) {
        await userService.update(user.id, values);
        message.success('Updated user successfully');
      } else {
        await userService.create(values);
        message.success('Created user successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Employee' : 'Add Employee'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ status: 'ACTIVE', roles: ['STAFF'] }}>
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please input the phone number!' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item
          name="roles"
          label="Roles"
          rules={[{ required: true, message: 'Please select at least one role!' }]}
        >
          <Select mode="multiple" placeholder="Select roles">
            <Select.Option value="ADMIN">Admin</Select.Option>
            <Select.Option value="STAFF">Staff</Select.Option>
            <Select.Option value="MANAGER">Manager</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select>
            <Select.Option value="ACTIVE">Active</Select.Option>
            <Select.Option value="INACTIVE">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
