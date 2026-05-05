import React, { useState } from 'react';
import { useNavigate, Page, Header, Input, Button } from 'zmp-ui';
import { authApi } from '@/api/auth.api';
import { showToast } from 'zmp-sdk';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      showToast({ message: 'Vui lòng nhập email!' });
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      showToast({ message: 'Mã OTP đã được gửi đến email!' });
      navigate('/reset-password', { state: { email } });
    } catch (error: any) {
      showToast({ 
        message: error.message || 'Không tìm thấy email trong hệ thống'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="bg-white">
      <Header title="Quên mật khẩu" showBackIcon={true} className="text-center" onBackClick={() => navigate(-1)} />
      
      <div className="pt-14 px-6 pb-8 flex flex-col items-center">
        <img src="/Logo.png" alt="Vanguard Logo" style={{ width: 120, height: 120, marginBottom: 24, objectFit: 'contain' }} />
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h2>
        <p className="text-gray-500 text-center mb-8">
          Nhập email đăng ký của bạn để nhận mã OTP xác thực.
        </p>

        <div className="w-full space-y-4">
          <Input
            label="Email"
            type="text"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            clearable
          />

          <Button
            fullWidth
            size="large"
            loading={loading}
            onClick={handleSendOTP}
            className="mt-4"
          >
            Gửi mã xác thực
          </Button>

          <button 
            className="w-full text-center text-blue-700 font-medium py-2 mt-4"
            onClick={() => navigate('/login')}
          >
            Quay lại Đăng nhập
          </button>
        </div>
      </div>
    </Page>
  );
};

export default ForgotPasswordPage;
