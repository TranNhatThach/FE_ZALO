import NotFound from '@/components/NotFound';
import ServerError from '@/components/ServerError';

function HomePage() {
    return (
        <>
        <div>
            <NotFound />
            <ServerError />
        </div>
        <div className="p-6 bg-[var(--background)] border-2 border-dashed border-gray-400 my-4">
  {/* Test biến màu từ @layer base */}
  <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
    1. Kiểm tra màu Primary
  </h2>

  {/* Test class component từ @layer components */}
  <button className="btn-primary">
    2. Nút bấm Gradient Tailwind
  </button>
</div>
</>
    );
    
}

export default HomePage;
