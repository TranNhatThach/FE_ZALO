import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="500"
        title="500"
        subTitle="Xin lỗi, có lỗi xảy ra từ máy chủ."
        extra={<Button type="primary" onClick={() => navigate('/')}>Quay lại Trang chủ</Button>}
      />
    </div>
  );
};
