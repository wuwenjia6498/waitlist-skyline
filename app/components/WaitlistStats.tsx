'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

type StatsData = {
  totalUsers: number;
  todayUsers: number;
  lastUpdated: string;
};

interface WaitlistStatsProps {
  shouldRefresh?: boolean;
}

export default function WaitlistStats({ shouldRefresh }: WaitlistStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const prevRefreshValue = useRef(shouldRefresh);

  // 获取统计数据
  const fetchStats = useCallback(async () => {
    console.log('正在获取统计数据...');
    setLoading(true);
    try {
      // 添加时间戳参数避免缓存
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/stats?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('获取统计信息失败');
      }
      
      const data = await response.json();
      console.log('获取到的统计数据:', data);
      setStats(data);
    } catch (err) {
      console.error('统计信息加载错误:', err);
      setError('无法加载统计信息');
    } finally {
      setLoading(false);
    }
  }, []);

  // 当 shouldRefresh 变化时触发数据刷新
  useEffect(() => {
    console.log('WaitlistStats useEffect 触发, shouldRefresh:', shouldRefresh, '上一次值:', prevRefreshValue.current);
    if (shouldRefresh !== prevRefreshValue.current) {
      console.log('shouldRefresh 已变化，正在刷新数据');
      fetchStats();
      prevRefreshValue.current = shouldRefresh;
    } else if (!stats) {
      console.log('首次加载或数据为空，正在获取数据');
      fetchStats();
    }
  }, [fetchStats, shouldRefresh, stats]);

  // 提供静态方法以便外部调用
  WaitlistStats.refreshStats = fetchStats;

  if (loading && !stats) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-pulse text-gray-400">加载统计信息...</div>
      </div>
    );
  }

  if (error && !stats) {
    return null; // 出错且无数据时不显示组件
  }

  if (!stats) {
    return null; // 无数据时不显示
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

// 为组件添加静态方法
WaitlistStats.refreshStats = () => {}; 