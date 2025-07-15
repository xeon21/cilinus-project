// frontend/src/app/components/layout/Sidebar.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useAuthStore } from '@/store/authStore';

// --- 아이콘 컴포넌트 ---
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);


// --- 메뉴 데이터 및 타입 ---
interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  pathPrefix?: string;
  children?: { title: string; path: string; permission?: string }[];
  permission?: string;
}

export const menuItems: MenuItem[] = [
    
    {
        title: 'Dashboard',
        icon: '📊',
        pathPrefix: '/dashboard',
        permission: 'menu_dashboard_view',
        children: [
           // --- [추가] ---
            { title: 'Resource Status', path: '/dashboard/resource-status' },
            { title: 'Server Status', path: '/dashboard/server-status' },
            { title: '유저통계', path: '/dashboard/user-statistics' }
        ]
    },
   
    { title: 'Gateway Statue', icon: '📡', path: '/gateway-status'},
    { title: 'Tag Status', icon: '🏷️', path: '/tag-status'},
    { title: 'Sensor Status', icon: '🌡️', path: '/sensor-status'},
      
     {
        title: 'Editor',
        icon: 'ℹ️',
        pathPrefix: '/editor',
        children: [
            { title: '템플릿에디터', path: '/editor/new' },
            { title: '캔버스해상도추가', path:  '/editor/resolutions' }
        ]
    },
    {
        title: 'Dynamic Page',
        icon: '✨',
        pathPrefix: '/dynamic_page',
        children: [
            { title: '다이나믹 에디터', path: '/dynamic_page/new' },
        ]
    },
    { title: 'Admin', icon: '👑', path: '/admin' , permission: 'menu_admin_view' },

    
];


// --- Styled Components ---
const Aside = styled.aside`
  width: 16rem;
  height: 100vh;
  background-color: #2c3e50;
  padding: 1rem;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  margin-bottom: 2rem;
  font-weight: bold;
  font-size: 1.5rem;
  padding: 0.5rem 0.75rem;
  color: #ecf0f1;
  text-align: center;
`;

const Nav = styled.nav`
  flex-grow: 1;
`;

const MenuItemWrapper = styled.div`
  border-bottom: 1px solid #34495e;

  &:last-child {
    border-bottom: none;
  }
`;

const menuItemStyle = (isActive: boolean) => `
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: background-color 0.2s, color 0.2s;
  color: ${isActive ? 'white' : '#bdc3c7'};
  background-color: ${isActive ? '#3498db' : 'transparent'};
  font-size: 1rem;
  margin-bottom: 0;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${isActive ? '#2980b9' : '#34495e'};
    color: white;
  }
`;

const MenuButton = styled.button<{ $isActive: boolean }>`
  ${props => menuItemStyle(props.$isActive)}
  justify-content: space-between;
`;

const DirectLink = styled(Link)<{ $isActive: boolean }>`
  ${props => menuItemStyle(props.$isActive)}
`;

const IconSpan = styled.span`
    margin-right: 1rem;
    font-size: 1.25rem;
    line-height: 1;
`;

const MenuText = styled.span`
    flex-grow: 1;
`;

const SubMenuList = styled.ul`
  margin: 0.5rem 0 0.5rem 2rem;
  padding-left: 1rem;
  list-style-type: none;
  border-left: 1px solid #4a627a;
`;

const SubMenuLink = styled(Link)<{ $isActive: boolean }>`
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  color: ${props => (props.$isActive ? 'white' : '#95a5a6')};
  font-weight: ${props => (props.$isActive ? '600' : 'normal')};
  font-size: 0.9rem;
  background-color: ${props => (props.$isActive ? '#34495e' : 'transparent')};

  &:hover {
    background-color: #34495e;
    color: white;
  }
`;

const LogoutButton = styled.button`
    margin-top: auto;
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #4a627a;
    border-radius: 0.5rem;
    font-weight: 600;
    color: #bdc3c7;
    background-color: transparent;
    cursor: pointer;

    &:hover {
        background-color: #e74c3c;
        color: white;
        border-color: #e74c3c;
    }
`;

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const logout = useAuthStore((state) => state.logout);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const user = useAuthStore((state) => state.user);

  const accessibleMenuItems = useMemo(() => {
    return menuItems.filter(item =>
      item.permission ? hasPermission(item.permission) : true
    );
  }, [user, hasPermission]);

  useEffect(() => {
    const currentMenu = accessibleMenuItems.find(item => 
        (item.path && pathname === item.path) || 
        (item.pathPrefix && pathname.startsWith(item.pathPrefix))
    );
    
    if (currentMenu) {
      setActiveMenu(currentMenu.title);
      if (currentMenu.children) {
        setOpenMenu(currentMenu.title);
      }
    }
  }, [pathname, accessibleMenuItems]);

  const handleMenuToggle = (title: string) => {
    setActiveMenu(title);
    setOpenMenu(prevOpenMenu => (prevOpenMenu === title ? null : title));
  };
  
  return (
    <Aside>
      <Logo>Cilinus AIDR</Logo>
      <Nav>
        {accessibleMenuItems.map((item) => (
          <MenuItemWrapper key={item.title}>
            {item.children ? (
              <>
                <MenuButton
                  $isActive={activeMenu === item.title}
                  onClick={() => handleMenuToggle(item.title)}
                >
                  <IconSpan>{item.icon}</IconSpan>
                  <MenuText>{item.title}</MenuText>
                  {openMenu === item.title ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </MenuButton>
                {openMenu === item.title && (
                  <SubMenuList>
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <SubMenuLink href={child.path} $isActive={pathname === child.path}>
                          {child.title}
                        </SubMenuLink>
                      </li>
                    ))}
                  </SubMenuList>
                )}
              </>
            ) : (
              <DirectLink
                href={item.path || '#'}
                $isActive={activeMenu === item.title}
              >
                <IconSpan>{item.icon}</IconSpan>
                <MenuText>{item.title}</MenuText>
              </DirectLink>
            )}
          </MenuItemWrapper>
        ))}
      </Nav>
      <LogoutButton onClick={logout}>
        로그아웃
      </LogoutButton>
    </Aside>
  );
}