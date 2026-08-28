import { NextRequest, NextResponse } from 'next/server';
import { mockAuthService } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: '缺少手機號碼' },
        { status: 400 }
      );
    }

    const result = await mockAuthService.sendVerificationCode(phone);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '驗證碼已發送',
      });
    } else {
      return NextResponse.json(
        { error: result.error || '發送失敗' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}