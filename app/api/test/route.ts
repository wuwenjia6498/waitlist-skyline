import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    // 简单的数据库连接测试
    const count = await prisma.waitlist.count();
    
    return NextResponse.json({
      message: '数据库连接成功',
      waitlistCount: count,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('API测试错误:', error);
    
    return NextResponse.json({
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : '未知错误',
      serverTime: new Date().toISOString()
    }, { status: 500 });
  }
} 