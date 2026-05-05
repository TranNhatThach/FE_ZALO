import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, DatePicker, Divider } from 'antd';
import { User } from '../../../types/auth.types';
import { userService } from '../../../services/user.service';
import dayjs from 'dayjs';
import { 
  UserOutlined, 
  EditOutlined, 
  SafetyCertificateOutlined, 
  SolutionOutlined, 
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  BulbOutlined
} from '@ant-design/icons';


const { Option } = Select;

interface UserModalProps {
  visible?: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const generatePassword = (fullName: string, birthday: string, phone: string) => {
  if (!fullName) return '123456';
  const nameParts = fullName.trim().split(' ');
  let firstName = nameParts[nameParts.length - 1];
  firstName = firstName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
  const bdayClean = birthday ? birthday.replace(/[/.-]/g, '') : '01012000';
  const phoneSuffix = phone ? phone.slice(-3) : '000';
  return `${firstName}${bdayClean}@${phoneSuffix}`;
};

const UserModal: React.FC<UserModalProps> = ({ visible, user, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!user;

  useEffect(() => {
    if (visible) {
      if (user) {
        form.setFieldsValue({
          ...user,
          roles: user.roleName ? [user.roleName] : (user.roles?.length ? user.roles : ['STAFF']),
          birthday: user.birthday ? dayjs(user.birthday) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          roles: ['STAFF'],
          gender: 'NAM',
          status: 'PENDING_ACTIVE',
        });
      }
    }
  }, [visible, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const birthdayStr = values.birthday ? values.birthday.format('YYYY-MM-DD') : null;
      const phone = values.phone?.toString().trim() || '';

      const payload: any = {
        fullName: values.fullName,
        email: values.email,
        phone,
        username: phone,
        roles: values.roles || ['STAFF'],
        gender: values.gender || 'NAM',
        identityCard: values.identityCard,
        address: values.address,
        birthday: birthdayStr,
        status: values.status || 'PENDING_ACTIVE',
      };

      if (!isEdit) {
        // Tự sinh mật khẩu khi tạo mới
        payload.password = generatePassword(values.fullName, birthdayStr || '', phone);
      }

      if (isEdit && user) {
        await userService.update(user.id, payload);
        message.success('Cập nhật nhân viên thành công!');
      } else {
        await userService.create(payload);
        message.success('Tạo nhân viên thành công! Mật khẩu đã được cấp.');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      if (error?.errorFields) return; // validation error, ignore
      console.error('Submit error:', error);
      message.error(error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            background: '#eff6ff', 
            color: '#1d4ed8', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 18
          }}>
            {isEdit ? <EditOutlined /> : <UserOutlined />}
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em', color: '#111827' }}>
            {isEdit ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự mới'}
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? 'Lưu thay đổi' : 'Tạo nhân viên'}
      cancelText="Huỷ"
      confirmLoading={loading}
      destroyOnClose
      width={520}
    >
      <Divider style={{ marginTop: 8, marginBottom: 16 }} />
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        {/* Họ và tên */}
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="nhanvien@congty.com" disabled={isEdit} />
        </Form.Item>

        {/* SĐT */}
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
        >
          <Input placeholder="09xx xxx xxx" />
        </Form.Item>

        {/* CCCD */}
        <Form.Item
          name="identityCard"
          label="Số CCCD / Căn cước"
          rules={[{ required: true, message: 'Vui lòng nhập CCCD' }]}
        >
          <Input placeholder="03xxxxxxxxxx" />
        </Form.Item>

        {/* Giới tính + Ngày sinh */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Form.Item name="gender" label="Giới tính" style={{ flex: 1 }}>
            <Select>
              <Option value="NAM">Nam</Option>
              <Option value="NU">Nữ</Option>
              <Option value="KHAC">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="birthday" label="Ngày sinh" style={{ flex: 1 }}>
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="01/01/2000"
            />
          </Form.Item>
        </div>

        {/* Địa chỉ */}
        <Form.Item name="address" label="Địa chỉ thường trú">
          <Input placeholder="Số nhà, Tên đường, Quận/Huyện..." />
        </Form.Item>

        {/* Vai trò */}
        <Form.Item
          name="roles"
          label="Vai trò"
          rules={[{ required: true, message: 'Chọn ít nhất 1 vai trò' }]}
        >
          <Select mode="multiple" placeholder="Chọn vai trò">
            <Option value="ADMIN">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyCertificateOutlined style={{ color: '#1d4ed8' }} />
                <span style={{ color: '#1d4ed8', fontWeight: 700 }}>Quản trị viên (ADMIN)</span>
              </div>
            </Option>
            <Option value="MANAGER">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SolutionOutlined style={{ color: '#059669' }} />
                <span style={{ color: '#059669', fontWeight: 600 }}>Quản lý (MANAGER)</span>
              </div>
            </Option>
            <Option value="STAFF">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined style={{ color: '#475569' }} />
                <span style={{ color: '#475569', fontWeight: 600 }}>Nhân viên (STAFF)</span>
              </div>
            </Option>
          </Select>
        </Form.Item>

        {/* Trạng thái (chỉ chỉnh khi edit) */}
        {isEdit && (
          <Form.Item name="status" label="Trạng thái tài khoản">
            <Select>
              <Option value="ACTIVE">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircleOutlined style={{ color: '#10b981' }} />
                  <span>Đang hoạt động</span>
                </div>
              </Option>
              <Option value="PENDING_ACTIVE">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockCircleOutlined style={{ color: '#f59e0b' }} />
                  <span>Chờ kích hoạt</span>
                </div>
              </Option>
              <Option value="INACTIVE">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LockOutlined style={{ color: '#ef4444' }} />
                  <span>Đã khóa</span>
                </div>
              </Option>
            </Select>
          </Form.Item>
        )}

        {!isEdit && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #e0f2fe',
            borderRadius: 14,
            padding: '12px 16px',
            fontSize: 12,
            color: '#0369a1',
            marginTop: 8,
            display: 'flex',
            gap: 10,
            alignItems: 'start'
          }}>
            <BulbOutlined style={{ fontSize: 16, marginTop: 2 }} />
            <div style={{ fontWeight: 600, lineHeight: 1.5 }}>
              Mật khẩu sẽ được tự động tạo dựa trên tên, ngày sinh và SĐT của nhân viên để đảm bảo tính bảo mật và dễ nhớ.
            </div>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UserModal;
