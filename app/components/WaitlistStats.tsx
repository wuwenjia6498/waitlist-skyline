'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent } from './ui/card';

type StatsData = {
  totalUsers: number;
  todayUsers: number;
  lastUpdated: string;
  nonce?: number; // 添加随机数字段
};

interface WaitlistStatsProps {
  shouldRefresh?: boolean;
}

export default function WaitlistStats({ shouldRefresh }: WaitlistStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const prevRefreshValue = useRef(shouldRefresh);
  const lastFetchTime = useRef(0);

  // 获取统计数据
  const fetchStats = useCallback(async () => {
    // 防止短时间内多次请求
    const now = Date.now();
    if (now - lastFetchTime.current < 500) {
      console.log('请求过于频繁，跳过');
      return;
    }
    lastFetchTime.current = now;
    
    console.log('正在获取统计数据...');
    setLoading(true);
    try {
      // 使用更复杂的缓存破坏技术
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 1000000);
      const noCacheParam = `nocache=${timestamp}-${randomPart}`;
      
      const response = await fetch(`/api/stats?${noCacheParam}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Timestamp': timestamp.toString(),
          'X-Random': randomPart.toString()
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

  // 设置一个轮询机制，每隔一段时间自动刷新数据
  useEffect(() => {
    // 添加轮询以定期刷新数据
    const intervalId = setInterval(() => {
      console.log('定时轮询触发，刷新数据');
      fetchStats();
    }, 30000); // 每30秒刷新一次
    
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchStats]);

  // 提供静态方法以便外部调用
  WaitlistStats.refreshStats = fetchStats;

  if (loading && !stats) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-pulse text-muted-foreground">加载统计信息...</div>
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
    <Card className="bg-secondary/40 border-none">
      <CardContent className="pt-6">
        <h3 className="text-center text-sm font-medium mb-3">等待列表统计</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
            <div className="text-xs text-muted-foreground">总注册人数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.todayUsers}</div>
            <div className="text-xs text-muted-foreground">今日新增</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 为组件添加静态方法
WaitlistStats.refreshStats = () => {}; 