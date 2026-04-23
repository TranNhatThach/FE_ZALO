import React from 'react';
import { Modal, Form, Input, Select, DatePicker, message, Divider, Typography } from 'antd';
import {
  PlusCircleOutlined,
  LoadingOutlined,
  UserOutlined,
  TagOutlined,
  FlagOutlined,
  CalendarOutlined,
  SolutionOutlined,
  PhoneOutlined,
  HomeOutlined,
  BankOutlined,
  DollarCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useCreateTaskMutation } from '@/hooks/useTasks';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { userService } from '@/services/user.service';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

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
        status: 'TO DO',
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
    } catch (err) { }
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={380}
      styles={{
        mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.4)' },
        body: { padding: 0 },
        header: { display: 'none' }
      }}
      closable={false}
      className="premium-create-task-modal"
    >
      {/* Header Bar with Gradient */}
      <div className="bg-gradient-to-r from-[#1e3ba1] to-[#2563eb] p-5 relative overflow-hidden w-full m-0">
        <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <Title level={5} style={{ margin: 0, color: 'white', fontWeight: 900, letterSpacing: '-0.3px' }}>
              Tạo Công Việc Mới
            </Title>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 border-none flex items-center justify-center text-white font-bold active:scale-95 transition-transform"
            >✕</button>
          </div>
          <Text className="text-blue-100 text-[11px] font-medium opacity-80">Thiết lập nhiệm vụ & khách hàng</Text>
        </div>
      </div>

      <div className="p-5">
        <Form
          form={form}
          layout="vertical"
          initialValues={{ priority: 'MEDIUM', category: 'TECHNICAL' }}
          requiredMark={false}
        >
          {/* Section 1: General Info */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <PlusCircleOutlined className="text-blue-600" />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Thông tin cơ bản</span>
            </div>

            <Form.Item
              name="title"
              rules={[{ required: true, message: 'Nhập tiêu đề công việc' }]}
            >
              <Input
                prefix={<SolutionOutlined className="text-gray-400 mr-2" />}
                placeholder="Tiêu đề công việc (ví dụ: Bảo trì hệ thống...)"
                className="modern-input h-14"
              />
            </Form.Item>

            <Form.Item name="assigneeId">
              <Select
                placeholder="Giao việc cho nhân viên..."
                className="modern-select h-14"
                allowClear
                showSearch
                suffixIcon={<UserOutlined className="text-gray-400" />}
                options={users.map((u: any) => ({
                  value: u.id,
                  label: u.fullName || u.name || u.username,
                }))}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="category" rules={[{ required: true }]}>
                <Select
                  placeholder="Danh mục"
                  className="modern-select h-12"
                  suffixIcon={<TagOutlined className="text-gray-400" />}
                >
                  <Select.Option value="MARKETING">Marketing</Select.Option>
                  <Select.Option value="TECHNICAL">Technical</Select.Option>
                  <Select.Option value="DESIGN">Design</Select.Option>
                  <Select.Option value="SALES">Sales</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="priority" rules={[{ required: true }]}>
                <Select
                  placeholder="Độ ưu tiên"
                  className="modern-select h-12"
                  suffixIcon={<FlagOutlined className="text-gray-400" />}
                >
                  <Select.Option value="HIGH"><span className="text-red-500 font-black">HIGH</span></Select.Option>
                  <Select.Option value="MEDIUM"><span className="text-orange-500 font-black">MEDIUM</span></Select.Option>
                  <Select.Option value="LOW"><span className="text-gray-400 font-black">LOW</span></Select.Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item name="dueDate" rules={[{ required: true, message: 'Chọn hạn chót' }]}>
              <DatePicker
                className="w-full h-12 modern-input"
                placeholder="Hạn chót hoàn thành"
                format="DD/MM/YYYY"
                suffixIcon={<CalendarOutlined className="text-blue-600" />}
              />
            </Form.Item>
          </div>

          {/* Section 2: Customer Details */}
          <div className="p-5 rounded-[28px] bg-blue-50/50 border border-blue-100/50 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <UserOutlined className="text-[#1e3ba1]" />
              <span className="text-[11px] font-black text-[#1e3ba1] uppercase tracking-[0.2em]">Đối tác & Tài chính</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Form.Item name="customerName" style={{ marginBottom: 0 }}>
                <Input placeholder="Tên khách" prefix={<UserOutlined className="text-gray-300" />} className="h-12 rounded-2xl" />
              </Form.Item>
              <Form.Item name="phoneNumber" style={{ marginBottom: 0 }}>
                <Input placeholder="SĐT liên hệ" prefix={<PhoneOutlined className="text-gray-300" />} className="h-12 rounded-2xl" />
              </Form.Item>
            </div>

            <Form.Item name="companyName" className="mt-4">
              <Input placeholder="Tên công ty / Tổ chức" prefix={<BankOutlined className="text-gray-300" />} className="h-12 rounded-2xl" />
            </Form.Item>

            <Form.Item name="address">
              <Input placeholder="Địa điểm thực hiện" prefix={<HomeOutlined className="text-gray-300" />} className="h-12 rounded-2xl" />
            </Form.Item>

            <Form.Item name="estimatedPrice" style={{ marginBottom: 0 }}>
              <Input
                type="number"
                placeholder="Doanh thu dự kiến (VNĐ)"
                prefix={<DollarCircleOutlined className="text-emerald-500" />}
                suffix={<span className="text-emerald-600 font-bold">VNĐ</span>}
                className="h-12 rounded-2xl border-emerald-100 bg-emerald-50/20"
              />
            </Form.Item>
          </div>

          {/* Section 3: Note */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FileTextOutlined className="text-gray-400" />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Ghi chú yêu cầu</span>
            </div>
            <Form.Item name="description">
              <Input.TextArea
                placeholder="Nhập chi tiết kỹ thuật hoặc lưu ý cho nhân viên..."
                rows={3}
                className="rounded-[20px] p-4 border-gray-200 focus:border-blue-600 transition-all font-medium"
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black text-gray-400 bg-gray-100 border-none active:scale-95 transition-all"
            >HỦY BỎ</button>
            <button
              onClick={handleCreate}
              disabled={isPending}
              className="flex-[2] py-4 rounded-2xl font-black text-white bg-gradient-to-r from-[#1e3ba1] to-[#2563eb] border-none shadow-lg shadow-blue-700/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? <LoadingOutlined /> : <PlusCircleOutlined />} TẠO CÔNG VIỆC
            </button>
          </div>
        </Form>
      </div>

      <style>{`
        .premium-create-task-modal .ant-modal-content {
          border-radius: 32px !important;
          overflow: hidden !important;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.25) !important;
          padding: 0 !important;
        }
        .premium-create-task-modal .ant-modal-body {
          padding: 0 !important;
        }
        .modern-input {
          border-radius: 16px !important;
          background: #f8fafc !important;
          border: 1.5px solid #f1f5f9 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-weight: 500 !important;
        }
        .modern-input:focus, .modern-input:hover {
          border-color: #1e3ba1 !important;
          background: white !important;
          box-shadow: 0 4px 12px rgba(30, 59, 161, 0.08) !important;
        }
        .modern-select .ant-select-selector {
          border-radius: 16px !important;
          background: #f8fafc !important;
          border: 1.5px solid #f1f5f9 !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
        }
        .modern-select .ant-select-selection-item {
          font-weight: 600 !important;
          color: #1e293b !important;
        }
      `}</style>
    </Modal>
  );
};

export default CreateTaskModal;
