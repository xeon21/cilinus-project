'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { menuItems } from './Sidebar';
import { useAuthStore } from '@/store/authStore';
import Modal from '../common/Modal';
import axiosInstance from '@/lib/axios';

const HeaderWrapper = styled.header`
  height: 4.5rem;
  width: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  flex-shrink: 0;

  /* [추가] 구분선 스타일 */
  border-bottom: 1px solid #34495e; /* 사이드바의 어두운 색상과 비슷한 톤으로 선 추가 */
  padding-bottom: 1rem; /* 선과 아래 콘텐츠 사이의 여백 */
  margin-bottom: 1rem;  /* 헤더 자체의 하단 마진 추가 */
`;

const Breadcrumb = styled.div`
    color: #95a5a6;
    font-size: 0.875rem;

    span {
        color: white;
        font-weight: 600;
        font-size: 1.25rem;
        display: block;
        margin-top: 0.25rem;
    }
`;

const ControlsWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const SearchInput = styled.input`
    background-color: transparent;
    border: 1px solid #4a627a;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    width: 200px;
    transition: border-color 0.2s;

    &::placeholder {
        color: #95a5a6;
    }

    &:focus {
        outline: none;
        border-color: #3498db;
    }
`;

const IconContainer = styled.div`
    display: flex;
    gap: 1rem;
    color: #bdc3c7;
    font-size: 1.25rem;

    span {
        cursor: pointer;
        &:hover {
            color: white;
        }
    }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
`;

const UserInfo = styled.span`
  color: #ecf0f1;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  background-color: #3498db;
  font-size: 0.875rem;
  &:hover {
    background-color: #2980b9;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;


export default function Header() {
  const pathname = usePathname();
  const [title, setTitle] = useState('대시보드');
  const [parentTitle, setParentTitle] = useState('Home');
  
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    let pageTitle = 'Dashboard';
    let parent = 'Home';

    for (const item of menuItems) {
      if (item.children?.some(c => c.path === pathname)) {
        parent = item.title;
        pageTitle = item.children.find(c => c.path === pathname)?.title || '';
        break;
      } else if (item.path === pathname) {
        pageTitle = item.title;
        break;
      }
    }
    setTitle(pageTitle);
    setParentTitle(parent);

  }, [pathname]);

  const handlePasswordChange = async () => {
    setError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwords.newPassword.length < 4) {
      setError('새 비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    try {
      await axiosInstance.patch('/userinfo/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsModalOpen(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <HeaderWrapper>
        <Breadcrumb>
          {parentTitle} / {title}
          <span>{title}</span>
        </Breadcrumb>
        <ControlsWrapper>
            <SearchInput placeholder="Search here" />
            <IconContainer>
              <span>⚙️</span>
              <span>🔔</span>
            </IconContainer>
            <UserSection>
              {user && <UserInfo>{user.username}님, 환영합니다.</UserInfo>}
              <ActionButton onClick={() => setIsModalOpen(true)}>비밀번호 변경</ActionButton>
              <ActionButton onClick={logout}>로그아웃</ActionButton>
            </UserSection>
        </ControlsWrapper>
      </HeaderWrapper>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setError('');
        }}
        onConfirm={handlePasswordChange}
        title="비밀번호 변경"
      >
        <Input
          type="password"
          name="currentPassword"
          placeholder="현재 비밀번호"
          value={passwords.currentPassword}
          onChange={onInputChange}
        />
        <Input
          type="password"
          name="newPassword"
          placeholder="새 비밀번호"
          value={passwords.newPassword}
          onChange={onInputChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="새 비밀번호 확인"
          value={passwords.confirmPassword}
          onChange={onInputChange}
        />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </Modal>
    </>
  );
}