# Luật của Agent (Mandatory Rules)

Đây là các quy tắc tối thượng mà Agent phải tuân theo khi thực hiện nhiệm vụ trong dự án này.

---

## 1. Luồng xử lý yêu cầu
Mỗi khi nhận được yêu cầu mới từ người dùng, Agent **BẮT BUỘC** thực hiện theo thứ tự:
1.  **Đọc Rules**: Kiểm tra file `Agent/rules/skills_map.md`.
2.  **Khớp Skill**: Nếu yêu cầu khớp với bất kỳ Skill nào trong Map, phải đọc file Skill đó trong `Agent/Skill/` và tuân thủ 100%.
3.  **Xử lý fallback**: Nếu không có Skill nào phù hợp, Agent phải dựa trên **Chuẩn dự án Zalo Mini App** (ZMP SDK, Vite, React) và các nguyên tắc trong `Agent/codebase.md` để triển khai sao cho "chuẩn bài" nhất.

---

## 2. Tiêu chuẩn ZMA Fallback
Nếu chưa có kỹ năng định sẵn, hãy luôn ưu tiên:
- **ZMP SDK**: Sử dụng các hàm native của Zalo thay vì các thư viện web thông thường (nếu có thể).
- **ZMP UI**: Ưu tiên dùng các component của `zmp-ui` để đảm bảo Look & Feel giống Zalo.
- **Perf**: Đảm bảo app nhẹ, load nhanh trên môi trường điện thoại.

---

## 3. Quản lý tri thức
- Khi hoàn thành một tính năng mới mà có tính chất lặp lại, hãy đề xuất tạo một file Skill mới vào `Agent/Skill/` và cập nhật vào `skills_map.md`.

---
*Agent cam kết tuân thủ quy trình này để đảm bảo chất lượng code cao nhất.*
