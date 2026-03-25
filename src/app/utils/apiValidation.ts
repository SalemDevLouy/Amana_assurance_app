import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import { NextResponse } from 'next/server';
// GET: Fetch all BMC questions or filter by category

async function apiValidation() {
const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
export default apiValidation
  