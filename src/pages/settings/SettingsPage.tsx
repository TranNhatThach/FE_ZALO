import React, { useEffect, useState } from 'react';
import { Typography, Card, Form, Input, Button, Upload, ColorPicker, message, Row, Col, Space } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useTenantResolver } from '../../hooks/useTenantResolver';
import { tenantApi } from '../../api/tenant.api';

const { Title, Paragraph } = Typography;

const SettingsPage: React.FC = () => {
  const { tenantId, tenantConfig, isLoading } = useTenantResolver();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (tenantConfig) {
      form.setFieldsValue({
        brandName: tenantConfig.brandName,
        website: tenantConfig.website,
        primaryColor: tenantConfig.primaryColor,
      });
      setLogoUrl(tenantConfig.logo);
    }
  }, [tenantConfig, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // In a real app, you might upload the logo first.
      // Here we assume the logo URL is already set or handled separately.
      const updatedConfig = {
        ...values,
        logo: logoUrl,
        primaryColor: typeof values.primaryColor === 'string' ? values.primaryColor : values.primaryColor.toHexString(),
      };
      
      await tenantApi.updateConfig(tenantId, updatedConfig);
      message.success('Configuration updated successfully! The theme will refresh.');
    } catch (error) {
      console.error('Update config error:', error);
      message.error('Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (info: any) => {
    if (info.file.status === 'done') {
      // Mock upload success
      const url = URL.createObjectURL(info.file.originFileObj);
      setLogoUrl(url);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Title level={2}>System Configuration</Title>
      <Paragraph>Manage your business branding and global settings here.</Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
            primaryColor: '#1890ff'
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Card title="Business Information" bordered={false} className="shadow-sm">
              <Form.Item
                name="brandName"
                label="Business Name"
                rules={[{ required: true, message: 'Please enter your business name' }]}
              >
                <Input placeholder="e.g. My Business" />
              </Form.Item>

              <Form.Item name="website" label="Website URL">
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="Branding" bordered={false} className="shadow-sm">
              <Form.Item label="Logo">
                <div className="flex flex-col items-center space-y-4">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-24 h-24 object-contain border rounded" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center border rounded text-gray-400">
                      No Logo
                    </div>
                  )}
                  <Upload
                    name="logo"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" // Mock API
                    onChange={handleLogoChange}
                  >
                    <Button icon={<UploadOutlined />}>Change Logo</Button>
                  </Upload>
                </div>
              </Form.Item>

              <Form.Item name="primaryColor" label="Primary Color">
                <ColorPicker showText />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <div className="flex justify-end mt-6">
          <Button type="primary" size="large" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
            Save Configuration
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SettingsPage;
