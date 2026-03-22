import { useNavigate } from 'zmp-ui';

const ServerError: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
            <div>
                <h1 className="text-8xl font-bold text-[#fa2727]"></h1>
            </div>

            <div className="mt-6 text-center">
                <h2 className="mb-3 text-2xl font-bold text-gray-900">Máy Chủ Đang Gặp Sự Cố!</h2>
                <p className="mb-7 text-gray-500">
                    Máy chủ đang gặp sự cố ngoài ý muốn. Chúng tôi đang nỗ lực khắc phục, vui lòng quay lại sau ít phút
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-red-300 text-[#fa2727] font-medium rounded-md hover:bg-red-100 transition duration-300"
                    >
                        Tải lại trang
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-[#fa2727] text-white font-medium rounded-md hover:bg-red-600 transition duration-300 shadow-md"
                    >
                        Trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServerError;
