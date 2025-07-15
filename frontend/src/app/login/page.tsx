// frontend/src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
`;

const LoginForm = styled.form`
  padding: 2.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #111827;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444; /* red-500 */
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
`;

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      router.push('/dashboard/resource-status'); // 로그인 성공 시 대시보드로 이동
    } catch (err) {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <LoginPageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Cilinus AIDS</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">로그인</Button>
      </LoginForm>
    </LoginPageContainer>
  );
}