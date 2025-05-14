'use client';

import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface WaitlistFormProps {
  onSubmitSuccess?: () => void;
}

export default function WaitlistForm({ onSubmitSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('提交邮箱:', email);
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('服务器响应:', data);

      if (!response.ok) {
        throw new Error(data.message || '提交失败，请重试');
      }

      setEmail('');
      toast.success('成功加入等待列表！');
      
      // 调用成功提交回调
      console.log('提交成功，准备调用回调函数');
      if (typeof onSubmitSuccess === 'function') {
        console.log('执行onSubmitSuccess回调');
        onSubmitSuccess();
      } else {
        console.log('未提供onSubmitSuccess回调或不是函数');
      }
    } catch (error) {
      console.error('提交表单出错:', error);
      setError(error instanceof Error ? error.message : '提交失败，请重试');
      toast.error(error instanceof Error ? error.message : '提交失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            邮箱地址
          </label>
          <Input
            type="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="text-destructive text-sm">{error}</p>}
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '提交中...' : '加入等待列表'}
        </Button>
      </form>
    </div>
  );
} 