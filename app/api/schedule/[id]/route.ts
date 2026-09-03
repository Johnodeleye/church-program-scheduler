import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Schedule from '@/models/Schedule';

// PUT update a schedule item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id } = await params; // <- MUST await params in Next.js 16+

    const updated = await Schedule.findByIdAndUpdate(
      id,
      {
        leadMinister: body.leadMinister || '',
        praiseWorship: body.praiseWorship || '',
        closingPrayer: body.closingPrayer || '',
      },
      { returnDocument: 'after', runValidators: true } // <- Use returnDocument instead of new
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Schedule updated successfully', data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE a schedule item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params; // <- MUST await params

    const deleted = await Schedule.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Schedule deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}