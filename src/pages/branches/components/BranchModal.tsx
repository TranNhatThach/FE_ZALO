import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { Branch } from '../../../types/branch.types';
import { branchService } from '../../../services/branch.service';

interface BranchModalProps {
  visible: boolean;
  branch: Branch | null;
  onClose: () => void;
  onSuccess: () => void;
}

const BranchModal: React.FC<BranchModalProps> = ({ visible, branch, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const isEdit = !!branch;

  useEffect(() => {
    if (visible && branch) {
      form.setFieldsValue(branch);
    } else {
      form.resetFields();
    }
  }, [visible, branch, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit && branch) {
        await branchService.update(branch.id, values);
        message.success('Updated branch successfully');
      } else {
        await branchService.create(values);
        message.success('Created branch successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Branch' : 'Add Branch'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ status: 'ACTIVE' }}>
        <Form.Item
          name="name"
          label="Branch Name"
          rules={[{ required: true, message: 'Please input the branch name!' }]}
        >
          <Input placeholder="Enter branch name" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please input the address!' }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>
        <Form.Item name="phone" label="Phone Number">
          <Input placeholder="Enter phone number" />
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

export default BranchModal;
