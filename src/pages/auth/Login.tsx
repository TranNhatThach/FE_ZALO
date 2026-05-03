import React, { useState } from 'react';
import { useNavigate } from 'zmp-ui';
import { useLoginMutation, useZaloLoginMutation } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { getUserInfo } from 'zmp-sdk';
import { User } from '@/types/auth.types';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const loginMutation = useLoginMutation();
  const zaloLoginMutation = useZaloLoginMutation();

  // Middleware: Hàm phân luồng Role
  const navigateByRole = (userData: User) => {
    const userRolesRaw = [...(userData.roles || []), userData.roleName || ''];
    const allRoles = userRolesRaw.join(',').toUpperCase();

    console.log("🛠️ Role Detection:", {
      roleName: userData.roleName,
      roles: userData.roles,
      allRoles
    });

    if (allRoles.includes('ADMIN')) {
      navigate('/dashboard', { replace: true });
    } else if (allRoles.includes('STAFF') || allRoles.includes('EMPLOYEE')) {
      navigate('/tasks', { replace: true });
    } else {
      navigate('/user-home', { replace: true });
    }
  };

  const handleLogin = () => {
    // NGƯỢC LẠI: Gọi API thực tế
    const credentials = { username: phone, password };
    /* 
      TẠM THỜI COMMENT API:
      const isEmail = phone.includes('@');
      const credentials = isEmail ? { email: phone, password } : { phone: phone, password };*/
    loginMutation.mutate(credentials, {
      onSuccess: (data) => {
        login(data.user, data.accessToken, data.refreshToken);
        navigateByRole(data.user);
      },
      onError: (error: any) => {
        setErrorMsg(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
      },
    });
  };

  const handleZaloLogin = async () => {
    try {
      // GIẢI PHÁP LẤY ZALO ID TỪ SDK
      // getUserInfo() trả về { userInfo: { id, name, avatar } }
      const { userInfo } = await getUserInfo({});
      const zaloId = userInfo.id;

      /*
      TẠM THỜI COMMENT API ZALO LOGIN:
      // zaloLoginMutation.mutate(
      //   { zaloId: zaloId },
      //   { ... }
      // );
      // */

      // // BYPASS VÀO LUÔN VỚI INFO TỪ ZALO
      // login(
      //   { id: zaloId, email: 'zalo-user@test.com', roles: ['USER'], name: userInfo.name, avatar: userInfo.avatar },
      //   'dummy-zalo-token',
      //   'dummy-refresh-token'
      // );
      // navigate('/dashboard');

      // Gọi API Zalo Login thật
      zaloLoginMutation.mutate(
        {
          zaloId,
          fullName: userInfo.name,
          avatar: userInfo.avatar,
          phone: phone || '' // Lấy từ state nếu có
        },
        {
          onSuccess: (data) => {
            login(data.user, data.accessToken, data.refreshToken);
            navigateByRole(data.user);
          },
          onError: (error: any) => {
            alert(error.message || 'Đăng nhập Zalo thất bại.');
          }
        }
      );
    } catch (error) {
      console.error(error);
      alert('Không thể liên kết với Zalo Mini App. Hãy thử mở lại app nhé.');
    }
  };

  return (
    <>
      {/* CẬP NHẬT: Thêm thẻ style để ẩn thanh cuộn trên mọi trình duyệt */}
      <style>
        {`
          /* Ẩn thanh cuộn trên toàn bộ trang (html, body, root) và container */
          ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
          }
          * {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          html, body, #root {
            overflow: hidden !important;
          }
        `}
      </style>

      <div className="flex flex-col h-screen w-full bg-white relative max-w-[390px] mx-auto overflow-y-auto hide-scrollbar">

        <div className="flex flex-col items-center w-full px-5 pt-14 pb-8 bg-white shrink-0">
          <h1 className="text-[22px] font-semibold text-gray-900">Đăng nhập</h1>
          <img
            src="/Logo.png"
            alt="Vanguard Logo"
            className="w-[120px] h-[120px] object-contain mb-5 shrink-0"
          />

          <h2 className="text-[22px] font-bold text-gray-900 mb-1.5 text-center shrink-0">
            VANGUARD ENTERPRISE
          </h2>
          <p className="text-[15px] text-gray-500 text-center mb-8 shrink-0">
            Đăng nhập để sử dụng tiếp ứng dụng
          </p>

          {/* FORM NHẬP SỐ ĐIỆN THOẠI / EMAIL */}
          <div className="w-full mb-5 shrink-0">
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              Số điện thoại/Email <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center w-full h-[52px] border border-gray-300 rounded-[12px] px-3.5 focus-within:border-[#1E40AF] focus-within:ring-1 focus-within:ring-[#1E40AF] transition-colors bg-white overflow-hidden">

              <img src="/icons/user.svg" alt="user" className="w-5 h-5 mr-2.5 brightness-0" />

              <input
                type="text"
                placeholder="Email hoặc số điện thoại"
                className="flex-1 bg-transparent border-none outline-none text-[16px] text-gray-900 placeholder-gray-400 w-full"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />

              {phone.length > 0 && (
                <button onClick={() => setPhone('')} className="p-1 outline-none">
                  <img src="/icons/close-circle.svg" alt="clear" className="w-5 h-5 opacity-40" />
                </button>
              )}
            </div>
          </div>

          {/* FORM NHẬP MẬT KHẨU */}
          <div className="w-full mb-8 shrink-0">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[14px] font-medium text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <button
                className="text-[14px] font-medium text-[#00288E] hover:underline active:opacity-70 outline-none bg-transparent p-0"
                onClick={() => navigate('/forgot-password')}
              >
                Quên mật khẩu?
              </button>
            </div>

            <div className={`flex items-center w-full h-[52px] border rounded-[12px] px-3.5 focus-within:ring-1 transition-colors bg-white overflow-hidden ${errorMsg ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500' : 'border-gray-300 focus-within:border-[#1E40AF] focus-within:ring-[#1E40AF]'}`}>

              <img src="/icons/lock.svg" alt="password-security-icon" className="w-5 h-5 mr-2.5 brightness-0" />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                className="flex-1 bg-transparent border-none outline-none text-[16px] text-gray-900 placeholder-gray-400 w-full"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />

              <button onClick={() => setShowPassword(!showPassword)} className="p-1 ml-2 outline-none">
                <img
                  src={showPassword ? "/icons/eye.svg" : "/icons/eye-slash.svg"}
                  alt="toggle password"
                  className="w-5 h-5 opacity-50 hover:opacity-80 transition-opacity"
                />
              </button>
            </div>
            {errorMsg && <p className="text-red-500 text-[12px] mt-1.5 ml-1 font-medium italic animate-pulse">⚠️ {errorMsg}</p>}
          </div>

          {/* NÚT ĐĂNG NHẬP */}
          <button
            onClick={handleLogin}
            disabled={phone.length < 5 || password.length < 3}
            className={`w-full h-[52px] rounded-[12px] font-semibold text-[16px] flex items-center justify-center transition-all shrink-0 outline-none ${phone.length >= 5 && password.length >= 3
              ? 'bg-[#1E40AF] text-white shadow-md active:bg-[#00288E]'
              : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              }`}
          >
            Đăng nhập
          </button>

          {/* KHỐI NGĂN CÁCH */}
          <div className="flex items-center justify-center w-full py-5 shrink-0">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="px-4 text-[13px] font-medium text-gray-500 whitespace-nowrap">Hoặc</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* ĐĂNG NHẬP BẰNG ZALO */}
          <button
            onClick={handleZaloLogin}
            disabled={zaloLoginMutation.isPending}
            className={`w-full h-[52px] rounded-[12px] font-semibold text-[16px] flex items-center justify-center gap-3 text-white shadow-sm transition-all shrink-0 outline-none ${zaloLoginMutation.isPending ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#0068FF] active:bg-[#0054cc]'
              }`}
          >
            <div className="flex items-center justify-center bg-white rounded-full p-2 aspect-square h-[34px]">
              <span className="text-[#0068FF] font-bold text-[13px] leading-none">Zalo</span>
            </div>
            <span>{zaloLoginMutation.isPending ? 'Đang xử lý...' : 'Đăng nhập bằng Zalo'}</span>
          </button>

          {/* LIÊN KẾT HỖ TRỢ (Tùy chọn) */}
          <div className="mt-8 flex items-center justify-center gap-1 text-[13px] text-gray-400 shrink-0">
            <span>© 2026 VANGUARD ENTERPRISE SOLUTIONS</span>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-auto w-full bg-[#F4F5F7] h-[153px] flex flex-col justify-between px-5 pt-6 pb-8 shrink-0">

          <div className="flex items-center justify-between w-full">
            <button className="flex items-center justify-center gap-1.5 w-[104px] h-[52px] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-[20px] shadow-sm border border-gray-200/60 cursor-pointer outline-none">
              <img src="/icons/headphone.svg" alt="support" className="w-[18px] h-[18px] opacity-70" />
              <span className="text-[14px] font-medium text-gray-700">Hỗ trợ</span>
            </button>

            <button className="flex items-center justify-center gap-1.5 w-[122px] h-[52px] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-[20px] shadow-sm border border-gray-200/60 cursor-pointer outline-none">
              <img src="/icons/ui.svg" alt="lang" className="w-[18px] h-[18px] opacity-70" />
              <span className="text-[14px] font-medium text-gray-700">Tiếng Việt</span>
              <img src="/icons/chevron-down.svg" alt="down" className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="text-center text-[12px] font-normal text-[#9CA3AF] leading-[16px]">
            © 2026 VANGUARD ENTERPRISE SOLUTIONS
          </div>

        </div>

      </div>
    </>
  );
};

export default LoginPage;