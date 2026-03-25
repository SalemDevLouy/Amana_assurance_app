import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import apiValidation from '@/app/utils/apiValidation';


// DELETE: Delete a BMC question by ID
export async function DELETE(request: NextRequest) {
    apiValidation();
    try {
      const id = request.url.split('bmc/')[1];
      // Validate ID
      if (!id || typeof id !== 'string') {
        return NextResponse.json(
          { error: 'Invalid or missing question ID' },
          { status: 400 }
        );
      }
  
      // Delete the question
      const deletedQuestion = await db.bmcquestion.delete({
        where: { id },
      });
  
      return NextResponse.json({ success: true, deletedQuestion }, { status: 200 });
    } catch (error) {
      console.error('DELETE Error:', error);
      return NextResponse.json(
        { error: 'Failed to delete question', details: (error as Error).message },
        { status: 500 }
      );
    } finally {
      await db.$disconnect();
    }
  }