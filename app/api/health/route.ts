import { NextRequest, NextResponse } from 'next/server';
import { mockApiService } from '@/lib/mock-data';

// GET /api/health - 獲取健康記錄列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用戶ID' },
        { status: 400 }
      );
    }

    const records = await mockApiService.getHealthRecords(userId);
    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('Get health records error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

// POST /api/health - 創建健康記錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = await mockApiService.createHealthRecord(body);

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    console.error('Create health record error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}