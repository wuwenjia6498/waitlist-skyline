'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SimplePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<{ totalUsers: number } | null>(null);

  useEffect(() => {
    // 获取等待列表统计
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('获取统计信息失败', error);
      }
    }

    fetchStats();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setStatus(data.message);
      if (response.ok) {
        setEmail('');
        // 重新获取统计信息
        const statsResponse = await fetch('/api/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      }
    } catch (error) {
      setStatus('提交失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Skyline 简易等待列表
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          输入您的邮箱加入等待列表
        </p>
        {stats && (
          <div className="mt-2 text-sm text-gray-500">
            已有 <span className="font-bold text-blue-600">{stats.totalUsers}</span> 人加入等待
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="simple-email" className="block mb-2 text-sm font-medium">邮箱地址</label>
            <input
              id="simple-email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-70"
          >
            {isLoading ? '提交中...' : '加入等待列表'}
          </button>
        </form>
        
        {status && (
          <div className={`mt-4 p-3 rounded-lg ${status.includes('成功') ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100' : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-100'}`}>
            {status}
          </div>
        )}
      </div>
      
      <div className="text-center">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
        >
          返回完整版首页
        </Link>
      </div>
    </div>
  );
} 