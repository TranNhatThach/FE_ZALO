export const formatDateUTC7 = (date?: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    if (!date) return '';

    return new Date(date).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        ...options,
    });
};
