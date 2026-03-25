import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

// DELETE: Remove a user by ID (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

// PATCH: Update user role (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { role } = body;

  if (!role || !['USER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role value' }, { status: 400 });
  }

  try {
    const updated = await db.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PATCH user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
