import { getSystemInfo } from 'zmp-sdk';
import { AnimationRoutes, App, Route, ZMPRouter, Page } from 'zmp-ui';
import { AppProps } from 'zmp-ui/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from '@/pages/index';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';

import Dashboard from '@/pages/Dashboard';

const queryClient = new QueryClient();

const Layout = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <App theme={getSystemInfo().zaloTheme as AppProps['theme']}>
                <ZMPRouter>
                    <AnimationRoutes>
                        <Route path="/" element={<Page className="page"><LoginPage /></Page>}></Route>
                        <Route path="/login" element={<Page className="page"><LoginPage /></Page>}></Route>
                        <Route path="/register" element={<Page className="page"><RegisterPage /></Page>}></Route>
                        <Route path="/dashboard" element={<Page className="page"><Dashboard /></Page>}></Route>
                        
                        {/* Trang Error Test */}
                        <Route path="/error" element={<HomePage />}></Route>
                    </AnimationRoutes>
                </ZMPRouter>
            </App>
        </QueryClientProvider>
    );
};
export default Layout;
