'use client';

import { useEffect, useState } from 'react';

type StatsData = {
  totalUsers: number;
  todayUsers: number;
  lastUpdated: string;
};

export default function WaitlistStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('获取统计信息失败');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('统计信息加载错误:', err);
        setError('无法加载统计信息');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-pulse text-gray-400">加载统计信息...</div>
      </div>
    );
  }

  if (error || !stats) {
    return null; // 出错时不显示组件
  }

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
      <h3 className="text-center text-sm font-medium mb-3">等待列表统计</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalUsers}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">总注册人数</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.todayUsers}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">今日新增</div>
        </div>
      </div>
    </div>
  );
} 