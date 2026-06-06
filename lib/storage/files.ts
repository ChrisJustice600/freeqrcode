import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

export interface StoredFile {
  id: string
  originalName: string
  mimeType: string
  size: number
  createdAt: number
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const META_FILE = path.join(UPLOAD_DIR, "meta.json")
const MAX_FILE_SIZE = 10 * 1024 * 1024
const TTL_MS = 7 * 24 * 60 * 60 * 1000

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true })
}

async function readMeta(): Promise<Record<string, StoredFile>> {
  await ensureUploadDir()
  try {
    const raw = await readFile(META_FILE, "utf-8")
    return JSON.parse(raw) as Record<string, StoredFile>
  } catch {
    return {}
  }
}

async function writeMeta(meta: Record<string, StoredFile>) {
  await ensureUploadDir()
  await writeFile(META_FILE, JSON.stringify(meta, null, 2), "utf-8")
}

export function isAllowedMimeType(mimeType: string) {
  return ALLOWED_TYPES.has(mimeType)
}

export function getMaxFileSize() {
  return MAX_FILE_SIZE
}

export async function saveUploadedFile(
  file: File,
  id: string
): Promise<StoredFile> {
  if (!isAllowedMimeType(file.type)) {
    throw new Error("Type de fichier non autorisé")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Fichier trop volumineux (max 10 Mo)")
  }

  await ensureUploadDir()
  await cleanupExpiredFiles()

  const extension = path.extname(file.name) || ""
  const storedName = `${id}${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await writeFile(path.join(UPLOAD_DIR, storedName), buffer)

  const entry: StoredFile = {
    id,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    createdAt: Date.now(),
  }

  const meta = await readMeta()
  meta[id] = entry
  await writeMeta(meta)

  return entry
}

export async function getStoredFile(id: string): Promise<StoredFile | null> {
  const meta = await readMeta()
  const entry = meta[id]
  if (!entry) return null

  if (Date.now() - entry.createdAt > TTL_MS) {
    return null
  }

  return entry
}

export async function getStoredFilePath(id: string): Promise<string | null> {
  const entry = await getStoredFile(id)
  if (!entry) return null
  return findFilePathById(id)
}

async function findFilePathById(id: string): Promise<string | null> {
  await ensureUploadDir()
  const files = await import("node:fs/promises").then((fs) => fs.readdir(UPLOAD_DIR))
  const match = files.find((name) => name.startsWith(id))
  return match ? path.join(UPLOAD_DIR, match) : null
}

export async function cleanupExpiredFiles() {
  const meta = await readMeta()
  const now = Date.now()
  let changed = false

  for (const [id, entry] of Object.entries(meta)) {
    if (now - entry.createdAt > TTL_MS) {
      delete meta[id]
      changed = true

      const filePath = await findFilePathById(id)
      if (filePath) {
        await import("node:fs/promises")
          .then((fs) => fs.unlink(filePath))
          .catch(() => undefined)
      }
    }
  }

  if (changed) {
    await writeMeta(meta)
  }
}
