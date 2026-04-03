import React from 'react';
import { Form, Input, Button, Card, Typography, Alert, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginMutation } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTenantResolver } from '../../hooks/useTenantResolver';

const { Title, Text } = Typography;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { tenantConfig, isLoading: tenantLoading } = useTenantResolver();

  const from = location.state?.from?.pathname || '/dashboard';

  const loginMutation = useLoginMutation();

  const onFinish = (values: { email: string; password: string }) => {
    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: (data) => {
          login(data.user, data.accessToken, data.refreshToken);
          navigate(from, { replace: true });
        },
      }
    );
  };

  if (tenantLoading) return null; 
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
      <Card
        style={{ width: '100%', maxWidth: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 8 }}
        styles={{ body: { padding: '32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {tenantConfig?.logo ? (
            <img src={tenantConfig.logo} alt="Logo" style={{ height: 48, marginBottom: 16 }} />
          ) : (
            <div style={{ height: 48, width: 48, background: tenantConfig?.primaryColor || '#1890ff', borderRadius: '50%', margin: '0 auto 16px' }} />
          )}
          <Title level={3} style={{ margin: 0 }}>
            Sign in to {tenantConfig?.brandName || 'SaaS Platform'}
          </Title>
          <Text type="secondary">Welcome back! Please enter your details.</Text>
        </div>

        {loginMutation.error && (
          <Alert
            message="Error"
            description={loginMutation.error.message || 'Invalid credentials. Please try again.'}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          name="login_form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loginMutation.isPending}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};
