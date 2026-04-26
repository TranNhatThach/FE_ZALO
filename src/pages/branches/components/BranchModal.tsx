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
        message.success('Cập nhật chi nhánh thành công');
      } else {
        await branchService.create(values);
        message.success('Tạo chi nhánh thành công');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa Chi nhánh' : 'Thêm Chi Nhánh'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ status: 'ACTIVE' }}>
        <Form.Item
          name="name"
          label="Tên Chi Nhánh"
          rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh!' }]}
        >
          <Input placeholder="Nhập tên chi nhánh" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa Chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item name="phone" label="Số Điện Thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item name="status" label="Trạng Thái">
          <Select>
            <Select.Option value="ACTIVE">Hoạt động</Select.Option>
            <Select.Option value="INACTIVE">Ngừng hoạt động</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BranchModal;
