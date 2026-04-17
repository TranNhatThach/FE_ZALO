import React, { useState } from 'react';
import { Table, Card, Tag, Input, Select, Button, Space, DatePicker, Avatar, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  DownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useThemeStore } from '../../stores/theme.store';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface AttendanceRecord {
  id: string;
  employeeName: string;
  avatar: string;
  date: string;
  checkIn: string;
  checkOut: string;
  branch: string;
  status: 'ON_TIME' | 'LATE' | 'ABSENT';
  hoursWorked: number;
}

// Mock Data
const mockData: AttendanceRecord[] = [
  {
    id: '1',
    employeeName: 'Nguyễn Văn A',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=A',
    date: '2026-04-17',
    checkIn: '08:00 AM',
    checkOut: '05:00 PM',
    branch: 'Chi nhánh Quận 1',
    status: 'ON_TIME',
    hoursWorked: 8,
  },
  {
    id: '2',
    employeeName: 'Trần Thị B',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=B',
    date: '2026-04-17',
    checkIn: '08:30 AM',
    checkOut: '05:00 PM',
    branch: 'Chi nhánh Quận 3',
    status: 'LATE',
    hoursWorked: 7.5,
  },
  {
    id: '3',
    employeeName: 'Lê Văn C',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=C',
    date: '2026-04-17',
    checkIn: '-',
    checkOut: '-',
    branch: 'Chi nhánh Thủ Đức',
    status: 'ABSENT',
    hoursWorked: 0,
  },
  {
    id: '4',
    employeeName: 'Phạm Thị D',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=D',
    date: '2026-04-16',
    checkIn: '07:55 AM',
    checkOut: '06:00 PM',
    branch: 'Chi nhánh Quận 1',
    status: 'ON_TIME',
    hoursWorked: 9,
  },
];

const getStatusTag = (status: string) => {
  switch (status) {
    case 'ON_TIME':
      return <Tag icon={<CheckCircleOutlined />} color="success" className="rounded-full px-3 py-1 font-semibold shadow-sm">Đúng giờ</Tag>;
    case 'LATE':
      return <Tag icon={<ClockCircleOutlined />} color="warning" className="rounded-full px-3 py-1 font-semibold shadow-sm">Đi trễ</Tag>;
    case 'ABSENT':
      return <Tag icon={<CloseCircleOutlined />} color="error" className="rounded-full px-3 py-1 font-semibold shadow-sm">Vắng mặt</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const AttendancePage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredData = mockData.filter((item) => {
    const matchName = item.employeeName.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchName && matchStatus;
  });

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (text: string, record: AttendanceRecord) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size="large" className="border border-gray-200 shadow-sm" />
          <span className="font-bold text-[15px]">{text}</span>
        </div>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => <span className="font-medium">{dayjs(text).format('DD/MM/YYYY')}</span>,
    },
    {
      title: 'Giờ vào',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (text: string) => (
        <span className={`font-semibold ${text !== '-' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Giờ ra',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (text: string) => (
        <span className={`font-semibold ${text !== '-' ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400'}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Số giờ làm',
      dataIndex: 'hoursWorked',
      key: 'hoursWorked',
      render: (val: number) => (
        <span className="font-bold text-blue-600 dark:text-blue-400">{val}h</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      key: 'branch',
      render: (text: string) => <Tag color="blue" variant="outlined">{text}</Tag>,
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 md:flex justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight mb-2">
            Danh sách Chấm công
          </h1>
          <p className="text-gray-500 font-medium">
            Quản lý và theo dõi thời gian làm việc của nhân sự
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            className="rounded-xl font-semibold shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 border-none hover:from-blue-600 hover:to-indigo-600"
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      <Card 
        className={`rounded-2xl border-none shadow-xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e20]' : 'bg-white'}`}
        styles={{ body: { padding: 0 } }}
      >
        {/* Filters */}
        <div className={`p-5 border-b ${isDarkMode ? 'border-gray-800 bg-[#252528]' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Tìm kiếm nhân viên..." 
              prefix={<SearchOutlined className="text-gray-400" />}
              className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500 h-11"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            
            <RangePicker 
              className="rounded-xl h-11"
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />

            <Select 
              value={statusFilter} 
              onChange={setStatusFilter}
              className="h-11 min-w-[150px]" 
              popupClassName="rounded-xl"
            >
              <Option value="ALL"><FilterOutlined className="mr-2"/> Tất cả trạng thái</Option>
              <Option value="ON_TIME"><CheckCircleOutlined className="mr-2 text-green-500"/> Đúng giờ</Option>
              <Option value="LATE"><ClockCircleOutlined className="mr-2 text-warning"/> Đi trễ</Option>
              <Option value="ABSENT"><CloseCircleOutlined className="mr-2 text-red-500"/> Vắng mặt</Option>
            </Select>
          </div>
        </div>

        {/* List */}
        <div className="p-2">
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              className: 'px-4'
            }}
            scroll={{ x: 800 }}
            className="attendance-table"
            rowClassName={(record, index) => `
              hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200
              ${index % 2 === 0 ? '' : (isDarkMode ? 'bg-[#1a1a1c]/50' : 'bg-gray-50/30')}
            `}
          />
        </div>
      </Card>
      
      <style>{`
        .attendance-table .ant-table-thead > tr > th {
          background: transparent !important;
          border-bottom: 2px solid ${isDarkMode ? '#374151' : '#f3f4f6'};
          font-weight: 700;
          color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
        }
        .attendance-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${isDarkMode ? '#374151' : '#f3f4f6'};
          padding: 16px;
        }
      `}</style>
    </div>
  );
};

export default AttendancePage;
