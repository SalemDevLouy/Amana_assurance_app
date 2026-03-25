import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import apiValidation from '@/app/utils/apiValidation';

// GET: Fetch all BMC questions or filter by category
export async function GET() {

  apiValidation();
  // return NextResponse.json({ message: "Welcome, authorized user!" });


  try {
    // Check if Prisma Client is initialized
    if (!db) {
      throw new Error('Prisma Client is not initialized. Check db import in app/lib/db.ts');
    }

    // Check if bmcQuestion model exists
    if (!db.bmcquestion) {
      throw new Error('bmcQuestion model is undefined. Verify Prisma schema and client generation');
    }

    // Build query

    // Fetch questions
    const questions = await db.bmcquestion.findMany({
      orderBy: { createdAt: 'asc' }, // Order by creation date
    });

    // Log success

    return NextResponse.json(questions, { status: 200 });
  } catch (error: unknown) {
    // Narrow the error to an object first
    if (
      typeof error === 'object' &&
      error !== null
    ) {
      const err = error as { message?: string; stack?: string; code?: string };
  
      // Enhanced error logging
      console.error('GET Error:', {
        message: err.message,
        stack: err.stack,
        code: err.code,
      });
  
      // Handle specific Prisma error
      if (err.code === 'P1001') {
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
          error: 'Failed to fetch BMC questions',
          details: err.message ?? 'Unknown error',
        },
        { status: 500 }
      );
    }
  
    // Fallback for truly unknown error types
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
   finally {
    // Disconnect Prisma to prevent connection leaks
    if (db) {
      await db.$disconnect();
    }
  }
}

// POST: Create a new BMC question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate that body is an object, not an array
    if (Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Expected a single question object, not an array' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.questionText || !body.category) {
      return NextResponse.json(
        { error: 'questionText and category are required' },
        { status: 400 }
      );
    }

    // Sanitize optionsList to ensure it's a string[] or null
    const optionsList = body.optionsList
      ? Array.isArray(body.optionsList)
        ? body.optionsList.filter((opt: unknown) => typeof opt === 'string' && opt.trim())
        : null
      : null;

    // Create a single question
    const question = await db.bmcquestion.create({
      data: {
        questionText: body.questionText,
        category: body.category,
        description: body.description || '',
        type: body.type || 'text',
        optionsList,
        required: body.required || false,
        createdAt: new Date(),
        },
    });

    return NextResponse.json({ success: true, question }, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create question', details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

