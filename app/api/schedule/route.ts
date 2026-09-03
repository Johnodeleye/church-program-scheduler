import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Schedule from '@/models/Schedule';

// GET all schedule items
export async function GET() {
  try {
    await connectToDatabase();
    const schedules = await Schedule.find({}).sort({ date: 1 });
    return NextResponse.json({ success: true, data: schedules }, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

// POST create multiple schedule items
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { schedules } = body;

    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: schedules array required' },
        { status: 400 }
      );
    }

    // Prepare data for bulk insert
    const scheduleData = schedules.map((item: any) => ({
      date: new Date(item.date),
      dayType: item.dayType,
      leadMinister: item.leadMinister || '',
      praiseWorship: item.praiseWorship || '',
      closingPrayer: item.closingPrayer || '',
    }));

    // Use bulkWrite with ordered: false to skip duplicates
    const result = await Schedule.bulkWrite(
      scheduleData.map((item) => ({
        updateOne: {
          filter: { date: item.date },
          update: { $setOnInsert: item },
          upsert: true,
        },
      })),
      { ordered: false }
    );

    // Fetch all schedules after insert
    const allSchedules = await Schedule.find({}).sort({ date: 1 });

    return NextResponse.json(
      {
        success: true,
        message: 'Schedules saved successfully',
        data: allSchedules,
        inserted: result.upsertedCount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving schedules:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save schedules' },
      { status: 500 }
    );
  }
}