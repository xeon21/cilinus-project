// frontend/src/app/admin/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';
import { UserDto } from '@/dto/user.dto';

import DashboardLayout from '../components/layout/DashboardLayout';
import { GridContainer, GridItem } from '../components/layout/Grid';
import Modal from '../components/common/Modal';

// Styled Components - Tag Status 스타일과 동일하게 변경
const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto;
`;

const HeaderContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const StatusContainer = styled.div`
  padding: 4rem;
  text-align: center;
  color: #6b7280;
  background-color: white;
  border-radius: 8px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  
  tbody tr:hover {
    background-color: #f9fafb;
  }
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.90rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid #e5e7eb;
  text-transform: uppercase;
  vertical-align: top;
`;

const Td = styled.td`
  padding: 0.4rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
`;

const PrimaryButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const ActionButton = styled.button`
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.2s;
  
  &.edit {
    background-color: #3b82f6;
    color: white;
    &:hover { background-color: #2563eb; }
  }
  &.delete {
    background-color: #ef4444;
    color: white;
    &:hover { background-color: #dc2626; }
  }
  &.password {
    background-color: #8b5cf6;
    color: white;
    &:hover { background-color: #7c3aed; }
  }
`;


export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, hasRole } = useAuthStore();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for Role Change Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserDto | null>(null);

  // State for User Registration Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    userId: '',
    userName: '',
    password: '',
    role: 'viewer',
  });

  // State for Password Change Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordChangeUser, setPasswordChangeUser] = useState<UserDto | null>(null);
  const [newPassword, setNewPassword] = useState('');


  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data);
    } catch (e: any) {
      setError(e.message || '사용자 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!hasRole('admin')) {
      alert('접근 권한이 없습니다.');
      router.push('/dashboard');
      return;
    }
    fetchUsers();
  }, [isAuthenticated, hasRole, router, fetchUsers]);

  // Role Change Handlers
  const handleOpenRoleModal = (user: UserDto) => {
    setEditingUser(user);
    setSelectedRole(user.roles[0] || 'viewer');
    setIsRoleModalOpen(true);
  };
  const handleCloseRoleModal = () => setIsRoleModalOpen(false);
  const handleRoleChange = async () => {
    if (!editingUser) return;
    try {
      await axiosInstance.patch(`/admin/users/${editingUser.userIdx}/role`, { role: selectedRole });
      alert('역할이 성공적으로 변경되었습니다.');
      handleCloseRoleModal();
      fetchUsers();
    } catch (error) {
      alert('역할 변경에 실패했습니다.');
    }
  };

  // Delete Handlers
  const handleOpenDeleteModal = (user: UserDto) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await axiosInstance.delete(`/admin/users/${deletingUser.userIdx}`);
      alert('사용자가 삭제되었습니다.');
      handleCloseDeleteModal();
      fetchUsers();
    } catch (error) {
      alert('사용자 삭제에 실패했습니다.');
    }
  };

  // User Registration Handlers
  const handleOpenRegisterModal = () => {
    setNewUser({ userId: '', userName: '', password: '', role: 'viewer' });
    setIsRegisterModalOpen(true);
  };
  const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  const handleRegisterUser = async () => {
    if (!newUser.userId || !newUser.userName || !newUser.password) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    try {
      await axiosInstance.post('/admin/register', newUser);
      alert('사용자가 성공적으로 등록되었습니다.');
      handleCloseRegisterModal();
      fetchUsers();
    } catch (error) {
      alert('사용자 등록에 실패했습니다.');
    }
  };

  // Password Change Handlers
  const handleOpenPasswordModal = (user: UserDto) => {
    setPasswordChangeUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };
  const handleClosePasswordModal = () => setIsPasswordModalOpen(false);
  const handlePasswordChange = async () => {
    if (!passwordChangeUser || !newPassword) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }
    if (newPassword.length < 4) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    try {
      await axiosInstance.patch(`/admin/users/${passwordChangeUser.userIdx}/password`, { newPassword });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      handleClosePasswordModal();
    } catch (error) {
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <DashboardLayout $bgColor="#e9eef2" $padding="2rem">
      <HeaderContainer>
        <Title>사용자 관리</Title>
        <PrimaryButton onClick={handleOpenRegisterModal}>사용자 등록</PrimaryButton>
      </HeaderContainer>
      
      {loading ? (
        <StatusContainer>사용자 목록을 불러오는 중...</StatusContainer>
      ) : error ? (
        <StatusContainer>오류: {error}</StatusContainer>
      ) : (
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>이름</Th>
                <Th>유저 ID</Th>
                <Th>역할</Th>
                <Th>가입일</Th>
                <Th>작업</Th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userIdx}>
                  <Td>{user.userIdx}</Td>
                  <Td>{user.userName}</Td>
                  <Td>{user.userId}</Td>
                  <Td>{user.roles.join(', ')}</Td>
                  <Td>{new Date(user.regTime).toLocaleDateString()}</Td>
                  <Td>
                    <ActionButton className="edit" onClick={() => handleOpenRoleModal(user)}>역할 변경</ActionButton>
                    <ActionButton className="password" onClick={() => handleOpenPasswordModal(user)}>비번 변경</ActionButton>
                    <ActionButton className="delete" onClick={() => handleOpenDeleteModal(user)}>삭제</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}

      <Modal
        isOpen={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        onConfirm={handleRoleChange}
        title={`'${editingUser?.userName}' 역할 변경`}
      >
        <p>새로운 역할을 선택해주세요.</p>
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={{ width: '100%', padding: '8px' }}>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteUser}
        title="사용자 삭제 확인"
      >
        <p>정말로 '{deletingUser?.userName}' 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
      </Modal>

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onConfirm={handleRegisterUser}
        title="새 사용자 등록"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            name="userId"
            placeholder="유저 ID"
            value={newUser.userId}
            onChange={handleNewUserChange}
            style={{ padding: '8px' }}
          />
          <input
            type="text"
            name="userName"
            placeholder="이름"
            value={newUser.userName}
            onChange={handleNewUserChange}
            style={{ padding: '8px' }}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={newUser.password}
            onChange={handleNewUserChange}
            style={{ padding: '8px' }}
          />
          <select name="role" value={newUser.role} onChange={handleNewUserChange} style={{ padding: '8px' }}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        onConfirm={handlePasswordChange}
        title={`'${passwordChangeUser?.userName}' 비밀번호 변경`}
      >
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </Modal>
    </DashboardLayout>
  );
}
