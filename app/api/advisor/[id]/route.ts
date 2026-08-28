import { NextRequest, NextResponse } from 'next/server';
import { mockApiService } from '@/lib/mock-data';

// GET /api/advisor/[id] - 獲取特定顧問案件
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cases = await mockApiService.getAdvisorCases();
    const advisorCase = cases.find(c => c.id === params.id);

    if (!advisorCase) {
      return NextResponse.json(
        { error: '案件不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, case: advisorCase });
  } catch (error) {
    console.error('Get advisor case error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

// PUT /api/advisor/[id] - 更新顧問案件
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const advisorCase = await mockApiService.updateAdvisorCase(params.id, body);

    if (!advisorCase) {
      return NextResponse.json(
        { error: '案件不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      case: advisorCase,
    });
  } catch (error) {
    console.error('Update advisor case error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}