import React from 'react';
import { useLocation, useNavigate } from 'zmp-ui';
import { useThemeStore } from '../../stores/theme.store';

export const BottomNav: React.FC = () => {
    const { isDarkMode } = useThemeStore();
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { 
            key: 'home', 
            path: '/test', 
            icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v11h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, 
            label: 'HOME' 
        },
        { 
            key: 'members', 
            path: '/', 
            icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="2"/><path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/></svg>, 
            label: 'MEMBERS' 
        },
        { 
            key: 'tasks', 
            path: '/tasks', 
            icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/></svg>, 
            label: 'TASKS' 
        },
        { 
            key: 'crm', 
            path: '/crm', 
            icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/></svg>, 
            label: 'CRM' 
        },
        { 
            key: 'more', 
            path: '/more', 
            icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>, 
            label: 'MORE' 
        },
    ];

    const activeTab = tabs.find(tab => tab.path === location.pathname)?.key || 'home';

    return (
        <div 
            className={`fixed bottom-0 left-0 right-0 h-20 border-t ${isDarkMode ? 'bg-black border-gray-900' : 'bg-white border-gray-100'} px-2 pt-2 pb-6 flex items-center justify-around z-30`}
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <div 
                        key={tab.key} 
                        onClick={() => navigate(tab.path)}
                        className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-2xl transition-all cursor-pointer ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                        {tab.icon}
                        <span className={`text-[9px] font-black tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
                    </div>
                );
            })}
        </div>
    );
};
