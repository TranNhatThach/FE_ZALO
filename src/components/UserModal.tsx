import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Tag, Button, Typography, Space, Divider, message } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  SafetyCertificateOutlined, 
  IdcardOutlined,
  SaveOutlined,
  CalendarOutlined,
  EnvironmentOutlined
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
  const [isEditingMode, setIsEditingMode] = useState(!user);
  const isEdit = !!user;

  useEffect(() => {
    if (visible) {
      setIsEditingMode(!user);
      if (user) {
        form.setFieldsValue({
          ...user,
          name: user.fullName || user.name,
          roles: user.roleName ? [user.roleName] : (user.roles?.length ? user.roles : ['STAFF']),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: 'PENDING_ACTIVE',
          roles: ['STAFF'],
          gender: 'NAM',
        });
      }
    }
  }, [visible, user, form]);

  const generatePassword = (fullName: string, birthday: string, phone: string) => {
    if (!fullName) return '123456';
    const nameParts = fullName.trim().split(' ');
    let firstName = nameParts[nameParts.length - 1];
    firstName = firstName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    const bdayClean = birthday ? birthday.replace(/[/.-]/g, '') : '01012000';
    const phoneSuffix = phone ? phone.toString().slice(-3) : '000';
    return `${firstName}${bdayClean}@${phoneSuffix}`;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const phone = (values.phone || '').toString().trim();
      const birthday = values.birthday || '';

      const payload: any = {
        fullName: values.name || values.fullName,
        email: values.email,
        phone,
        username: phone,
        roles: values.roles || ['STAFF'],
        gender: values.gender || 'NAM',
        identityCard: values.identityCard,
        address: values.address,
        birthday: birthday || null,
        status: values.status || 'PENDING_ACTIVE',
      };

      if (!isEdit) {
        payload.password = generatePassword(payload.fullName, birthday, phone);
      }

      if (isEdit && user) {
        await userService.update(user.id, payload);
        message.success({ content: 'Cập nhật thông tin thành công', style: { marginTop: '10vh' } });
      } else {
        await userService.create(payload);
        message.success({ content: 'Tạo nhân viên thành công! Mật khẩu đã được cấp tự động.', style: { marginTop: '10vh' } });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      if (error?.errorFields) return;
      console.error('Submit error:', error);
      message.error(error?.message || 'Thao tác thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const renderViewItem = (icon: React.ReactNode, label: string, value: any, colorClass: string = "text-blue-500") => (
    <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{label}</div>
        <div className="text-[13px] font-bold text-gray-800">{value || '---'}</div>
      </div>
    </div>
  );

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={450}
      className="premium-modal-compact"
      styles={{ body: { padding: '16px 20px' } }}
      title={
        <div className="flex items-center justify-between w-full pr-8">
           <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${isEdit ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                {isEdit ? <IdcardOutlined className="text-lg" /> : <UserOutlined className="text-lg" />}
              </div>
              <div>
                <Title level={5} style={{ margin: 0, fontSize: '16px' }}>{isEdit ? 'Hồ sơ nhân viên' : 'Thêm nhân viên'}</Title>
                <Text type="secondary" className="text-[10px] block -mt-1">
                  {isEdit ? 'ID: ' + user.id : 'Khởi tạo tài khoản mới'}
                </Text>
              </div>
           </div>
           {isEdit && !isEditingMode && (
             <Button 
                type="text" 
                icon={<SaveOutlined className="text-blue-600" />} 
                onClick={() => setIsEditingMode(true)}
                className="text-blue-600 font-bold text-xs hover:bg-blue-50"
             >
                CHỈNH SỬA
             </Button>
           )}
        </div>
      }
    >
      <Divider className="my-2" />
      
      {!isEditingMode ? (
        <div className="py-2">
          <div className="flex items-center space-x-4 mb-6 bg-blue-50/50 p-4 rounded-3xl border border-blue-100/50">
             <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=3b82f6&color=fff`} 
                  className="w-full h-full object-cover"
                />
             </div>
             <div>
                <h3 className="m-0 text-lg font-black text-gray-900">{user?.fullName || user?.name}</h3>
                <Tag color={user?.isActive ? 'success' : 'error'} className="m-0 mt-1 border-none font-bold text-[10px] px-2">
                   {user?.isActive ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                </Tag>
             </div>
          </div>

          <div className="flex flex-col gap-1">
            {renderViewItem(<MailOutlined />, "Email", user?.email)}
            {renderViewItem(<PhoneOutlined />, "Số điện thoại", user?.phone, "text-green-500")}
            {renderViewItem(<SafetyCertificateOutlined />, "Vai trò", 
              (user?.roleName || user?.roles?.[0] || '').toUpperCase().includes('ADMIN') ? 'QUẢN TRỊ' : 'NHÂN VIÊN', 
              "text-amber-500"
            )}
            {renderViewItem(<CalendarOutlined />, "Ngày sinh", user?.birthday, "text-purple-500")}
            {renderViewItem(<UserOutlined />, "Giới tính", 
              ['MALE', 'NAM', '1'].includes((user?.gender || '').toUpperCase().trim()) ? 'NAM' : 
              ['FEMALE', 'NỮ', 'NU', '0'].includes((user?.gender || '').toUpperCase().trim()) ? 'NỮ' : (user?.gender || 'KHÁC'), 
              "text-indigo-500"
            )}
            {renderViewItem(<EnvironmentOutlined />, "Địa chỉ", user?.address, "text-red-500")}
          </div>

          <div className="mt-6 flex justify-end">
             <Button onClick={onClose} className="rounded-xl font-bold text-gray-500 h-10 px-8">ĐÓNG</Button>
          </div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="user-form-compact"
        >
          <div className="grid grid-cols-1 gap-y-1">
            <div className="grid grid-cols-2 gap-x-3">
               <Form.Item
                 name="name"
                 label={<Text strong className="text-[12px] text-gray-500">Họ và tên</Text>}
                 rules={[{ required: true, message: 'Bắt buộc' }]}
                 className="mb-2"
               >
                 <Input 
                   prefix={<UserOutlined className="text-gray-400" />} 
                   placeholder="Họ tên"
                   className="rounded-lg h-9 text-[13px] border-gray-200"
                 />
               </Form.Item>

               <Form.Item
                 name="phone"
                 label={<Text strong className="text-[12px] text-gray-500">Số điện thoại</Text>}
                 rules={[{ required: true, message: 'Bắt buộc' }]}
                 className="mb-2"
               >
                 <Input 
                   prefix={<PhoneOutlined className="text-gray-400" />} 
                   placeholder="09xx..."
                   className="rounded-lg h-9 text-[13px] border-gray-200"
                 />
               </Form.Item>
            </div>
   
            <Form.Item
              name="email"
              label={<Text strong className="text-[12px] text-gray-500">Địa chỉ Email</Text>}
              rules={[
                { required: true, message: 'Bắt buộc' },
                { type: 'email', message: 'Sai định dạng' }
              ]}
              className="mb-2"
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="email@example.com"
                className="rounded-lg h-9 text-[13px] border-gray-200"
                disabled={isEdit}
              />
            </Form.Item>
   
            {!isEdit && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#1e40af', marginBottom: 8 }}>
                💡 Mật khẩu sẽ tự động tạo dựa trên tên, ngày sinh và SĐT của nhân viên.
              </div>
            )}
   
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                name="roles"
                label={<Text strong className="text-[12px] text-gray-500">Vai trò</Text>}
                rules={[{ required: true, message: 'Bắt buộc' }]}
                className="mb-2"
              >
                <Select 
                  mode="multiple" 
                  placeholder="Chọn vai trò"
                  className="w-full text-[13px]"
                  maxTagCount="responsive"
                >
                  <Option value="ADMIN"><span style={{ color: '#1d4ed8', fontWeight: 700 }}>🔑 Quản trị (ADMIN)</span></Option>
                  <Option value="MANAGER"><span style={{ color: '#059669', fontWeight: 600 }}>📋 Quản lý (MANAGER)</span></Option>
                  <Option value="STAFF"><span style={{ color: '#475569' }}>👷 Nhân viên (STAFF)</span></Option>
                </Select>
              </Form.Item>
  
              <Form.Item
                name="status"
                label={<Text strong className="text-[12px] text-gray-500">Trạng thái</Text>}
                className="mb-2"
              >
                <Select className="w-full text-[13px]" disabled={!isEdit}>
                  <Option value="ACTIVE"><span className="text-green-600 text-[12px] font-bold">✅ Hoạt động</span></Option>
                  <Option value="PENDING_ACTIVE"><span className="text-amber-600 text-[12px] font-bold">⏳ Chờ kích hoạt</span></Option>
                  <Option value="INACTIVE"><span className="text-red-500 text-[12px] font-bold">🔒 Đã khóa</span></Option>
                </Select>
              </Form.Item>
            </div>
  
            <Divider className="!my-2"><Text type="secondary" className="text-[9px] uppercase font-black tracking-widest opacity-50">Thông tin bổ sung</Text></Divider>
  
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                name="birthday"
                label={<Text strong className="text-[12px] text-gray-500">Ngày sinh</Text>}
                className="mb-2"
              >
                <Input 
                  placeholder="DD/MM/YYYY"
                  className="rounded-lg h-9 text-[13px] border-gray-200"
                />
              </Form.Item>
  
              <Form.Item
                name="gender"
                label={<Text strong className="text-[12px] text-gray-500">Giới tính</Text>}
                className="mb-2"
              >
                <Select className="w-full h-9 text-[13px]" placeholder="Chọn">
                  <Option value="NAM">Nam</Option>
                  <Option value="NU">Nữ</Option>
                  <Option value="KHAC">Khác</Option>
                </Select>
              </Form.Item>
            </div>
  
            <Form.Item
              name="address"
              label={<Text strong className="text-[12px] text-gray-500">Địa chỉ</Text>}
              className="mb-2"
            >
              <Input 
                placeholder="Địa chỉ thường trú..."
                className="rounded-lg h-9 text-[13px] border-gray-200"
              />
            </Form.Item>
          </div>
   
          <div className="flex justify-end items-center space-x-2 mt-4">
            <Button 
              onClick={() => isEdit ? setIsEditingMode(false) : onClose()} 
              className="rounded-lg h-9 px-4 text-[13px] border-gray-200"
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              loading={loading}
              className="rounded-lg h-9 px-6 text-[13px] bg-gradient-to-r from-blue-600 to-indigo-500 border-none shadow-md"
            >
              {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default UserModal;
