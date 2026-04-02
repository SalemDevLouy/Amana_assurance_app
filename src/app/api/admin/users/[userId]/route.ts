import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import prisma from "@/lib/db";
import { authOptions } from "@/app/lib/authOptions";
import { serializeUserDetail } from "../_lib";

type UserUpdatePayload = {
  email?: string;
  name?: string;
  role?: "ADMIN" | "USER";
  dateOfBirth?: string | null;
  gender?: string | null;
  phone?: string | null;
  profession?: string | null;
  wilaya?: string | null;
  region?: string | null;
  address?: string | null;
  licenseNumber?: string | null;
  licenseType?: string | null;
  licenseIssueDate?: string | null;
  secondaryDrivers?: string[];
};

type RouteContext = {
  params: Promise<{ userId: string }>;
};

async function ensureAdmin() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return session;
}

async function loadUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
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
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const session = await ensureAdmin();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await context.params;
    const user = await loadUser(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: serializeUserDetail(user) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await ensureAdmin();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await context.params;
    const user = await loadUser(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await request.json()) as UserUpdatePayload;

    if (body.email && body.email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: body.email ?? user.email,
        name: body.name ?? null,
        role: body.role ? (body.role as Role) : user.role,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender ?? null,
        phone: body.phone ?? null,
        profession: body.profession ?? null,
        wilaya: body.wilaya ?? null,
        region: body.region ?? null,
        address: body.address ?? null,
        licenseNumber: body.licenseNumber ?? null,
        licenseType: body.licenseType ?? null,
        licenseIssueDate: body.licenseIssueDate ? new Date(body.licenseIssueDate) : null,
        secondaryDrivers: body.secondaryDrivers ?? [],
      },
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

    return NextResponse.json({ user: serializeUserDetail(updatedUser) }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await ensureAdmin();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await context.params;

    if (session.user.id === userId) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    const user = await loadUser(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
