import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/mongodb';

export async function GET() {
  const status = await checkDatabaseConnection();
  
  return NextResponse.json(
    {
      status: status.connected ? 'healthy' : 'unhealthy',
      message: status.message,
      timestamp: new Date().toISOString(),
    },
    { status: status.connected ? 200 : 503 }
  );
}