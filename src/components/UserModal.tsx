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
          content: 'Cập nhật thông tin thành công',
          style: { marginTop: '10vh' },
        });
      } else {
        await userService.create(values);
        message.success({
          content: 'Tạo tài khoản mới thành công',
          style: { marginTop: '10vh' },
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Submit error:', error);
      message.error(error?.message || 'Thao tác thất bại. Vui lòng thử lại.');
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
            <Title level={4} style={{ margin: 0 }}>{isEdit ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</Title>
            <Text type="secondary" className="text-xs">
              {isEdit ? 'Cập nhật thông tin cho ' + user.name : 'Nhập thông tin nhân viên mới để tham gia hệ thống'}
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
            label={<Text strong className="text-gray-600">Họ và tên</Text>}
            rules={[{ required: true, message: 'Họ và tên là bắt buộc' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="VD: Nguyễn Văn A"
              className="rounded-lg h-10 border-gray-200"
            />
          </Form.Item>
 
          <Form.Item
            name="email"
            label={<Text strong className="text-gray-600">Địa chỉ Email</Text>}
            rules={[
              { required: true, message: 'Email là bắt buộc' },
              { type: 'email', message: 'Vui lòng nhập đúng định dạng email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />} 
              placeholder="nguyenvana@example.com"
              className="rounded-lg h-10 border-gray-200"
              disabled={isEdit}
            />
          </Form.Item>
 
          <Form.Item
            name="phone"
            label={<Text strong className="text-gray-600">Số điện thoại</Text>}
            rules={[{ required: true, message: 'Số điện thoại là bắt buộc' }]}
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
              label={<Text strong className="text-gray-600">Mật khẩu khởi tạo</Text>}
              rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}
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
              label={<Text strong className="text-gray-600">Vai trò</Text>}
              rules={[{ required: true, message: 'Chọn ít nhất một vai trò' }]}
            >
              <Select 
                mode="multiple" 
                placeholder="Giao quyền"
                className="w-full"
                maxTagCount="responsive"
                suffixIcon={<SafetyCertificateOutlined />}
              >
                <Option value="ADMIN">Quản trị viên</Option>
                <Option value="MANAGER">Quản lý</Option>
                <Option value="STAFF">Nhân viên</Option>
              </Select>
            </Form.Item>
 
            <Form.Item
              name="status"
              label={<Text strong className="text-gray-600">Trạng thái tài khoản</Text>}
            >
              <Select className="w-full">
                <Option value="ACTIVE">
                  <Tag color="success" className="m-0 border-none">Đang hoạt động</Tag>
                </Option>
                <Option value="INACTIVE">
                  <Tag color="error" className="m-0 border-none">Bị vô hiệu hóa</Tag>
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
            Hủy
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            loading={loading}
            icon={<SaveOutlined />}
            className="rounded-lg h-10 px-8 bg-gradient-to-r from-blue-600 to-indigo-500 border-none shadow-md hover:shadow-lg transition-all"
          >
            {isEdit ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserModal;
