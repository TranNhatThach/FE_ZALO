import { getSystemInfo } from 'zmp-sdk';
import { AnimationRoutes, App, Route, SnackbarProvider as _SnackbarProvider, ZMPRouter } from 'zmp-ui';
import { AppProps } from 'zmp-ui/app';

// zmp-ui's type definition for SnackbarProvider is missing the component declaration
// (only interfaces are exported). The component works at runtime, so we cast it.
const SnackbarProvider = _SnackbarProvider as any;

import HomePage from '@/pages/index';
import MembersPage from '@/pages/members/MembersPage';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';

const Layout = () => {
    return (
        <App theme={getSystemInfo().zaloTheme as AppProps['theme']}>
            <ZMPRouter>
                <SnackbarProvider>
                    <div className="min-h-screen pb-20">
                        <AnimationRoutes>
                            <Route path="/" element={<MembersPage />}></Route>
                            <Route path="/test" element={<HomePage />}></Route>
                        </AnimationRoutes>
                    </div>
                    <BottomNav />
                </SnackbarProvider>
            </ZMPRouter>
        </App>
    );
};
export default Layout;
