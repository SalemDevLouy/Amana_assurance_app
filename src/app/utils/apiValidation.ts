import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import { NextResponse } from 'next/server';
// Validate authenticated API session

async function apiValidation() {
const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
export default apiValidation
  