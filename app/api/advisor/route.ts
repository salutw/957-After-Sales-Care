import { NextRequest, NextResponse } from 'next/server';
import { mockApiService } from '@/lib/mock-data';

// GET /api/advisor - 獲取顧問案件列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const cases = await mockApiService.getAdvisorCases(userId || undefined);
    return NextResponse.json({ success: true, cases });
  } catch (error) {
    console.error('Get advisor cases error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

// POST /api/advisor - 創建顧問案件
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const advisorCase = await mockApiService.createAdvisorCase(body);

    return NextResponse.json({
      success: true,
      case: advisorCase,
    });
  } catch (error) {
    console.error('Create advisor case error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}