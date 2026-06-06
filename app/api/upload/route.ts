import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"

import { saveUploadedFile } from "@/lib/storage/files"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    const id = randomUUID().slice(0, 12)
    await saveUploadedFile(file, id)

    const origin = new URL(request.url).origin
    const url = `${origin}/f/${id}`

    return NextResponse.json({ id, url })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erreur lors de l'upload",
      },
      { status: 400 }
    )
  }
}
