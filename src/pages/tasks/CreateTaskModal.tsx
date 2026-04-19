import React from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useCreateTaskMutation } from '@/hooks/useTasks';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { userService } from '@/services/user.service';
import dayjs from 'dayjs';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const { mutate: createTask, isPending } = useCreateTaskMutation();
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        tenantId: user?.tenantId,
        dueDate: values.dueDate ? dayjs(values.dueDate).startOf('day').toISOString() : undefined,
        status: 'TO_DO',
      };

      createTask(payload, {
        onSuccess: () => {
          message.success('Tạo công việc thành công!');
          form.resetFields();
          onSuccess();
          onClose();
        },
        onError: (error: any) => {
          message.error(error.message || 'Lỗi khi tạo công việc.');
        }
      });
    } catch (err) {
      // Form validation error
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-[#1e3ba1] font-black text-[18px] tracking-tight py-2">
          <PlusCircleOutlined /> Thêm Công việc mới
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-[18px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 border-none transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="flex-1 py-3.5 rounded-[18px] font-black text-white bg-gradient-to-r from-[#1e3ba1] to-[#2563eb] border-none shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? <LoadingOutlined /> : null} Tạo công việc
          </button>
        </div>
      }
      centered
      width={400}
      styles={{
        mask: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.45)' },
        body: { padding: '12px 24px 24px 24px' }
      }}
      className="premium-modal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ priority: 'MEDIUM', category: 'TECHNICAL' }}
        requiredMark={false}
      >
        <Form.Item
          label={<span className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Tiêu đề công việc</span>}
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input
            placeholder="Nhập tên công việc..."
            className="rounded-xl border-gray-200 h-11 focus:border-[#1e3ba1] focus:ring-1 focus:ring-blue-100 font-medium"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Người thực hiện</span>}
          name="assigneeId"
          rules={[{ required: true, message: 'Vui lòng chọn người thực hiện' }]}
        >
          <Select
            placeholder="Chọn nhân viên..."
            className="h-11 rounded-xl overflow-hidden"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={users.map((user: any) => ({
              value: user.id,
              label: user.fullName || user.name || user.username || `Nhân viên ${user.id}`,
            }))}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={<span className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Danh mục</span>}
            name="category"
            rules={[{ required: true }]}
          >
            <Select className="h-11 rounded-xl overflow-hidden">
              <Select.Option value="MARKETING">Marketing</Select.Option>
              <Select.Option value="TECHNICAL">Technical</Select.Option>
              <Select.Option value="DESIGN">Design</Select.Option>
              <Select.Option value="SALES">Sales</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Độ ưu tiên</span>}
            name="priority"
            rules={[{ required: true }]}
          >
            <Select className="h-11 rounded-xl">
              <Select.Option value="HIGH"><span className="text-red-500 font-bold">Cao</span></Select.Option>
              <Select.Option value="MEDIUM"><span className="text-orange-500 font-bold">Trung bình</span></Select.Option>
              <Select.Option value="LOW"><span className="text-gray-400 font-bold">Thấp</span></Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Hạn chót</span>}
          name="dueDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
        >
          <DatePicker
            className="w-full h-11 rounded-xl border-gray-200"
            placeholder="Chọn ngày kết thúc"
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Mô tả chi tiết (Tùy chọn)</span>}
          name="description"
        >
          <Input.TextArea
            placeholder="Nhập nội dung công việc chi tiết..."
            rows={3}
            className="rounded-xl border-gray-200 focus:border-[#1e3ba1] font-medium"
          />
        </Form.Item>
      </Form>

      <style>{`
        .premium-modal .ant-modal-content {
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .premium-modal .ant-modal-header {
          border-bottom: none;
          margin-bottom: 0px;
        }
        .ant-select-selector {
          border-radius: 12px !important;
          border-color: #e5e7eb !important;
        }
      `}</style>
    </Modal>
  );
};

export default CreateTaskModal;
