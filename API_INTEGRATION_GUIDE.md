# Hướng dẫn Chuẩn hóa Ghép API (API Integration Standard)

Tài liệu này quy định cách thức kết nối và xử lý dữ liệu từ Backend (API) vào Frontend trong dự án. Chúng ta tuân thủ kiến trúc **3 lớp (3-Layer Architecture)** để đảm bảo code sạch, dễ bảo trì và tái sử dụng.

---

## 1. Kiến trúc 3 Lớp

### Lớp 1: Fetcher (`src/api/fetcher.ts`)
Đây là lớp thấp nhất, bao đóng (wrapper) hàm `fetch` mặc định của trình duyệt.
- **Nhiệm vụ**: 
    - Tự động gắn `Authorization: Bearer <token>`.
    - Tự động gắn `X-Tenant-Id`.
    - Xử lý lỗi tập trung (401, 403, 500...).
    - **Quan trọng**: Tự động gọi API `/auth/refresh` khi token hết hạn (401) và thực hiện lại các request đang chờ.
    - Chuẩn hóa dữ liệu trả về (trả về trực tiếp `json.data` nếu có).

### Lớp 2: Service (`src/services/*.service.ts`)
Mỗi module (User, Order, Branch...) sẽ có một file service riêng.
- **Nhiệm vụ**: Định nghĩa các endpoint và kiểu dữ liệu trả về. Không chứa logic xử lý giao diện.
- **Ví dụ (`user.service.ts`)**:
```typescript
export const userService = {
  getAll: () => api.get<User[]>('/users'),
  create: (data: Partial<User>) => api.post<User>('/users', data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
};
```

### Lớp 3: Component (`src/components/` hoặc `src/pages/`)
Đây là nơi gọi Service để lấy dữ liệu hiển thị lên màn hình.
- **Nhiệm vụ**: Quản lý trạng thái `loading`, `error` và hiển thị kết quả.

---

## 2. Cách ghép API chuẩn (Step-by-Step)

### Bước 1: Định nghĩa Type
Luôn định nghĩa Interface cho dữ liệu trong `src/types/`.
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  // ...
}
```

### Bước 2: Tạo Service
```typescript
import { api } from '../api/fetcher';
import { User } from '../types/user.types';

export const userService = {
  getUsers: () => api.get<User[]>('/users'),
};
```

### Bước 3: Sử dụng trong Component (Async/Await)
```tsx
const [loading, setLoading] = useState(false);

const fetchData = async () => {
    try {
        setLoading(true);
        const data = await userService.getUsers();
        setUsers(data);
    } catch (error: any) {
        message.error(error.message || 'Lấy dữ liệu thất bại');
    } finally {
        setLoading(false);
    }
};
```

---

## 3. Các lưu ý quan trọng (Best Practices)

1. **Không gọi API trực tiếp từ Component**: Luôn đi qua Service.
2. **Xử lý Loading**: Luôn có biến `loading` để chặn người dùng thao tác thừa (disable button, show spinner).
3. **Thông báo người dùng**: Sử dụng `antd.message` để thông báo thành công/thất bại sau khi gọi API (POST/PUT/DELETE).
4. **Kiểu dữ liệu (Typescript)**: Luôn khai báo Generic `<T>` cho các hàm của `api` để có gợi ý code (Intellisense) tốt nhất.
5. **Path Alias**: Sử dụng `@/` để import (VD: `@/services/user.service`) giúp đường dẫn ngắn gọn và không bị lỗi khi di chuyển file.

---

*Tài liệu này là quy chuẩn bắt buộc cho mọi module mới được thêm vào dự án.*
Hiểu đơn giản, Fetcher chính là "Người trung chuyển" (hay người gác cổng) giữa ứng dụng của bạn và Server.

Nếu bạn gọi API bằng cách thông thường (dùng fetch mặc định), bạn sẽ phải tự viết lại các đoạn code như: gắn Token, kiểm tra lỗi, xử lý đa chi nhánh... ở hàng trăm chỗ khác nhau. Fetcher sinh ra để làm tất cả những việc đó một cách tự động.

Dựa trên file src/api/fetcher.ts trong dự án của bạn, đây là 4 chức năng "quyền lực" nhất của Fetcher:

1. Tự động "Nhận diện" (Authentication)
Bạn chỉ cần đăng nhập 1 lần. Mọi request sau đó, Fetcher sẽ tự động móc zma_access_token từ bộ nhớ ra và gắn vào header:

typescript
// Fetcher làm hộ bạn:
Authorization: Bearer <token_của_bạn>
2. Xử lý "Đa chi nhánh" (Multi-tenancy)
Fetcher tự động gắn X-Tenant-Id. Điều này cực kỳ quan trọng trong app quản lý doanh nghiệp, giúp Server biết bạn đang thao tác trên chi nhánh nào (Branch) mà không cần bạn phải truyền tay thủ công.

3. "Hồi sinh" Token bị chết (Silent Refresh) — Quan trọng nhất 🛡️
Đây là logic phức tạp nhất trong file fetcher.ts của bạn:

Nếu API trả về lỗi 401 (Token hết hạn), Fetcher sẽ không báo lỗi ngay cho người dùng.
Nó sẽ tạm dừng request đó lại, âm thầm gọi API /auth/refresh để xin Token mới.
Sau khi có Token mới, nó tự động thực hiện lại các request cũ.
Kết quả: Người dùng dùng app mượt mà, không bao giờ bị văng ra ngoài bắt đăng nhập lại giữa chừng.
4. Làm sạch dữ liệu (Normalization)
Thay vì bạn phải viết res.json().then(data => data.data.users), Fetcher của bạn đã được cấu hình để:

Tự động parse JSON.
Tự động bóc lớp vỏ data bên ngoài. Bạn gọi api.get('/users') là nhận ngay mảng users luôn.
Tóm lại:

Fetcher giúp bạn viết code ở tầng UI cực kỳ ngắn gọn. Bạn chỉ việc nói "Tôi muốn lấy danh sách User", còn việc mang Token đi, kiểm tra Tenant, hay xin lại Token mới... đều do Fetcher lo hết.