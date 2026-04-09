# Tổng quan Công nghệ & Mục tiêu Codebase (ZMA Business Management)
MỤC TIÊU DỰ ÁN: Xây dựng ứng dụng quản lý doanh nghiệp trên nền tảng Zalo Mini App.
Dự án này được xây dựng trên một bộ khung (Tech Stack) hiện đại, tập trung vào hiệu năng (Performance) và khả năng mở rộng (Scalability).

---

## 1. Tổng quan Công nghệ (Tech Stack)

### Core Framework & Build Tool
- **React (v18+)**: UI library chính.
- **Vite**: Build tool cực nhanh, tối ưu cho môi trường phát triển (HMR).
- **Typescript**: Đảm bảo an toàn kiểu dữ liệu (Type-safe), giảm thiểu lỗi runtime.

### Giao diện & Trải nghiệm người dùng (UI/UX)
- **ZMP SDK & UI**: Tích hợp chặt chẽ với hệ sinh thái Zalo Mini App.
- **Ant Design (antd)**: Hệ thống Component vững chắc cho các chức năng quản trị dữ liệu (Form, Table, Modal).
- **Tailwind CSS**: Dùng cho thiết kế Layout linh hoạt, micro-animations và các UI tùy chỉnh cao cấp.

### Quản lý Dữ liệu & State
- **TanStack Query (React Query)**: "Xương sống" của data fetching. Quản lý caching, loading states và đồng bộ server-state tự động.
- **Zustand / Jotai**: Quản lý Global State (Session, User Auth, Theme).
- **Fetcher (Custom wrapper)**: Tự động hóa quá trình xác thực, Multi-tenant và Silent Refresh Token.

---

## 2. Mục tiêu Codebase (Codebase Objectives)

1. **Chuẩn hóa API (API Standardization)**: 
    - Tuyệt đối không gọi API trực tiếp trong UI.
    - Phải thông qua lớp Service và lớp Fetcher quản lý tập trung.
    - Tận dụng sức mạnh của React Query (useQuery, useMutation).

2. **Khả năng mở rộng (Maintainability)**:
    - Code theo hướng Component-driven. Mỗi chức năng nhỏ nên được tách module độc lập.
    - Sử dụng Path Alias (`@/`) để dễ dàng di chuyển cấu trúc folder mà không hỏng import.

3. **Bảo mật & Hiệu năng (Security & Performance)**:
    - Token được quản lý an toàn, tự động làm mới (Auto-refresh) để không gián đoạn trải nghiệm người dùng.
    - Caching mạnh mẽ để giảm tải cho Backend và tăng tốc độ chuyển trang UI.

4. **Trải nghiệm Premium (Stunning Impression)**: 
    - Mọi màn hình phải có loading skeleton/shimmer mượt mà.
    - Đảm bảo tính nhất quán (Consistency) giữa các module.

---
*Tài liệu này là "Ngọn hải đăng" dẫn đường cho mọi đợt nâng cấp code sau này.*
