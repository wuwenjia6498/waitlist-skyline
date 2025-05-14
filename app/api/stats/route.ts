import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    // 获取等待列表的总人数
    const totalUsers = await prisma.waitlist.count();
    
    // 获取今天加入的用户数量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayUsers = await prisma.waitlist.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });
    
    return NextResponse.json({
      totalUsers,
      todayUsers,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    
    return NextResponse.json({
      error: '获取统计信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 