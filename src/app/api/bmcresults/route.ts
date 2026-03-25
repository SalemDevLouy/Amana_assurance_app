import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import apiValidation from '@/app/utils/apiValidation';

// GET: Fetch all BMC questions or filter by category
export async function GET(request: NextRequest) {
  apiValidation();
  try {
    // Check if Prisma Client is initialized
    if (!db) {
      throw new Error('Prisma Client is not initialized. Check db import in app/lib/db.ts');
    }
    // Check if bmcQuestion model exists
    if (!db.bmcresult) {
      throw new Error('bmcQuestion model is undefined. Verify Prisma schema and client generation');
    }

    // Parse query parameters
    const Id =  request.headers.get('userId');
    // Fetch questions
    const result = await db.bmcresult.findMany({
      where: {
        userId: Id? Id : '', // Use userId from headers or undefined if not provided 
      },
    });

    return NextResponse.json(result, { status: 200 });
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

// POST: Create a new BMC result
export async function POST(request: NextRequest) {
  apiValidation();
  let body;
  try {
    body = await request.json();
  } catch (e) {
    console.error('Failed to parse request body:', e);
    return NextResponse.json(
      { error: 'Invalid or empty request body' },
      { status: 400 }
    );
  }

  try {
    const userId = request.headers.get('userId') || body.userId;

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required and must be a string' },
        { status: 400 }
      );
    }

    // Clean and validate data
    const { projectName = 'Untitled Project', ...cleanedData } = body;
    if (!cleanedData || Object.keys(cleanedData).length === 0) {
      return NextResponse.json(
        { error: 'BMC data is required' },
        { status: 400 }
      );
    }

    // Validate cleanedData fields
    const validFields = [
      'KeyPartners',
      'KeyActivities',
      'KeyResources',
      'ValuePropositions',
      'CustomerRelationships',
      'Channels',
      'CustomerSegments',
      'CostStructure',
      'RevenueStreams',
    ];
    const invalidFields = Object.keys(cleanedData).filter(
      (key) => !validFields.includes(key)
    );
    if (invalidFields.length > 0) {
      console.warn('Unexpected fields in cleanedData:', invalidFields);
    }

    // Ensure fields are arrays
    for (const field of validFields) {
      if (cleanedData[field] && !Array.isArray(cleanedData[field])) {
        return NextResponse.json(
          { error: `Field ${field} must be an array` },
          { status: 400 }
        );
      }
    }

    const result = await db.bmcresult.create({
      data: {
        userId,
        projectName,
        data: cleanedData,
        itSaved: true,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof Error && 'code' in error ? error.code : undefined,
      requestBody: JSON.stringify(body, null, 2) || 'Unable to parse body',
      userId: body?.userId || request.headers.get('userId'),
    };

    console.error('POST /api/bmcresults Error:', errorDetails);

    if (error instanceof Error && 'code' in error) {
      if (error.code === 'P1001') {
        return NextResponse.json(
          {
            error: 'Cannot connect to MongoDB',
            details: 'Check DATABASE_URL and MongoDB server',
          },
          { status: 500 }
        );
      }
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            error: 'Data conflict',
            details: 'A record with the same userId or unique value already exists',
          },
          { status: 409 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error: 'Required field missing',
            details: 'Ensure all required fields are provided',
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to create BMC result',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}