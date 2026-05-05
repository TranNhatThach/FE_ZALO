import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { useCreateProjectMutation, useUpdateProjectMutation } from '../../hooks/useProjects';
import { useThemeStore } from '../../stores/theme.store';
import dayjs from 'dayjs';

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  project?: any; // If provided, it's edit mode
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ visible, project, onClose }) => {
  const [form] = Form.useForm();
  const { isDarkMode } = useThemeStore();
  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const isEdit = !!project;

  useEffect(() => {
    if (visible) {
      if (project) {
        form.setFieldsValue({
          ...project,
          dateRange: [dayjs(project.startDate), dayjs(project.endDate)]
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, project, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        description: values.description,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        status: values.status || 'ACTIVE'
      };

      if (isEdit) {
        updateMutation.mutate({ id: project.id, data: payload }, {
          onSuccess: () => {
            message.success('Cập nhật dự án thành công!');
            onClose();
          }
        });
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => {
            message.success('Tạo dự án thành công!');
            onClose();
          }
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={<span className="font-black uppercase text-[#1e3ba1]">{isEdit ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}</span>}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? 'LƯU THAY ĐỔI' : 'TẠO DỰ ÁN'}
      cancelText="HỦY"
      centered
      okButtonProps={{ loading: createMutation.isPending || updateMutation.isPending, className: 'bg-[#1e3ba1] font-bold rounded-xl h-10' }}
      cancelButtonProps={{ className: 'font-bold rounded-xl h-10' }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="name" label={<span className="text-[11px] font-bold uppercase text-gray-400">Tên dự án</span>} rules={[{ required: true }]}>
          <Input className="h-11 rounded-xl bg-gray-50 border-none font-bold" />
        </Form.Item>

        <Form.Item name="dateRange" label={<span className="text-[11px] font-bold uppercase text-gray-400">Thời gian thực hiện</span>} rules={[{ required: true }]}>
          <DatePicker.RangePicker className="w-full h-11 rounded-xl bg-gray-50 border-none" />
        </Form.Item>

        <Form.Item name="status" label={<span className="text-[11px] font-bold uppercase text-gray-400">Trạng thái</span>}>
          <Select className="h-11 rounded-xl" options={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'COMPLETED', label: 'COMPLETED' },
            { value: 'CANCELLED', label: 'CANCELLED' }
          ]} />
        </Form.Item>

        <Form.Item name="description" label={<span className="text-[11px] font-bold uppercase text-gray-400">Mô tả dự án</span>}>
          <Input.TextArea rows={4} className="rounded-xl bg-gray-50 border-none" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
