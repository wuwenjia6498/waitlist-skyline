'use client';

import { useState, useRef } from 'react';
import WaitlistForm from "./components/WaitlistForm";
import WaitlistStats from "./components/WaitlistStats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./components/ui/card";
import { Button } from "./components/ui/button";

export default function Home() {
  // 使用数字作为刷新触发器，每次递增
  const [statsRefreshCounter, setStatsRefreshCounter] = useState(0);
  const statsRef = useRef<typeof WaitlistStats>(null);

  // 当表单提交成功时触发刷新
  const handleFormSuccess = () => {
    console.log('表单提交成功，准备刷新统计数据');
    // 递增计数器值
    setStatsRefreshCounter(prev => prev + 1);
    // 直接调用刷新方法作为备份
    try {
      if (typeof WaitlistStats.refreshStats === 'function') {
        console.log('直接调用刷新方法');
        WaitlistStats.refreshStats();
      }
    } catch (error) {
      console.error('刷新统计数据失败:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-secondary/20">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skyline
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            即将推出令人惊艳的新产品！现在加入等待列表，抢先体验。
          </p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">加入等待列表</CardTitle>
            <CardDescription className="text-center">填写信息，率先体验我们的创新产品</CardDescription>
          </CardHeader>
          <CardContent>
            <WaitlistForm onSubmitSuccess={handleFormSuccess} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="w-full">
              <WaitlistStats shouldRefresh={Boolean(statsRefreshCounter % 2)} />
            </div>
          </CardFooter>
        </Card>

        <div className="w-full max-w-4xl mt-8">
          <h3 className="text-lg font-medium mb-6 text-center">为什么选择 Skyline?</h3>
          <div className="flex flex-row justify-between flex-wrap gap-4">
            <Card className="flex-1 min-w-[250px]">
              <CardHeader>
                <div className="text-blue-500 text-2xl mb-2 text-center">✨</div>
                <CardTitle className="text-center text-base">创新体验</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  全新设计的用户界面，带来前所未有的体验
                </p>
              </CardContent>
            </Card>
            
            <Card className="flex-1 min-w-[250px]">
              <CardHeader>
                <div className="text-blue-500 text-2xl mb-2 text-center">🚀</div>
                <CardTitle className="text-center text-base">高效工作流</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  提升您的工作效率，让您轻松应对各种挑战
                </p>
              </CardContent>
            </Card>
            
            <Card className="flex-1 min-w-[250px]">
              <CardHeader>
                <div className="text-blue-500 text-2xl mb-2 text-center">🔒</div>
                <CardTitle className="text-center text-base">安全可靠</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  我们优先考虑您的数据安全，提供全方位保障
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Skyline. 保留所有权利。</p>
        <p className="mt-2">
          <a 
            href="/admin" 
            className="text-xs text-gray-400 hover:text-gray-500 transition-colors"
            title="管理后台"
          >
            管理入口
          </a>
        </p>
      </footer>
    </div>
  );
}
