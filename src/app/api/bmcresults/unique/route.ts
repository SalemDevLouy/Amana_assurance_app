import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import apiValidation from '@/app/utils/apiValidation';

// GET: Fetch all BMC questions or filter by category
export async function GET(request:NextRequest) {

  apiValidation();
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'BMC ID is required and must be a string' },
        { status: 400 }
      );
    }


    const result = await db.bmcresult.findUnique({
      where: { id },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'BMC not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof Error && 'code' in error ? error.code : undefined,
    };

    console.error('GET /api/bmcresults Error:', errorDetails);

    if (error instanceof Error && 'code' in error && error.code === 'P1001') {
      return NextResponse.json(
        {
          error: 'Cannot connect to MongoDB',
          details: 'Check DATABASE_URL and MongoDB server',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch BMC result',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}