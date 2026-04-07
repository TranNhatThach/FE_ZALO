# Kỹ năng chuẩn: Quản lý State & Data Fetching với React Query

React Query (TanStack Query) là thư viện quản lý trạng thái server (server-state) cực kỳ mạnh mẽ, giúp đồng bộ dữ liệu giữa Backend và Frontend một cách tự động và tối ưu.

---

## 1. Lợi ích mang lại
- **Tự động hóa Loading/Error**: Không cần tạo `useState` cho loading và error thủ công.
- **Caching**: Dữ liệu được lưu vào bộ nhớ đệm, giúp chuyển trang cực nhanh mà không cần gọi lại API.
- **Auto Re-fetching**: Tự động tải lại dữ liệu khi quay lại tab (window focus) hoặc khi kết nối mạng được khôi phục.
- **Synchronization**: Dễ dàng đồng bộ dữ liệu (Invalidate) sau khi Thêm/Sửa/Xóa.
- **Code Clean**: Giảm khoảng 50% code boilerplate so với dùng `useEffect`.

---

## 2. Áp dụng khi nào?
- Cho tất cả các chức năng có gọi API lấy dữ liệu (Read).
- Cho các hành động thay đổi dữ liệu (Create, Update, Delete) cần cập nhật lại giao diện ngay lập tức.
- Khi cần quản lý logic phân trang (Pagination), tìm kiếm (Search), lọc (Filter).

---

## 3. Cách code 1 chức năng chuẩn (Ví dụ: Danh sách User)

### Bước 1: Fetch dữ liệu với `useQuery`
Thay vì `useEffect`, ta dùng `useQuery` với một `queryKey` duy nhất.
```tsx
const { data: users = [], isLoading } = useQuery({
  queryKey: ['users'], 
  queryFn: () => userService.getAll(),
  // Có thể dùng select để thực hiện lọc dữ liệu ngay tại đây
  select: (data) => data.filter(u => u.status === 'ACTIVE') 
});
```

### Bước 2: Thực hiện hành động với `useMutation`
Sử dụng cho các thao tác Thay đổi dữ liệu (POST, PUT, DELETE).
```tsx
const queryClient = useQueryClient();

const deleteMutation = useMutation({
  mutationFn: (id: string) => userService.delete(id),
  onSuccess: () => {
    // Quan trọng: Làm mới dữ liệu sau khi xóa thành công
    queryClient.invalidateQueries({ queryKey: ['users'] });
    message.success('Xóa thành công!');
  }
});
```

### Bước 3: Render giao diện
Sử dụng các biến `isLoading` từ query để hiển thị skeleton hoặc spinner.
```tsx
<BaseTable 
  data={users} 
  isLoading={isLoading} 
  // ...
/>
```

---

## 4. Các lưu ý "Sống còn"
1. **Query Key**: Phải là duy nhất cho mỗi loại dữ liệu. Nếu fetch theo ID, key phải là `['users', id]`.
2. **Invalidate Queries**: Sau mỗi lệnh `mutate` thành công, luôn phải gọi `invalidateQueries` để Frontend luôn khớp với Backend.
3. **Stale Time**: Cấu hình `staleTime` nếu dữ liệu ít thay đổi để tiết kiệm băng thông API.

---
*Tài liệu này thuộc sở hữu của Agent Skill - Dự án ZMA Business Management.*
