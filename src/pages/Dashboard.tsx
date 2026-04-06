import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { useAuthStore } from '@/stores/auth.store';
import { UserOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <Title level={2} className="dark:text-white">Welcome, {user?.name || user?.email}!</Title>
      <Paragraph className="dark:text-gray-400">
        This is an example dashboard in the protected route.
      </Paragraph>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="dark:bg-[#141414] dark:border-gray-800 transition-colors">
            <Statistic
              title="Active Users"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="dark:bg-[#141414] dark:border-gray-800 transition-colors">
            <Statistic
              title="Conversion Rate"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
