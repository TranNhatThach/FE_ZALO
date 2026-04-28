import React, { useState, useEffect } from 'react';
import { useNavigate, Page, Header, Input, Button } from 'zmp-ui';
import { useLocation } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { showToast } from 'zmp-sdk';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleReset = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      showToast({ message: 'Vui lòng nhập đầy đủ thông tin!' });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({ message: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        email,
        otp,
        newPassword,
        confirmPassword
      });
      showToast({ message: 'Đặt lại mật khẩu thành công!' });
      navigate('/login');
    } catch (error: any) {
      showToast({ 
        message: error.message || 'Mã OTP không chính xác hoặc đã hết hạn'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="bg-white">
      <Header title="Đặt lại mật khẩu" showBackIcon={false} className="text-center" onBackClick={() => navigate(-1)} />
      
      <div className="pt-14 px-6 pb-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thiết lập mật khẩu mới</h2>
          <p className="text-gray-500 text-center">
            Mã OTP đã được gửi đến <span className="font-semibold text-gray-900">{email}</span>
          </p>
        </div>

        <div className="space-y-5">
          <Input
            label="Email"
            type="text"
            value={email}
            disabled
          />

          <Input
            label="Mã OTP (6 chữ số)"
            placeholder="Nhập mã OTP từ email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            clearable
          />

          <Input.Password
            label="Mật khẩu mới"
            placeholder="Tối thiểu 6 ký tự"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            clearable
          />

          <Input.Password
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            clearable
          />

          <div className="pt-4">
            <Button
              fullWidth
              size="large"
              loading={loading}
              onClick={handleReset}
            >
              Xác nhận thay đổi
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ResetPasswordPage;
