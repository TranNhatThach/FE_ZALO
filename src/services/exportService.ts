import * as xlsx from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';

// Khai báo cấu trúc các cột muốn xuất ra file
interface ExportColumn {
  header: string;  // Tên cột trên file Excel (VD: "Tổng tiền")
  dataKey: string; // Tên biến trong dữ liệu API (VD: "amount")
  type?: 'currency' | 'date' | 'text'; // Loại dữ liệu để trang điểm lại cho đẹp
}

// HÀM TRANG ĐIỂM (Format)
const formatData = (value: any, type?: string) => {
  if (value === null || value === undefined) return ''; // Bỏ qua nếu dữ liệu trống
  
  if (type === 'currency') {
    // Biến 1000000 thành "1.000.000 ₫"
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
  
  if (type === 'date') {
    // Biến ngày giờ máy tính thành ngày giờ người đọc
    return dayjs(value).format('DD/MM/YYYY HH:mm');
  }
  return value; // Kiểu text thì để nguyên
};

export const ExportUtility = {
  // === HÀM XUẤT EXCEL ===
  exportExcel: (data: any[], columns: ExportColumn[], fileName: string) => {
    // 1. Quét qua dữ liệu thô, trang điểm lại dựa vào mảng 'columns'
    const formattedData = data.map((item) => {
      const row: Record<string, any> = {};
      columns.forEach((col) => {
        row[col.header] = formatData(item[col.dataKey], col.type);
      });
      return row; // Trả ra 1 hàng dữ liệu đã sạch đẹp
    });

    // 2. Chuyển cục dữ liệu đó thành 1 Sheet (Trang tính Excel)
    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    
    // 3. Tạo 1 quyển sách Excel mới (Workbook)
    const workbook = xlsx.utils.book_new();
    
    // 4. Nhét trang tính vào quyển sách
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
    
    // 5. Ra lệnh tải xuống máy tính với tên file kẹp thêm ngày tháng hiện tại
    xlsx.writeFile(workbook, `${fileName}_${dayjs().format('YYYYMMDD')}.xlsx`);
  },

  // === HÀM XUẤT PDF ===
  exportPDF: (data: any[], columns: ExportColumn[], fileName: string, title: string) => {
    // 1. Tạo 1 tờ giấy A4 PDF mới
    const doc = new jsPDF();
    
    // 2. In cái Tiêu đề (VD: "BÁO CÁO HÓA ĐƠN") ở góc trên tờ giấy
    doc.text(title, 14, 15);

    // 3. Chuẩn bị dòng tiêu đề cột
    const tableColumn = columns.map(col => col.header);
    
    // 4. Chuẩn bị từng hàng dữ liệu (đã trang điểm)
    const tableRows = data.map(item => 
      columns.map(col => formatData(item[col.dataKey], col.type))
    );

    // 5. Gọi thư viện autotable vẽ cái bảng vào tờ giấy PDF
    (doc as any).autoTable({
      head: [tableColumn], // Phần đầu bảng
      body: tableRows,     // Thân bảng
      startY: 20,          // Bắt đầu vẽ từ tọa độ Y = 20mm trở xuống (chừa chỗ cho tiêu đề)
    });

    // 6. Ra lệnh tải xuống
    doc.save(`${fileName}_${dayjs().format('YYYYMMDD')}.pdf`);
  }
};