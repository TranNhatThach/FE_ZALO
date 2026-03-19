import NotFound from '@/components/NotFound';
import ServerError from '@/components/ServerError';

function HomePage() {
    return (
        <div>
            <NotFound />
            <ServerError />
        </div>
    );
}

export default HomePage;
