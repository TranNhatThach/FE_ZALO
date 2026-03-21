// Response chung từ Backend
export interface ApiResponse<T> {
    success: boolean; // trạng thái API
    message?: string; // thông báo
    data: T; // dữ liệu chính
    error?: string; // lỗi nếu có
}

// Response phân trang
export interface PageResponse<T> {
    content: T[]; // danh sách dữ liệu
    page: number; // trang hiện tại
    size: number; // số item / trang
    totalElements: number; // tổng số bản ghi
    totalPages: number; // tổng số trang
    last: boolean; // có phải trang cuối không
}
