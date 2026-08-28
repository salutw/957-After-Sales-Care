import { NextRequest, NextResponse } from 'next/server';
import { mockApiService } from '@/lib/mock-data';

// GET /api/users - 獲取用戶列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('id');

    if (userId) {
      const user = await mockApiService.getUser(userId);
      if (!user) {
        return NextResponse.json(
          { error: '用戶不存在' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, user });
    }

    const users = await mockApiService.getUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

// POST /api/users - 創建新用戶
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await mockApiService.createUser(body);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}