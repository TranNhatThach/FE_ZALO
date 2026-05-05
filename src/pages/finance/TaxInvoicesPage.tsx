import React, { useState } from 'react';
import { Page } from 'zmp-ui';
import { useThemeStore } from '@/stores/theme.store';
import {
    FileTextOutlined,
    PlusOutlined,
    CalculatorOutlined,
    DollarCircleOutlined,
    HistoryOutlined,
    WarningOutlined,
    CreditCardOutlined,
    FileSyncOutlined,
    FileImageOutlined,
    ShoppingCartOutlined,
    DeleteOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import { Typography, Spin, Modal, Form, Input, InputNumber, Select, Upload, message, Button, Divider, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi, InvoiceType, aiInvoiceApi } from '@/api/invoice.api';
import { productApi } from '@/api/product.api';
import { QUERY_KEYS } from '@/api/queryKeys';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export const TaxInvoicesPage: React.FC = () => {
    const { isDarkMode } = useThemeStore();
    const queryClient = useQueryClient();
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    const { data: invoices = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.INVOICES.LIST,
        queryFn: () => invoiceApi.getInvoices(),
    });

    const { data: productsPage } = useQuery({
        queryKey: ['PRODUCTS', 'LIST'],
        queryFn: () => productApi.getProducts(),
    });
    const products = productsPage?.content || [];

    const createMutation = useMutation({
        mutationFn: ({ data, file }: { data: any, file?: File }) => invoiceApi.createInvoice(data, file),
        onSuccess: () => {
            message.success('Đã lưu hóa đơn và tính thuế thành công');
            setModalVisible(false);
            form.resetFields();
            setFileList([]);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVOICES.LIST });
        },
        onError: () => {
            message.error('Lỗi khi lưu hóa đơn');
        }
    });

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const file = fileList.length > 0 ? fileList[0].originFileObj : undefined;
            createMutation.mutate({ data: values, file });
        } catch (err) {
            console.error(err);
        }
    };

    // Theo dõi giá trị để tính thuế thời gian thực
    const totalAmount = Form.useWatch('totalAmount', form) || 0;
    const taxRate = Form.useWatch('taxRate', form) || 0;
    const paymentMethod = Form.useWatch('paymentMethod', form);
    const taxAmount = totalAmount * taxRate;
    const finalAmount = totalAmount + taxAmount;
    
    const showPaymentWarning = totalAmount >= 20000000 && paymentMethod === 'TM';

    const handleXmlUpload = async (file: File) => {
        const hide = message.loading('Đang bóc tách và nhận diện...', 0);
        try {
            const data = await aiInvoiceApi.parseXml(file);
            
            // 1. Nhận diện loại hóa đơn
            const myCompanyName = "VANGUARD"; 
            let detectedType = InvoiceType.SELL;
            if (data.partnerName && !data.partnerName.toUpperCase().includes(myCompanyName)) {
                detectedType = InvoiceType.BUY;
            }

            // 2. Mapping sản phẩm thông minh
            const mappedItems = data.items?.map((xmlItem: any) => {
                const match = products.find((p: any) => 
                    p.name.toLowerCase().includes(xmlItem.productName.toLowerCase()) ||
                    xmlItem.productName.toLowerCase().includes(p.name.toLowerCase())
                );
                
                return {
                    productId: match?.id,
                    productName: xmlItem.productName,
                    quantity: Number(xmlItem.quantity || 0),
                    unitPrice: Number(xmlItem.unitPrice || 0)
                };
            }) || [];

            const calculatedTotal = mappedItems.reduce((acc: number, curr: any) => acc + (curr.quantity * curr.unitPrice), 0);

            form.setFieldsValue({
                invoiceNumber: String(data.invoiceNumber || ''),
                invoiceSymbol: String(data.invoiceSymbol || ''),
                invoiceDate: data.invoiceDate ? dayjs(data.invoiceDate) : dayjs(),
                type: detectedType,
                totalAmount: calculatedTotal > 0 ? calculatedTotal : Number(data.totalAmount || 0),
                taxRate: Number(data.taxRate || 0.1),
                taxCode: String(data.taxCode || ''),
                partnerName: String(data.partnerName || ''),
                paymentMethod: 'CK',
                items: mappedItems
            });
            hide();
            message.success(`Nhận diện: Hóa đơn ${detectedType === InvoiceType.SELL ? 'BÁN' : 'NHẬP'}`);
        } catch (err) {
            hide();
            message.error('Lỗi khi đọc file XML');
        }
    };

    return (
        <Page className={`flex flex-col w-full h-full relative pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#eff6ff]'}`}>

            {/* Header Area - Tối ưu cho Safe Area của Zalo */}
            <div 
                className={`px-4 pb-6 rounded-b-[32px] shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-b border-gray-800' : 'bg-gradient-to-r from-[#1e3ba1] to-[#3b82f6] text-white'}`}
                style={{ paddingTop: 'calc(var(--zaui-safe-area-inset-top, 24px) + 12px)' }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md ${isDarkMode ? 'bg-blue-500/20' : 'bg-white/20'}`}>
                            <CalculatorOutlined className="text-2xl" />
                        </div>
                        <div>
                            <span className={`text-[12px] font-bold uppercase tracking-widest opacity-70 ${isDarkMode ? 'text-blue-400' : 'text-white'}`}>Tài chính & Thuế</span>
                            <Title level={3} style={{ margin: 0, fontWeight: 900, color: 'inherit' }}>Hóa đơn & Chứng từ</Title>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className={`p-4 rounded-2xl backdrop-blur-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'}`}>
                        <div className="text-[10px] font-black uppercase opacity-60 mb-1">Tổng thuế (Tháng này)</div>
                        <div className="text-xl font-black">
                            {invoices.filter(i => dayjs(i.createdAt).month() === dayjs().month())
                                .reduce((acc, curr) => acc + curr.taxAmount, 0)
                                .toLocaleString('vi-VN')} đ
                        </div>
                    </div>
                    <div className={`p-4 rounded-2xl backdrop-blur-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'}`}>
                        <div className="text-[10px] font-black uppercase opacity-60 mb-1">Số lượng hóa đơn</div>
                        <div className="text-xl font-black">{invoices.length}</div>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-6">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className={`text-[14px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <HistoryOutlined className="mr-2" /> Lịch sử hóa đơn
                    </h3>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20"><Spin /></div>
                ) : (
                    <div className="space-y-4 pb-10">
                        {invoices.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => {
                                    setSelectedInvoice(item);
                                    setDetailModalVisible(true);
                                }}
                                className={`rounded-[24px] p-4 shadow-sm border flex items-center justify-between transition-all active:scale-[0.98] ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                        {item.photoUrl ? (
                                            <img src={item.photoUrl} alt="invoice" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <FileTextOutlined className={`text-xl ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <Text className={`font-black text-[15px] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>#{item.invoiceNumber || 'HD-' + item.id}</Text>
                                        <Text className="text-[11px] text-gray-500 font-bold uppercase">{dayjs(item.invoiceDate).format('DD/MM/YYYY')} • {item.type}</Text>
                                        <div className="mt-1">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.type === 'SELL' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {item.type === 'SELL' ? 'BÁN RA' : 'NHẬP VÀO'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[16px] font-black ${isDarkMode ? 'text-blue-400' : 'text-[#1e3ba1]'}`}>
                                        {item.type === 'SELL' ? '+' : '-'}{item.finalAmount.toLocaleString('vi-VN')} đ
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Thuế: {item.taxAmount.toLocaleString('vi-VN')} đ</div>
                                </div>
                            </div>
                        ))}

                        {invoices.length === 0 && (
                            <div className="py-20 text-center flex flex-col items-center gap-3">
                                <FileTextOutlined className="text-5xl text-gray-200" />
                                <Text className="text-gray-400 font-medium">Chưa có dữ liệu hóa đơn</Text>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setModalVisible(true)}
                className="fixed right-6 bottom-[100px] w-16 h-16 rounded-[22px] bg-[#1e3ba1] text-white shadow-xl shadow-blue-900/30 flex items-center justify-center border-none outline-none active:scale-90 transition-transform z-[1001]"
            >
                <PlusOutlined className="text-[28px]" />
            </button>

            {/* Create Invoice Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 mb-2 pt-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <CalculatorOutlined className="text-blue-600" />
                        </div>
                        <span className="font-black text-gray-800 text-lg uppercase tracking-tight">Kê khai Hóa đơn</span>
                    </div>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                closeIcon={null}
                footer={null}
                centered={false} // Tắt centered để dùng thuộc tính top
                style={{ top: 100 }} // Đẩy xuống 100px để tránh nút Zalo
                styles={{ body: { padding: '20px' } }}
            >
                <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-dashed border-slate-300 flex flex-col items-center gap-2">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tự động nhập bằng XML</div>
                    <Upload
                        accept=".xml"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            handleXmlUpload(file);
                            return false;
                        }}
                    >
                        <Button icon={<FileSyncOutlined />} className="rounded-xl border-blue-100 text-blue-600 font-bold h-10">Tải file XML</Button>
                    </Upload>
                </div>

                <Divider className="my-4" />

                <Form form={form} layout="vertical" onFinish={handleCreate} initialValues={{ taxRate: 0.1, type: 'SELL', paymentMethod: 'CK' }}>
                    <div className="grid grid-cols-2 gap-3">
                        <Form.Item name="invoiceNumber" label={<span className="text-[11px] font-black uppercase text-gray-400">Số hóa đơn</span>}>
                            <Input className="h-11 rounded-xl bg-gray-50 border-none font-bold" />
                        </Form.Item>
                        <Form.Item name="invoiceSymbol" label={<span className="text-[11px] font-black uppercase text-gray-400">Ký hiệu</span>}>
                            <Input className="h-11 rounded-xl bg-gray-50 border-none font-bold" />
                        </Form.Item>
                    </div>

                    <Form.Item name="partnerName" label={<span className="text-[11px] font-black uppercase text-gray-400">Đối tác / Công ty</span>} rules={[{ required: true }]}>
                        <Input className="h-11 rounded-xl bg-gray-50 border-none font-bold" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-3">
                        <Form.Item name="taxCode" label={<span className="text-[11px] font-black uppercase text-gray-400">MST</span>}>
                            <Input className="h-11 rounded-xl bg-gray-50 border-none font-bold" />
                        </Form.Item>
                        <Form.Item name="paymentMethod" label={<span className="text-[11px] font-black uppercase text-gray-400">Thanh toán</span>}>
                            <Select className="h-11 rounded-xl" options={[
                                { value: 'CK', label: 'CK' },
                                { value: 'TM', label: 'TM' },
                                { value: 'TM_CK', label: 'TM/CK' }
                            ]} />
                        </Form.Item>
                    </div>

                    {showPaymentWarning && (
                        <div className="bg-red-50 p-2 rounded-xl mb-4 text-red-500 text-[10px] font-black flex items-center gap-1 border border-red-100 uppercase italic animate-pulse">
                            <WarningOutlined /> Cảnh báo: &gt; 20tr tiền mặt không được khấu trừ thuế!
                        </div>
                    )}

                    <Form.Item name="totalAmount" label={<span className="text-[11px] font-black uppercase text-gray-400">Số tiền gốc (VND)</span>} rules={[{ required: true }]}>
                        <InputNumber className="w-full h-11 rounded-xl bg-gray-50 border-none font-black text-lg" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    </Form.Item>

                    <Form.Item name="taxRate" label={<span className="text-[11px] font-black uppercase text-gray-400">Mức thuế (VAT)</span>}>
                        <Select className="h-11 rounded-xl" options={[
                            { value: 0, label: '0%' },
                            { value: 0.05, label: '5%' },
                            { value: 0.08, label: '8%' },
                            { value: 0.1, label: '10%' }
                        ]} />
                    </Form.Item>

                    {/* Danh sách sản phẩm - Bản rút gọn cho Mobile */}
                    <div className="mb-6 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingCartOutlined className="text-blue-500" />
                            <span className="text-[11px] font-black uppercase text-slate-600">Chi tiết mặt hàng</span>
                        </div>
                        <Form.List name="items">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="bg-white p-3 rounded-2xl border border-slate-50 shadow-sm mb-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'productName']}
                                                    rules={[{ required: true }]}
                                                    style={{ marginBottom: 0, flex: 1, marginRight: 8 }}
                                                >
                                                    <Input placeholder="Tên hàng hóa" className="font-bold text-blue-600 border-none bg-blue-50/30 p-1" />
                                                </Form.Item>
                                                <DeleteOutlined onClick={() => remove(name)} className="text-red-400 p-1" />
                                            </div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'productId']}
                                                style={{ marginBottom: 8 }}
                                            >
                                                <Select 
                                                    placeholder="Khớp với kho (Tùy chọn)" 
                                                    showSearch 
                                                    size="small"
                                                    optionFilterProp="children"
                                                    onChange={(val) => {
                                                        const p = products.find((prod: any) => prod.id === val);
                                                        if (p) {
                                                            const items = form.getFieldValue('items');
                                                            items[name].unitPrice = p.price;
                                                            items[name].productName = p.name;
                                                            form.setFieldsValue({ items });
                                                        }
                                                    }}
                                                >
                                                    {products.map((p: any) => (
                                                        <Option key={p.id} value={p.id}>{p.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <div className="flex gap-2">
                                                <Form.Item {...restField} name={[name, 'quantity']} style={{ marginBottom: 0, flex: 1 }}>
                                                    <InputNumber placeholder="SL" className="w-full rounded-lg" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'unitPrice']} style={{ marginBottom: 0, flex: 2 }}>
                                                    <InputNumber placeholder="Đơn giá" className="w-full rounded-lg" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    ))}
                                    <Button 
                                        type="dashed" 
                                        onClick={() => add()} 
                                        block 
                                        icon={<PlusCircleOutlined />}
                                        className="rounded-xl border-blue-100 text-blue-500 h-10"
                                    >
                                        Thêm hàng hóa
                                    </Button>
                                </>
                            )}
                        </Form.List>
                        <Button 
                            type="link" 
                            size="small" 
                            onClick={() => {
                                const items = form.getFieldValue('items') || [];
                                const total = items.reduce((acc: number, curr: any) => acc + (curr.quantity * curr.unitPrice || 0), 0);
                                form.setFieldsValue({ totalAmount: total });
                            }}
                            className="w-full text-[10px] font-black text-blue-500 uppercase mt-2"
                        >
                            Đồng bộ tổng tiền hàng
                        </Button>
                    </div>

                    {/* Auto Calculation Preview */}
                    <div className="bg-blue-50 p-4 rounded-2xl mb-6 border border-blue-100 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Tiền thuế dự tính</span>
                            <span className="text-lg font-black text-blue-700">{taxAmount.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Tổng thanh toán</span>
                            <div className="text-xl font-black text-blue-900">{finalAmount.toLocaleString('vi-VN')} đ</div>
                        </div>
                    </div>

                    <Form.Item label={<span className="text-[11px] font-black uppercase text-gray-400">Ảnh hóa đơn</span>}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            beforeUpload={() => false}
                            maxCount={1}
                        >
                            {fileList.length < 1 && (
                                <div className="flex flex-col items-center">
                                    <FileImageOutlined className="text-xl text-gray-300" />
                                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <div className="flex gap-3 mt-4">
                        <Button
                            onClick={() => setModalVisible(false)}
                            className="flex-1 h-14 rounded-2xl text-[14px] font-bold text-gray-400 border-none bg-gray-100"
                        >
                            HỦY
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createMutation.isPending}
                            className="flex-[2] h-14 rounded-2xl text-[16px] font-black shadow-lg shadow-blue-900/20 bg-[#1e3ba1] border-none"
                        >
                            LƯU & TÍNH TOÁN
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Detail View Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 mb-2 pt-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileTextOutlined className="text-blue-600" />
                        </div>
                        <span className="font-black text-gray-800 text-lg uppercase tracking-tight">Chi tiết Hóa đơn</span>
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                closeIcon={null}
                footer={
                    <Button 
                        onClick={() => setDetailModalVisible(false)}
                        className="w-full h-12 rounded-2xl font-black bg-gray-100 border-none"
                    >ĐÓNG</Button>
                }
                style={{ top: 80 }}
                styles={{ body: { padding: '20px' } }}
            >
                {selectedInvoice && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center py-4 bg-blue-50/30 rounded-3xl border border-blue-50">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Tổng cộng thanh toán</span>
                            <div className="text-3xl font-black text-blue-900">{selectedInvoice.finalAmount?.toLocaleString('vi-VN')} đ</div>
                            <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedInvoice.type === 'SELL' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {selectedInvoice.type === 'SELL' ? 'Hóa đơn Bán ra' : 'Hóa đơn Nhập vào'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Text className="text-[10px] font-black text-gray-400 uppercase">Số hóa đơn</Text>
                                <div className="font-bold text-[14px] text-gray-800">#{selectedInvoice.invoiceNumber || selectedInvoice.id}</div>
                            </div>
                            <div className="text-right">
                                <Text className="text-[10px] font-black text-gray-400 uppercase">Ngày lập</Text>
                                <div className="font-bold text-[14px] text-gray-800">{dayjs(selectedInvoice.invoiceDate).format('DD/MM/YYYY')}</div>
                            </div>
                        </div>

                        <div>
                            <Text className="text-[10px] font-black text-gray-400 uppercase">Đối tác / Công ty</Text>
                            <div className="font-black text-[16px] text-gray-900">{selectedInvoice.partnerName || 'N/A'}</div>
                            {selectedInvoice.taxCode && <div className="text-[11px] text-gray-500 font-medium">MST: {selectedInvoice.taxCode}</div>}
                        </div>

                        <Divider className="my-2" />

                        {/* Danh sách mặt hàng */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <ShoppingCartOutlined className="text-blue-500" />
                                <span className="text-[11px] font-black text-gray-600 uppercase">Danh mục hàng hóa</span>
                            </div>
                            <div className="space-y-3">
                                {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                                    selectedInvoice.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-black text-gray-800">{item.productName || 'Sản phẩm ' + (idx+1)}</span>
                                                <span className="text-[11px] text-gray-500 font-bold">{item.quantity} x {item.unitPrice?.toLocaleString('vi-VN')} đ</span>
                                            </div>
                                            <div className="font-black text-gray-900">
                                                {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 italic text-gray-400 text-[11px]">Không có chi tiết mặt hàng</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex justify-between mb-1">
                                <span className="text-[12px] font-bold text-gray-500">Tiền hàng gốc:</span>
                                <span className="text-[12px] font-black">{selectedInvoice.totalAmount?.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[12px] font-bold text-gray-500">Tiền thuế VAT:</span>
                                <span className="text-[12px] font-black text-blue-600">+{selectedInvoice.taxAmount?.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>

                        {selectedInvoice.photoUrl && (
                            <div className="mt-4">
                                <Text className="text-[10px] font-black text-gray-400 uppercase block mb-2">Ảnh chứng từ</Text>
                                <img src={selectedInvoice.photoUrl} alt="invoice" className="w-full rounded-2xl border border-gray-100" />
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </Page>
    );
};

export default TaxInvoicesPage;
