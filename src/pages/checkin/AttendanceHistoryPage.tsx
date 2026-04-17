import React, { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { checkinApi } from '@/api/checkin.api';
import { Spin, DatePicker, Typography, Card, Tag, Empty } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

export const AttendanceHistoryPage: React.FC = () => {
    const { isDarkMode } = useThemeStore();
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

    const fetchHistory = async (month: number, year: number) => {
        try {
            setLoading(true);
            const res = await checkinApi.getHistoryByMonth(month, year);
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

    const getStatusColor = (status: string) => {
        if (status === 'ON_TIME') return 'green';
        if (status === 'LATE') return 'orange';
        return 'red';
    };

    return (
        <div className={`p-4 min-h-screen ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Title level={4} className={isDarkMode ? '!text-white' : ''}>Lịch sử chấm công cá nhân</Title>
            <div className="mb-4">
                <DatePicker 
                    picker="month" 
                    value={selectedDate} 
                    onChange={(date) => date && setSelectedDate(date)} 
                    className="w-full"
                />
            </div>
            
            {loading ? (
                <div className="flex justify-center my-10"><Spin /></div>
            ) : history.length === 0 ? (
                <Empty description="Không có dữ liệu tháng này" />
            ) : (
                <div className="flex flex-col gap-3">
                    {history.map((record) => (
                        <Card key={record.id} size="small" className={`shadow-sm ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800 text-gray-200' : ''}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold">
                                        {dayjs(record.checkTime).format('DD/MM/YYYY')}
                                    </div>
                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Giờ check-in: {dayjs(record.checkTime).format('HH:mm')}
                                    </div>
                                    {record.note && (
                                        <div className="text-xs mt-1 text-gray-400 italic">
                                            Ghi chú: {record.note}
                                        </div>
                                    )}
                                </div>
                                <Tag color={getStatusColor(record.status)}>
                                    {record.status}
                                </Tag>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AttendanceHistoryPage;
