import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/app/lib/authOptions";
import { serializeUser } from "./_lib";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const session = await ensureAdmin();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        profession: true,
        wilaya: true,
        region: true,
        address: true,
        licenseNumber: true,
        licenseType: true,
        licenseIssueDate: true,
        secondaryDrivers: true,
      },
    });

    const serializedUsers = users.map((user) => serializeUser(user));
    const totalUsers = serializedUsers.length;
    const admins = serializedUsers.filter((user) => user.role === "ADMIN").length;
    const averageCompletion =
      totalUsers === 0
        ? 0
        : Math.round(
            serializedUsers.reduce((sum, user) => sum + user.profileCompletion, 0) / totalUsers
          );

    return NextResponse.json(
      {
        users: serializedUsers,
        summary: {
          totalUsers,
          admins,
          averageCompletion,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
