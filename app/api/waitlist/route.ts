import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/lib/db';

// 验证邮箱的Schema
const waitlistSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

export async function GET() {
  try {
    console.log('获取waitlist列表请求');
    
    // 获取所有waitlist用户
    const users = await prisma.waitlist.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`成功获取${users.length}个用户`);
    
    return NextResponse.json(
      { users },
      { status: 200 }
    );
  } catch (error) {
    console.error('获取等待列表失败:', error);
    
    return NextResponse.json(
      { message: '服务器错误，请稍后再试' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('收到删除waitlist用户请求');
    
    // 从URL获取要删除的ID
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: '缺少用户ID' },
        { status: 400 }
      );
    }
    
    const numericId = parseInt(id, 10);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { message: '无效的用户ID' },
        { status: 400 }
      );
    }
    
    // 删除用户
    await prisma.waitlist.delete({
      where: { id: numericId },
    });
    
    console.log(`成功删除ID为${numericId}的用户`);
    
    return NextResponse.json(
      { message: '成功删除用户' },
      { status: 200 }
    );
  } catch (error) {
    console.error('删除用户失败:', error);
    
    return NextResponse.json(
      { message: '服务器错误，请稍后再试' },
      { status: 500 }
    );
  }
}

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