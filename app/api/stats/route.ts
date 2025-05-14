import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// 设置此路由不缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'edge';
export const preferredRegion = 'auto';

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
    
    // 添加随机数以确保响应不被缓存
    const randomValue = Math.random();
    
    return NextResponse.json(
      {
        totalUsers,
        todayUsers,
        lastUpdated: new Date().toISOString(),
        nonce: randomValue // 添加随机值确保响应不同
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
          'Surrogate-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Vary': '*'
        }
      }
    );
  } catch (error) {
    console.error('获取统计信息失败:', error);
    
    return NextResponse.json({
      error: '获取统计信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 