import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canReadRequest } from "@/lib/access";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Connexion requise." }, { status: 401 });
  }
  const { id } = await context.params;
  const piece = await prisma.attachment.findUnique({
    where: { id },
    include: { request: true },
  });
  if (!piece) {
    return NextResponse.json({ message: "Pièce introuvable." }, { status: 404 });
  }
  const allowed = canReadRequest({
    role: session.user.role,
    userId: session.user.id,
    serviceId: session.user.serviceId,
    demandeurId: piece.request.demandeurId,
    requestServiceId: piece.request.serviceId,
  });
  if (!allowed) {
    return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
  }

  const filePath = path.join(process.cwd(), "uploads", piece.storedName);
  const data = await readFile(filePath);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": piece.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(piece.filename)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
