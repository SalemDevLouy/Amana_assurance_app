import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/lib/db";

type RouteContext = {
  params: Promise<{ groupId: string }>;
};

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { groupId } = await context.params;
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, title, description, inputType, mandatory } = await req.json();

    if (!title || !key) {
      return NextResponse.json({ error: "Titre et clé requis" }, { status: 400 });
    }

    const validInputTypes = ["CHECKBOX", "SELECTGROUP"];
    if (inputType && !validInputTypes.includes(inputType.toUpperCase())) {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }

    const group = await prisma.guaranteeGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Groupe non trouvé" }, { status: 404 });
    }

    const updatedGroup = await prisma.guaranteeGroup.update({
      where: { id: groupId },
      data: {
        key,
        title,
        description: description || null,
        inputType: inputType?.toUpperCase() || group.inputType,
        mandatory: typeof mandatory === "boolean" ? mandatory : group.mandatory,
      },
    });

    return NextResponse.json({
      id: updatedGroup.id,
      key: updatedGroup.key,
      title: updatedGroup.title,
      description: updatedGroup.description,
      inputType: updatedGroup.inputType,
      mandatory: updatedGroup.mandatory,
    });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { groupId } = await context.params;
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const group = await prisma.guaranteeGroup.findUnique({
      where: { id: groupId },
      include: { options: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Groupe non trouvé" }, { status: 404 });
    }

    // Delete the group and its options
    await prisma.guaranteeOption.deleteMany({
      where: { groupId: groupId },
    });

    await prisma.guaranteeGroup.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ message: "Groupe supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
  }
}
