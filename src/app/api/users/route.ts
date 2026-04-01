import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

type ProfileUpdatePayload = {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  profession?: string;
  wilaya?: string;
  region?: string;
  address?: string;
  licenseNumber?: string;
  licenseType?: string;
  licenseIssueDate?: string;
  secondaryDrivers?: string[];
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role || "USER",
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as ProfileUpdatePayload;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: body.name ?? null,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender ?? null,
        phone: body.phone ?? null,
        profession: body.profession ?? null,
        wilaya: body.wilaya ?? null,
        region: body.region ?? null,
        address: body.address ?? null,
        licenseNumber: body.licenseNumber ?? null,
        licenseType: body.licenseType ?? null,
        licenseIssueDate: body.licenseIssueDate
          ? new Date(body.licenseIssueDate)
          : null,
        secondaryDrivers: body.secondaryDrivers ?? [],
      },
      select: {
        id: true,
        email: true,
        name: true,
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

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
