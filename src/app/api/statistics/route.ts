import {  NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import apiValidation from '@/app/utils/apiValidation';

// GET: Fetch all BMC questions or filter by category
export async function GET() {
    apiValidation();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
    try {
        // console.log('Fetching statistics...', request.url);
        // Check if Prisma Client is initialized
        if (!db) {
        throw new Error('Prisma Client is not initialized. Check db import in app/lib/db.ts');
        }
    
        // Fetch statistics from the database
        const userCount = await db.user.count();
        const questionCount = await db.bmcquestion.count();
        const projectCount = await db.bmcresult.count();
        
        return NextResponse.json([{ metric: 'Total Users',value: userCount },
            { metric: 'BMC Completions', value: projectCount },
            { metric: 'Total Questions', value: questionCount },], { status: 200 });
    } catch (error: unknown) {
        // Narrow the error to an object first
        if (typeof error === 'object' && error !== null) {
        const err = error as { message?: string; stack?: string; code?: string };
    
        // Enhanced error logging
        console.error('GET Error:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
    
        return NextResponse.json(
            { error: 'Failed to fetch statistics', details: err.message },
            { status: 500 }
        );
        }
    
        return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
        );
    }
    }