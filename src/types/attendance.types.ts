export interface Attendance {
    id: number;
    userId: number;
    checkInTime: string;
    photoUrl: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    latitude?: number;
    longitude?: number;
}

export interface RegisterFaceResponse {
    message: string;
    data: string;
}
