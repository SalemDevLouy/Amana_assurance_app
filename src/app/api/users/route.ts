import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/app/lib/db';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';

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
    const result = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Prisma Error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: 'Something went wrong',
          error: {
            name: error.name,
            message: error.message,
            // details: (error as any).meta || 'No additional details',
          },
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: 'Something went wrong',
        error: {
          name: 'UnknownError',
          message: 'An unknown error occurred',
          details: 'No additional details',
        },
      },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  
  try {
    const { name, email, password }: { name?: string; email: string; password: string } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { user: null, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify email
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashPassword = await hash(password, 10);

    // Create new user
    const newUser = await db.user.create({
      data: {
        email: email,
        password: hashPassword,
        name: name || null, // name is optional
        role: Role.USER, // Use enum value
      },
    });

    // Exclude password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _newUserPassword, ...rest } = newUser;
    return NextResponse.json({ user: rest, message: 'User Added successfully' });
  } catch (error:unknown) {
    console.error('Prisma Error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: 'Something went wrong',
          error: {
            name: error.name,
            message: error.message,
            // details: (error as any).meta || 'No additional details',
          },
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: 'Something went wrong',
        error: {
          name: 'UnknownError',
          message: 'An unknown error occurred',
          details: 'No additional details',
        },
      },
      { status: 500 }
    );
  }
}
