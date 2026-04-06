import React, { useEffect, useState } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/theme.store';
import { useMobile } from '../../hooks/useMobile';
import { menuConfig, MenuItem } from '../../configs/menu.config';

const { Sider } = Layout;

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, setSidebarCollapsed, isDarkMode } = useThemeStore();
  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    // Find matching key for current path
    const path = location.pathname;
    
    // Auto expand parent menus if a child is selected
    const findKeys = (items: MenuItem[], parentKeys: string[] = []): {selected: string, parents: string[]} | null => {
      for (const item of items) {
        if (item?.path === path) return { selected: item.key as string, parents: parentKeys };
        if (item && 'children' in item && item.children) {
          const result = findKeys(item.children as MenuItem[], [...parentKeys, item.key as string]);
          if (result) return result;
        }
      }
      return null;
    };
    
    const result = findKeys(menuConfig);
    if (result) {
      setSelectedKeys([result.selected]);
      if (!isSidebarCollapsed) {
        setOpenKeys(prev => Array.from(new Set([...prev, ...result.parents])));
      }
    } else {
      setSelectedKeys(['dashboard']);
    }
  }, [location.pathname, isSidebarCollapsed]);

  const handleMenuClick = (e: { key: string }) => {
    const findPath = (items: MenuItem[], key: string): string | undefined => {
      for (const item of items) {
        if (item?.key === key) return item.path;
        if (item && 'children' in item && item.children) {
          const childPath = findPath(item.children as MenuItem[], key);
          if (childPath) return childPath;
        }
      }
      return undefined;
    };
    
    const path = findPath(menuConfig, e.key);
    if (path) {
      navigate(path);
      if (isMobile) {
        setSidebarCollapsed(true); // Close drawer on mobile after navigation
      }
    }
  };

  const menuContent = (
    <div className={`flex flex-col h-full border-r transition-colors duration-300 ${isDarkMode ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className={`h-16 flex items-center justify-center font-bold text-lg tracking-wider border-b transition-colors duration-300 ${isDarkMode ? 'border-gray-800 text-white' : 'border-gray-200 text-gray-800'}`}>
        {!isSidebarCollapsed || isMobile ? 'ZMA ADMIN' : 'ZMA'}
      </div>
      <Menu
        mode="inline"
        theme={isDarkMode ? 'dark' : 'light'}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys)}
        onClick={handleMenuClick}
        items={menuConfig}
        className="flex-1 border-r-0 transition-colors duration-300"
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setSidebarCollapsed(true)}
        open={!isSidebarCollapsed}
        styles={{ body: { padding: 0 } }}
        width={250}
      >
        {menuContent}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={isSidebarCollapsed}
      onCollapse={(value) => setSidebarCollapsed(value)}
      width={250}
      theme={isDarkMode ? 'dark' : 'light'}
      trigger={null}
      className="shadow-sm z-20 transition-all duration-300"
      style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
    >
      {menuContent}
    </Sider>
  );
};
