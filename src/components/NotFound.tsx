import { useNavigate } from 'zmp-ui';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-3 bg-gray-100">
            <h1 className="text-8xl font-bold text-blue-600">404</h1>
            <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Rất tiếc! Trang không tồn tại</h2>
                <p className="mt-2 mb-7 text-gray-600 line-clamp-2">
                    Đường dẫn bạn đang truy cập có thể đã bị xóa hoặc không còn tồn tại
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 shadow-lg"
                >
                    Trang chủ
                </button>
            </div>
        </div>
    );
};

export default NotFound;
