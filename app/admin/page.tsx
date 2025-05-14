'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch('/api/waitlist');
      
      if (!res.ok) {
        throw new Error('获取用户列表失败');
      }
      
      const data = await res.json();
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err) {
      setError('获取用户列表出错，请稍后再试');
      console.error('获取用户列表错误:', err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: number) {
    if (!confirm('确定要删除这个用户吗？')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/waitlist?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('删除用户失败');
      }
      
      // 更新用户列表
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } catch (err) {
      alert('删除用户失败，请稍后再试');
      console.error('删除用户错误:', err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // 搜索功能
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(user => 
        user.email.toLowerCase().includes(lowercaseQuery)
      ));
    }
  }, [searchQuery, users]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">等待列表管理系统</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            返回首页
          </Link>
        </div>
        <p className="text-gray-600 mt-2">
          管理用户提交的邮箱地址
        </p>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h2 className="text-xl font-semibold">用户列表</h2>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索邮箱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button 
                onClick={fetchUsers}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm"
              >
                刷新列表
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            加载中...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? '没有找到匹配的邮箱地址' : '暂无用户数据'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    邮箱
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 mr-2"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            总计：<span className="font-medium">{filteredUsers.length}</span> 位用户
            {searchQuery && users.length !== filteredUsers.length && (
              <span> (搜索结果：{filteredUsers.length}/{users.length})</span>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} 邮箱管理系统
      </footer>
    </div>
  );
} 