import React, { useState } from 'react';
import { Page } from 'zmp-ui';
import { useThemeStore } from '@/stores/theme.store';
import {
  MenuOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MailOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Typography, Spin, message, Modal, Form, Input, Select } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/api/supplier.api';
import { QUERY_KEYS } from '@/api/queryKeys';

const { Title } = Typography;

export const SuppliersPage: React.FC = () => {
  const { setSidebarCollapsed, isSidebarCollapsed, isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER.LIST,
    queryFn: () => supplierApi.getSuppliers(),
  });

  const handleOpenCreate = () => {
    setIsEditMode(false);
    form.resetFields();
    setModalVisible(true);
  };

  const handleOpenEdit = (item: any) => {
    setIsEditMode(true);
    setSelectedSupplier(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleOpenDetail = (item: any) => {
    setSelectedSupplier(item);
    setDetailModalVisible(true);
  };

  const handleSaveSupplier = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && selectedSupplier) {
        await supplierApi.updateSupplier(selectedSupplier.id, values);
        message.success('Cập nhật nhà cung cấp thành công!');
      } else {
        await supplierApi.createSupplier({
          ...values,
          trangThai: values.trangThai || 'ACTIVE'
        });
        message.success('Thêm nhà cung cấp thành công!');
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIER.LIST });
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi lưu nhà cung cấp');
    }
  };

  const handleDeleteSupplier = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: 'Bạn có chắc muốn xóa nhà cung cấp này không?',
      okText: 'Xóa ngay',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk: async () => {
        try {
          await supplierApi.deleteSupplier(id);
          message.success('Đã xóa nhà cung cấp!');
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIER.LIST });
          setDetailModalVisible(false);
        } catch (err) {
          message.error('Lỗi khi xóa');
        }
      }
    });
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Page className={`flex flex-col w-full h-full relative pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#eff6ff]'}`}>

      {/* Header Area */}
      <div className={`flex items-center justify-between px-4 pt-1 pb-4 sticky top-0 z-[100] shadow-md transition-colors duration-300 mt-[-10px] ${isDarkMode ? 'bg-[#1a1a1c] border-b border-gray-800 shadow-xl' : 'bg-[#1e3ba1]'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className={`w-8 h-8 flex items-center justify-start border-none bg-transparent outline-none p-0 cursor-pointer ${isDarkMode ? 'text-gray-200' : 'text-white'}`}
          >
            <MenuOutlined className="text-[20px]" />
          </button>
          <span className={`text-[18px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-white'}`}>Quản lý Nhà Cung Cấp</span>
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className={`flex items-center h-[44px] rounded-full px-4 shadow-sm border transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'}`}>
            <SearchOutlined className={`text-lg mr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Tìm nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-[14px] ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'}`}
            />
            <button className={`bg-transparent border-none p-1 ${isDarkMode ? 'text-[#60a5fa]' : 'text-[#1e3ba1]'}`}>
              <FilterOutlined className="text-lg" />
            </button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="flex gap-4 mb-6">
          <div className={`flex-1 rounded-2xl p-4 shadow-md relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-800' : 'bg-[#1e3ba1] text-white'}`}>
            <span className={`text-[12px] font-medium tracking-wide ${isDarkMode ? 'text-blue-300' : 'text-blue-100'}`}>
              Tổng số
            </span>
            <div className={`text-[28px] font-bold mt-1 ${isDarkMode ? 'text-white' : ''}`}>
              {suppliers.length}
            </div>
            <div className="absolute right-[-10%] top-[20%] w-[80px] h-[80px] rounded-full bg-white opacity-10"></div>
          </div>
          <div className={`flex-1 rounded-2xl p-4 shadow-sm border transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'}`}>
            <span className={`text-[12px] font-medium tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Đang hoạt động
            </span>
            <div className={`text-[28px] font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {suppliers.filter(s => s.trangThai === 'ACTIVE' || s.trangThai === 'HOAT_DONG').length}
            </div>
          </div>
        </div>

        {/* List */}
        <div>
          <h3 className={`text-[15px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Danh sách</h3>
          {isLoading ? (
            <div className="flex justify-center py-10"><Spin /></div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredSuppliers.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleOpenDetail(item)}
                  className={`rounded-2xl p-4 shadow-sm border flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`font-bold m-0 text-[14px] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</h4>
                      <span className={`text-[12px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>LH: {item.phone}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.trangThai === 'ACTIVE' || item.trangThai === 'HOẠT ĐỘNG' || item.trangThai === 'HOAT_DONG' ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') : (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700')}`}>
                    {item.trangThai}
                  </div>
                </div>
              ))}
              {filteredSuppliers.length === 0 && <div className="text-center py-10 text-gray-500">Không tìm thấy nhà cung cấp nào</div>}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button
        onClick={handleOpenCreate}
        className="fixed right-5 bottom-[90px] w-[56px] h-[56px] rounded-full bg-[#1e3ba1] text-white shadow-lg flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20 cursor-pointer hover:bg-blue-800"
      >
        <PlusOutlined className="text-[24px]" />
      </button>

      {/* Create Supplier Modal */}
      <Modal
        title={<div className="font-black text-[#1e3ba1] uppercase">{isEditMode ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</div>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <button key="back" onClick={() => setModalVisible(false)} className="px-4 py-2 bg-gray-100 border-none rounded-xl mr-2 font-bold text-gray-500">Hủy</button>,
          <button key="submit" onClick={handleSaveSupplier} className="px-4 py-2 bg-[#1e3ba1] border-none rounded-xl text-white font-bold">{isEditMode ? 'Lưu thay đổi' : 'Thêm mới'}</button>
        ]}
        centered
        width={350}
        styles={{ body: { padding: '20px 10px' } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={<span className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tên nhà cung cấp</span>} rules={[{ required: true }]}>
            <Input className={`h-11 rounded-xl border-none font-bold ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-600' : 'bg-gray-50 text-gray-800'}`} placeholder="Tên Công ty / Đại lý..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="code" label={<span className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Mã NCC</span>} rules={[{ required: true }]}>
              <Input className={`h-11 rounded-xl border-none font-bold ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`} placeholder="SUP-001" />
            </Form.Item>
            <Form.Item name="phone" label={<span className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Số điện thoại</span>} rules={[{ required: true }]}>
              <Input className={`h-11 rounded-xl border-none font-bold ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`} placeholder="090..." />
            </Form.Item>
          </div>

          <Form.Item name="danhMuc" label={<span className="text-[11px] font-bold text-gray-400 uppercase">Danh mục cung ứng</span>}>
            <Select className="h-11 rounded-xl" options={[
              { value: 'Công nghệ', label: 'Công nghệ' },
              { value: 'Vật tư', label: 'Vật tư' },
              { value: 'Logistics', label: 'Logistics' },
              { value: 'Điện máy', label: 'Điện máy' }
            ]} />
          </Form.Item>

          <Form.Item name="address" label={<span className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Địa chỉ</span>}>
            <Input.TextArea className={`rounded-xl border-none font-medium ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`} rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Supplier Detail Premium Modal */}
      {selectedSupplier && detailModalVisible && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setDetailModalVisible(false)} />
          <div className={`relative w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            
            <div className={`h-32 relative flex items-center justify-center ${isDarkMode ? 'bg-blue-900/20' : 'bg-[#1e3ba1]'}`}>
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-3xl font-black border border-white/20">
                {selectedSupplier.name.charAt(0)}
              </div>
              <div className="absolute top-5 right-5 flex gap-2">
                <button
                   onClick={() => { handleDeleteSupplier(selectedSupplier.id); }}
                   className="w-9 h-9 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border-none backdrop-blur-md"
                >
                  <DeleteOutlined style={{ fontSize: 16 }} />
                </button>
                <button
                   onClick={() => { setDetailModalVisible(false); handleOpenEdit(selectedSupplier); }}
                   className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border-none backdrop-blur-md"
                >
                  <EditOutlined style={{ fontSize: 16 }} />
                </button>
                <button
                   onClick={() => setDetailModalVisible(false)}
                   className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center border-none backdrop-blur-md"
                >
                  <ArrowLeftOutlined rotate={90} style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className={`text-[20px] font-black m-0 mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedSupplier.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedSupplier.trangThai === 'ACTIVE' || selectedSupplier.trangThai === 'HOẠT ĐỘNG' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {selectedSupplier.trangThai}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <PhoneOutlined />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Điện thoại</div>
                    <div className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedSupplier.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                    <MailOutlined />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Email</div>
                    <div className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedSupplier.email || 'Chưa cập nhật'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <UserOutlined />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Người liên hệ</div>
                    <div className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedSupplier.contactPerson || 'Chưa cập nhật'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <EnvironmentOutlined />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Địa chỉ</div>
                    <div className={`text-[13px] font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedSupplier.address}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDetailModalVisible(false)}
                className="w-full h-12 mt-8 rounded-2xl bg-[#1e3ba1] text-white font-black text-[13px] border-none shadow-lg active:scale-95 transition-all"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default SuppliersPage;
