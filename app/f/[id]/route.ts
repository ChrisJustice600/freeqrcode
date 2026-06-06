import { readFile } from "node:fs/promises"
import { NextResponse } from "next/server"

import { getStoredFile, getStoredFilePath } from "@/lib/storage/files"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const entry = await getStoredFile(id)

  if (!entry) {
    return NextResponse.json({ error: "Fichier introuvable ou expiré" }, { status: 404 })
  }

  const filePath = await getStoredFilePath(id)
  if (!filePath) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 })
  }

  const buffer = await readFile(filePath)

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": entry.mimeType,
      "Content-Disposition": `inline; filename="${entry.originalName}"`,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
