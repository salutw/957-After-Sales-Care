import { NextRequest, NextResponse } from 'next/server';
import { mockAuthService } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { error: '缺少必要參數' },
        { status: 400 }
      );
    }

    const result = await mockAuthService.login(phone, code);

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
        // 在實際應用中，這裡應該返回 JWT token
        token: 'mock-jwt-token-' + Date.now(),
      });
    } else {
      return NextResponse.json(
        { error: result.error || '登入失敗' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}