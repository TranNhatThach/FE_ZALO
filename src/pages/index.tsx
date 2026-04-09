import NotFound from '@/components/NotFound';
import ServerError from '@/components/ServerError';
import { useNavigate } from 'zmp-ui';

function HomePage() {
    const navigate = useNavigate();
    return (
        <>
        <div>
            <NotFound />
            <ServerError />
        </div>
        <div className="p-6 bg-[var(--background)] border-2 border-dashed border-gray-400 my-4 flex flex-col gap-4">
  {/* Test biến màu từ @layer base */}
  <h2 className="text-xl font-bold text-[var(--primary)] mb-2">
    Trang Home / Test Components
  </h2>

  <button className="btn-primary" onClick={() => navigate('/login')}>
    👉 Đi tới trang Đăng nhập
  </button>

  <button className="btn-primary" onClick={() => navigate('/register')}>
    👉 Đi tới trang Đăng ký
  </button>
</div>
</>
    );
    
}
export default HomePage;

// import React from 'react';
// import { Page } from 'zmp-ui';
// import RegisterPage from './Register';

// const HomePage: React.FC = () => {
//   return (
//     <Page className="page">
//       <div className="w-full h-full bg-white">
//         <RegisterPage />
//       </div>
//     </Page>
//   );
// };

// export default HomePage;

