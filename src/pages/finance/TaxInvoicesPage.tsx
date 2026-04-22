import React, { useState } from 'react';
import { Page } from 'zmp-ui';
import { useThemeStore } from '@/stores/theme.store';
import { 
  FileTextOutlined, 
  PlusOutlined, 
  CalculatorOutlined,
  DollarCircleOutlined,
  HistoryOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { Typography, Spin, Modal, Form, Input, InputNumber, Select, Upload, message, Button } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi, InvoiceType } from '@/api/invoice.api';
import { QUERY_KEYS } from '@/api/queryKeys';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const TaxInvoicesPage: React.FC = () => {
    const { isDarkMode } = useThemeStore();
    const queryClient = useQueryClient();
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    const { data: invoices = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.INVOICES.LIST,
        queryFn: () => invoiceApi.getInvoices(),
    });

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
    const taxAmount = totalAmount * taxRate;
    const finalAmount = totalAmount + taxAmount;

    return (
        <Page className={`flex flex-col w-full h-full relative pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fa]'}`}>
            
            {/* Header Area */}
            <div className={`px-4 pt-4 pb-6 rounded-b-[32px] shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-b border-gray-800' : 'bg-gradient-to-r from-[#1e3ba1] to-[#3b82f6] text-white'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md ${isDarkMode ? 'bg-blue-500/20' : 'bg-white/20'}`}>
                            <CalculatorOutlined className="text-2xl" />
                        </div>
                        <div>
                            <span className={`text-[12px] font-bold uppercase tracking-widest opacity-70 ${isDarkMode ? 'text-blue-400' : 'text-white'}`}>Tài chính & Thuế</span>
                            <Title level={3} style={{ margin: 0, fontWeight: 900, color: 'inherit' }}>Quản lý Hóa đơn</Title>
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
                            <div key={item.id} className={`rounded-[24px] p-4 shadow-sm border flex items-center justify-between transition-all active:scale-[0.98] ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-50'}`}>
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
                                        {item.finalAmount.toLocaleString('vi-VN')} đ
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold">Thuế: {item.taxAmount.toLocaleString('vi-VN')} đ</div>
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
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <CalculatorOutlined className="text-blue-600" />
                        </div>
                        <span className="font-black text-gray-800 text-lg uppercase tracking-tight">Kê khai hóa đơn & Thuế</span>
                    </div>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                centered
                styles={{ body: { padding: '24px' } }}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate} initialValues={{ taxRate: 0.1, type: 'SELL' }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="invoiceNumber" label={<span className="text-[11px] font-black uppercase text-gray-400">Số hóa đơn</span>}>
                            <Input className="h-11 rounded-xl bg-gray-50 border-none font-bold" placeholder="HD-888..." />
                        </Form.Item>
                        <Form.Item name="type" label={<span className="text-[11px] font-black uppercase text-gray-400">Loại</span>}>
                            <Select className="h-11 rounded-xl" options={[
                                { value: 'SELL', label: 'Bán ra' },
                                { value: 'BUY', label: 'Nhập vào' }
                            ]} />
                        </Form.Item>
                    </div>

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

                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={createMutation.isPending}
                        className="w-full h-14 rounded-2xl text-[16px] font-black shadow-lg shadow-blue-900/20 mt-4 bg-[#1e3ba1] border-none"
                    >
                        LƯU & TÍNH TOÁN
                    </Button>
                </Form>
            </Modal>
        </Page>
    );
};

export default TaxInvoicesPage;
