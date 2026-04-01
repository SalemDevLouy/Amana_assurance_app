import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/lib/db";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PATCH(req: Request, { params }: { params: { groupId: string } }) {
  const session = await ensureAdmin();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, title, description, inputType, mandatory } = await req.json();

    if (!title || !key) {
      return Response.json({ error: "Titre et clé requis" }, { status: 400 });
    }

    const validInputTypes = ["CHECKBOX", "SELECTGROUP"];
    if (inputType && !validInputTypes.includes(inputType.toUpperCase())) {
      return Response.json({ error: "Type invalide" }, { status: 400 });
    }

    const group = await prisma.guaranteeGroup.findUnique({
      where: { id: params.groupId },
    });

    if (!group) {
      return Response.json({ error: "Groupe non trouvé" }, { status: 404 });
    }

    const updatedGroup = await prisma.guaranteeGroup.update({
      where: { id: params.groupId },
      data: {
        key,
        title,
        description: description || null,
        inputType: inputType?.toUpperCase() || group.inputType,
        mandatory: typeof mandatory === "boolean" ? mandatory : group.mandatory,
      },
    });

    return Response.json({
      id: updatedGroup.id,
      key: updatedGroup.key,
      title: updatedGroup.title,
      description: updatedGroup.description,
      inputType: updatedGroup.inputType,
      mandatory: updatedGroup.mandatory,
    });
  } catch (error) {
    console.error("Error updating group:", error);
    return Response.json({ error: "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { groupId: string } }) {
  const session = await ensureAdmin();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const group = await prisma.guaranteeGroup.findUnique({
      where: { id: params.groupId },
      include: { options: true },
    });

    if (!group) {
      return Response.json({ error: "Groupe non trouvé" }, { status: 404 });
    }

    // Delete the group and its options
    await prisma.guaranteeOption.deleteMany({
      where: { groupId: params.groupId },
    });

    await prisma.guaranteeGroup.delete({
      where: { id: params.groupId },
    });

    return Response.json({ message: "Groupe supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting group:", error);
    return Response.json({ error: "Failed to delete group" }, { status: 500 });
  }
}
