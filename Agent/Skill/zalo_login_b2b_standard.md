# Kỹ năng chuẩn: Đăng nhập Zalo trong mô hình B2B (SaaS)

Kỹ năng này hướng dẫn cách triển khai luồng đăng nhập bằng Zalo Native SDK cho các ứng dụng quản lý doanh nghiệp (SaaS) có nhiều chi nhánh/tenant.

---

## 1. Lợi tích & Ý nghĩa
- **Zero-friction**: Người dùng không cần nhớ mật khẩu, chỉ cần "Cho phép" là vào app.
- **Tenant Isolation**: Đăng nhập luôn đi kèm với `tenant_id`, đảm bảo người dùng vào đúng doanh nghiệp họ được cấp quyền.
- **High Security**: Xác thực 2 lớp (Zalo xác thực người dùng, Backend xác thực tư cách nhân viên).

---

## 2. Khi nào sử dụng?
- Khi làm nút "Đăng nhập bằng Zalo" ở màn hình Login.
- Khi người dùng quét mã QR của một chi nhánh/cửa hàng cụ thể để mở app.
- Khi cần định danh nhân viên trong hệ thống quản trị.

---

## 3. Cách Code chuẩn (7 Bước)

### Bước 1: Khai báo Service (`auth.service.ts`)
```typescript
export const authService = {
  loginWithZalo: (zaloToken: string, tenantId: string) => 
    api.post<LoginResponse>('/auth/zalo-login', { zaloToken, tenantId }),
};
```

### Bước 2: Triển khai luồng tại Frontend (React)
```tsx
import { login, getAccessToken } from "zmp-sdk";

const handleLogin = async () => {
  try {
    // 1. Gọi SDK Zalo hiện popup
    await login({});
    
    // 2. Lấy AccessToken của Zalo
    const zaloToken = await getAccessToken();
    
    // 3. Lấy Tenant ID (từ URL param hoặc LocalStorage)
    const tenantId = localStorage.getItem('tenant_id') || 'default';

    // 4. Gọi API Backend để đổi lấy JWT hệ thống
    const res = await authService.loginWithZalo(zaloToken, tenantId);
    
    // 5. Lưu kết quả và chuyển hướng
    setSession(res); 
    navigate('/dashboard');
    
    message.success('Chào mừng bạn quay lại!');
  } catch (error) {
    message.error('Đăng nhập thất bại, vui lòng thử lại.');
  }
};
```

---

## 4. Đặc điểm nhận dạng logic chuẩn B2B
- **Request**: Phải luôn có `zaloToken` đi chung với `tenantId`.
- **Response**: Trả về User Profile kèm theo **Role** của User tại Tenant đó.
- **State**: Token hệ thống nhận về phải được lưu vào `fetcher` để dùng cho các request tiếp theo.

---
*Tài liệu này thuộc sở hữu của Agent Skill - Dự án ZMA Business Management.*
