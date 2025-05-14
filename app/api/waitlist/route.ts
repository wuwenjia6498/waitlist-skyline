import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/lib/db';

// 验证邮箱的Schema
const waitlistSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

export async function POST(request: Request) {
  try {
    console.log('收到waitlist提交请求');
    
    // 解析请求体
    const body = await request.json();
    console.log('请求体:', body);
    
    // 验证数据
    const { email } = waitlistSchema.parse(body);
    console.log('邮箱验证通过:', email);
    
    try {
      // 检查邮箱是否已存在
      const existingUser = await prisma.waitlist.findUnique({
        where: { email },
      });
      
      console.log('查询现有用户结果:', existingUser);
      
      if (existingUser) {
        console.log('邮箱已存在');
        return NextResponse.json(
          { message: '该邮箱已在等待列表中' },
          { status: 409 }
        );
      }
      
      // 将用户添加到等待列表
      const newUser = await prisma.waitlist.create({
        data: { email },
      });
      
      console.log('成功创建新用户:', newUser);
      
      return NextResponse.json(
        { message: '成功加入等待列表', userId: newUser.id },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('数据库操作错误:', dbError);
      return NextResponse.json(
        { message: '数据库操作失败，请稍后再试' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('添加用户到等待列表失败:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: '验证失败', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: '服务器错误，请稍后再试' },
      { status: 500 }
    );
  }
} 