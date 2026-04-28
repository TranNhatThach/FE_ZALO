import React, { useState } from 'react';
import { Page } from 'zmp-ui';
import { useThemeStore } from '@/stores/theme.store';
import { 
  SearchOutlined, 
  FilterOutlined,
  WarningOutlined,
  StopOutlined,
  BellOutlined,
  ContainerOutlined,
  PlusOutlined,
  CheckOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useGetProducts } from '@/hooks/useProducts';
import { Spin, Modal, Form, InputNumber, message, Input, Select } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { productApi } from '@/api/product.api';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/queryKeys';
import { Upload } from 'antd';

export const GoodsPage: React.FC = () => {
  const { setSidebarCollapsed, isSidebarCollapsed, isDarkMode } = useThemeStore();
   const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useGetProducts();

  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  const handleOpenCheck = (item: any) => {
    setSelectedProduct(item);
    form.setFieldsValue({ stock: item.stock });
    setCheckModalVisible(true);
  };

  const handleUpdateStock = async () => {
    try {
      const values = await form.validateFields();
      await productApi.updateProduct(selectedProduct.id, {
        ...selectedProduct,
        stock: values.stock
      });
      message.success('Cập nhật tồn thực tế thành công!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.LIST });
      setCheckModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async () => {
    try {
        const values = await createForm.validateFields();
        const imageFile = fileList.length > 0 ? fileList[0].originFileObj : undefined;
        
        await productApi.createProduct(values, imageFile);
        message.success('Thêm sản phẩm mới thành công!');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.LIST });
        setCreateModalVisible(false);
        createForm.resetFields();
        setFileList([]);
    } catch (err) {
        console.error(err);
        message.error('Lỗi khi thêm sản phẩm');
    }
  };

  const filteredProducts = products.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      activeFilter === 'ALL' || 
      (activeFilter === 'LOW' && item.status === 'SẮP HẾT') ||
      (activeFilter === 'HIDDEN' && item.status === 'HẾT HÀNG');
    
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <Page className={`flex flex-col w-full h-full relative pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fc]'}`}>
      
      {/* 1. Header Area */}
      <div className={`flex items-center justify-between px-4 pt-2 pb-2 sticky top-0 z-[100] transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fc]'}`}>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 flex items-center justify-start border-none bg-transparent outline-none p-0 cursor-pointer active:opacity-70"
          >
            <ContainerOutlined className={`text-xl ${isDarkMode ? 'text-[#60a5fa]' : 'text-[#1e3ba1]'}`} />
          </button>
          <span className={`text-[18px] font-extrabold tracking-tight ${isDarkMode ? 'text-[#60a5fa]' : 'text-[#1e3ba1]'}`}>Inventory Manager</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-end border-none bg-transparent outline-none p-0 cursor-pointer active:opacity-70">
           <BellOutlined className={`text-[20px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>

      <div className="px-4 mt-2">
        {/* 2. Search Bar */}
        <div className="mb-4 relative">
          <div className={`flex items-center h-[44px] rounded-[14px] px-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800' : 'bg-white'}`}>
            <SearchOutlined className={`text-lg mr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm, SKU, danh mục..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-[14px] ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'}`}
            />
          </div>
          
          {/* Smart Suggestions Dropdown */}
          {searchTerm && products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 && (
            <div className={`absolute top-[48px] left-0 right-0 z-[110] rounded-xl shadow-xl border p-2 max-h-[300px] overflow-y-auto ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="px-2 py-1 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gợi ý sản phẩm</div>
              {products
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(0, 6)
                .map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSearchTerm(p.name)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                  >
                    <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-gray-100" alt={p.name} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{p.name}</div>
                      <div className="text-[10px] text-gray-500 font-medium uppercase">SKU: {p.sku}</div>
                    </div>
                    <div className="text-[12px] font-black text-blue-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* 3. Filter Chips (Status) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <button 
             onClick={() => setActiveFilter('ALL')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border-none font-semibold text-[13px] transition-colors ${activeFilter === 'ALL' ? (isDarkMode ? 'bg-[#3b82f6] text-white shadow-md' : 'bg-[#1e3ba1] text-white shadow-md shadow-blue-900/20') : (isDarkMode ? 'bg-[#2a2a2c] text-gray-400' : 'bg-[#eef2f9] text-[#4b5563]')}`}
           >
             <FilterOutlined className="mr-1.5" /> Tất cả
           </button>
           <button 
             onClick={() => setActiveFilter('LOW')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border font-semibold text-[13px] transition-colors ${activeFilter === 'LOW' ? (isDarkMode ? 'bg-red-900/40 border-red-800 text-red-400' : 'bg-[#fff1f2] border-red-200 text-red-600') : (isDarkMode ? 'bg-[#1a1a1c] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-[#4b5563]')}`}
           >
             <WarningOutlined className="mr-1.5" /> Sắp hết
           </button>
           <button 
             onClick={() => setActiveFilter('HIDDEN')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border font-semibold text-[13px] transition-colors ${activeFilter === 'HIDDEN' ? (isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-800') : (isDarkMode ? 'bg-[#1a1a1c] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-[#4b5563]')}`}
           >
             <StopOutlined className="mr-1.5" /> Hết hàng
           </button>
        </div>

        {/* 3b. Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                activeCategory === cat 
                ? (isDarkMode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-blue-50 border-blue-200 text-blue-600')
                : (isDarkMode ? 'bg-transparent border-gray-800 text-gray-500' : 'bg-white border-gray-100 text-gray-400')
              }`}
            >
              {cat === 'ALL' ? 'Tất cả danh mục' : cat}
            </button>
          ))}
        </div>

        {/* 4. Statistics Dashboard */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className={`flex-shrink-0 w-[160px] rounded-[16px] p-4 relative shadow-sm border-l-[3px] border-[#3b82f6] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <span className="text-gray-500 text-[11px] font-bold tracking-wider uppercase block mb-1">
              Tổng mặt hàng
            </span>
            <div className={`text-[26px] font-extrabold leading-none mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {products.length.toLocaleString('vi-VN')}
            </div>
          </div>
          <div className={`flex-shrink-0 w-[160px] rounded-[16px] p-4 relative shadow-sm border-l-[3px] border-[#6b7280] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <span className="text-gray-500 text-[11px] font-bold tracking-wider uppercase block mb-1">
              Đang kinh doanh
            </span>
            <div className={`text-[26px] font-extrabold leading-none mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {products.filter(p => p.status === 'CÒN HÀNG').length.toLocaleString('vi-VN')}
            </div>
          </div>
          <div className={`flex-shrink-0 w-[160px] rounded-[16px] p-4 relative shadow-sm border-l-[3px] border-[#ef4444] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <span className="text-gray-500 text-[11px] font-bold tracking-wider uppercase block mb-1">
              Hết hàng
            </span>
            <div className={`text-[26px] font-extrabold leading-none mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {products.filter(p => p.status === 'HẾT HÀNG').length.toLocaleString('vi-VN')}
            </div>
          </div>
        </div>

        {/* 5. Product List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className={`text-[13px] font-bold tracking-wider uppercase m-0 ${isDarkMode ? 'text-gray-400' : 'text-[#374151]'}`}>Danh sách sản phẩm</h3>
            <span className="text-gray-500 text-[11px] font-medium">
              Hiển thị {filteredProducts.length}/{products.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="py-10 flex flex-col items-center justify-center gap-2">
                <LoadingOutlined className="text-[32px] text-[#1e3ba1]" />
                <span className="text-[12px] text-gray-400">Đang tải sản phẩm...</span>
              </div>
            ) : filteredProducts.map((item) => (
              <div key={item.id} className={`rounded-[16px] p-3 flex shadow-sm relative active:opacity-80 transition-colors ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800' : 'bg-white border border-transparent active:bg-gray-50'}`}>
                
                <div className={`w-[64px] h-[64px] rounded-xl flex items-center justify-center p-2 flex-shrink-0 overflow-hidden relative ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-contain ${isDarkMode ? 'opacity-90' : 'mix-blend-multiply opacity-80'}`} />
                </div>

                <div className="ml-3 flex-1 min-w-0 pr-2 pt-0.5 relative pb-5">
                  <h4 className={`text-[14px] font-bold m-0 truncate leading-tight mb-0.5 pr-16 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </h4>
                  <div className={`text-[11px] mb-1.5 uppercase font-medium tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    SKU: {item.sku}
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenCheck(item); }}
                    className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md border-none cursor-pointer active:scale-95"
                  >
                    <EditOutlined /> Kiểm kho
                  </button>
                  
                  <div className={`text-[12px] font-semibold absolute bottom-0 left-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    <span className="text-gray-500 font-medium">Kho: </span>
                    <span className={`${item.stock === 0 ? 'text-gray-500' : item.stock <= 5 ? 'text-red-500 font-bold' : (isDarkMode ? 'text-gray-200' : 'text-gray-900')}`}>
                      {item.stock}
                    </span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end h-[calc(100%-24px)] justify-between">
                  {/* Category Badge */}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-[#dbeafe] text-[#2563eb]'}`}>
                    {item.category}
                  </span>

                  {/* Status Tag */}
                  <div>
                    {item.status === 'CÒN HÀNG' && (
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 uppercase ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-[#ecfccb] text-[#4d7c0f]'}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-[#65a30d]'}`}></span> Còn hàng
                       </span>
                    )}
                    {item.status === 'SẮP HẾT' && (
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 uppercase ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
                         <WarningOutlined /> Sắp hết
                       </span>
                    )}
                    {item.status === 'HẾT HÀNG' && (
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 uppercase ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                         <StopOutlined /> Hết hàng
                       </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button 
        onClick={() => setCreateModalVisible(true)}
        className="fixed right-5 bottom-[90px] w-[56px] h-[56px] rounded-full bg-[#1e3ba1] text-white shadow-lg flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20 cursor-pointer"
      >
        <PlusOutlined className="text-[24px]" />
      </button>

      {/* Create Product Modal */}
      <Modal
        title={<div className="font-black text-[#1e3ba1] uppercase">Thêm sản phẩm mới</div>}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={[
          <button key="back" onClick={() => setCreateModalVisible(false)} className="px-4 py-2 bg-gray-100 border-none rounded-xl mr-2 font-bold text-gray-500">Hủy</button>,
          <button key="submit" onClick={handleCreateProduct} className="px-4 py-2 bg-[#1e3ba1] border-none rounded-xl text-white font-bold">Thêm sản phẩm</button>
        ]}
        centered
        width={350}
        styles={{ body: { padding: '20px 10px' } }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label={<span className="text-[11px] font-bold text-gray-400 uppercase">Tên sản phẩm</span>} rules={[{ required: true }]}>
            <Input className="h-11 rounded-xl bg-gray-50 border-none font-bold" placeholder="VD: Máy khoan cầm tay..." />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="sku" label={<span className="text-[11px] font-bold text-gray-400 uppercase">Mã hiệu (SKU)</span>} rules={[{ required: true }]}>
              <Input className="h-11 rounded-xl bg-gray-50 border-none font-bold" placeholder="SKU-001" />
            </Form.Item>
            <Form.Item name="category" label={<span className="text-[11px] font-bold text-gray-400 uppercase">Danh mục</span>} rules={[{ required: true }]}>
               <Select className="h-11 rounded-xl" options={[
                  { value: 'Điện tử', label: 'Điện tử' },
                  { value: 'Công cụ', label: 'Công cụ' },
                  { value: 'Vật liệu', label: 'Vật liệu' },
                  { value: 'Hóa chất', label: 'Hóa chất' },
                  { value: 'Phụ kiện', label: 'Phụ kiện' },
                  { value: 'Khác', label: 'Khác' }
              ]} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="price" label={<span className="text-[11px] font-bold text-gray-400 uppercase">Đơn giá</span>} rules={[{ required: true }]}>
              <InputNumber className="w-full h-11 rounded-xl bg-gray-50 border-none font-bold" />
            </Form.Item>
            <Form.Item name="stock" label={<span className="text-[11px] font-bold text-gray-400 uppercase">Tồn kho đầu</span>} rules={[{ required: true }]}>
              <InputNumber className="w-full h-11 rounded-xl bg-gray-50 border-none font-bold" />
            </Form.Item>
          </div>

          <Form.Item label={<span className="text-[11px] font-bold text-gray-400 uppercase">Ảnh sản phẩm</span>}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="imageUrl" label={<span className="text-[11px] font-bold text-gray-400 uppercase">Hoặc Link ảnh</span>}>
            <Input className="h-11 rounded-xl bg-gray-50 border-none" placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Stock Take Modal */}
      <Modal
        title={<div className="font-black text-[#1e3ba1]">Kiểm kê thực tế</div>}
        open={checkModalVisible}
        onCancel={() => setCheckModalVisible(false)}
        footer={[
          <button key="back" onClick={() => setCheckModalVisible(false)} className="px-4 py-2 bg-gray-100 border-none rounded-xl mr-2 font-bold text-gray-500">Hủy</button>,
          <button key="submit" onClick={handleUpdateStock} className="px-4 py-2 bg-[#1e3ba1] border-none rounded-xl text-white font-bold">Lưu số liệu</button>
        ]}
        centered
        width={300}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="stock" label={<span className="text-[12px] font-bold text-gray-500">SỐ LƯỢNG THỰC TẾ TRONG KHO</span>}>
            <InputNumber className="w-full h-11 rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Basic inline style to hide scrollbar for webkit (Chrome/Safari) */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </Page>
  );
};

export default GoodsPage;
