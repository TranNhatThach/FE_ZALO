import React, { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { checkinApi } from '@/api/checkin.api';
import { Typography, Spin, DatePicker, Table, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ExportUtility } from '@/services/exportService';

const { Title } = Typography;

export const UserAttendanceAdminPage: React.FC = () => {
    const { isDarkMode } = useThemeStore();
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

    const fetchHistory = async (month: number, year: number) => {
        try {
            setLoading(true);
            const res = await checkinApi.getTenantHistoryByMonth(month, year);
            if (res && res.data) {
                setHistory(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(selectedDate.month() + 1, selectedDate.year());
    }, [selectedDate]);

    const handleExport = () => {
        const exportData = history.map(item => ({
            ...item,
            employeeName: item.user?.fullName || item.user?.username,
            employeeEmail: item.user?.email,
        }));
        
        ExportUtility.exportExcel(exportData, [
            { header: "Mã NV", dataKey: "user.id" },
            { header: "Tên nhân viên", dataKey: "employeeName" },
            { header: "Email", dataKey: "employeeEmail" },
            { header: "Thời gian", dataKey: "checkTime", type: "date" },
            { header: "Trạng thái", dataKey: "status" },
            { header: "Ghi chú", dataKey: "note" }
        ], 'BaoCaoChamCong');
    };

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: ['user', 'fullName'],
            key: 'fullName',
            render: (text: string, record: any) => text || record.user?.username || 'Mất kết nối mã NV',
        },
        {
            title: 'Thời gian',
            dataIndex: 'checkTime',
            key: 'checkTime',
            render: (time: string) => dayjs(time).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        }
    ];

    return (
        <div className={`p-4 min-h-screen ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="flex justify-between items-center mb-4">
                <Title level={4} className={isDarkMode ? '!text-white m-0' : 'm-0'}>Quản trị chấm công</Title>
            </div>
            
            <div className="flex justify-between items-center mb-4 gap-2">
                <DatePicker 
                    picker="month" 
                    value={selectedDate} 
                    onChange={(date) => date && setSelectedDate(date)} 
                    className="flex-1"
                />
                <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    onClick={handleExport}
                    disabled={history.length === 0}
                >
                    Xuất Báo Cáo
                </Button>
            </div>
            
            {loading ? (
                <div className="flex justify-center my-10"><Spin /></div>
            ) : (
                <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'border border-gray-800' : 'border border-gray-200'}`}>
                    <Table 
                        dataSource={history} 
                        columns={columns} 
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                    />
                </div>
            )}
        </div>
    );
};

export default UserAttendanceAdminPage;
