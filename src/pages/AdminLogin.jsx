import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { refetch: login } = useQuery({
    queryKey: ['adminLogin'],
    queryFn: async () => {
      const response = await fetch('https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, password }),
      });
      if (!response.ok) throw new Error('Admin login failed');
      return response.json();
    },
    enabled: false,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login();
      localStorage.setItem('adminToken', result.data.token);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login failed:', error);
      // Handle login error (show message to user)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Admin Login</h2>
        <Input
          type="text"
          placeholder="Admin ID"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          className="mb-4"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6"
          required
        />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default AdminLogin;
