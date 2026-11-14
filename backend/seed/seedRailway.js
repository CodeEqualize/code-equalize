/**
 * seedRailway.js
 *
 * Run once after Railway ChromaDB is deployed and accessible.
 *
 * Public endpoint (PowerShell):
 *   $env:CHROMA_HOST = "your-chroma.up.railway.app"
 *   $env:CHROMA_PORT = "443"
 *   node seed/seedRailway.js
 *
 * Private networking:
 *   $env:CHROMA_HOST = "your-chroma.railway.internal"
 *   $env:CHROMA_PORT = "8000"
 *   node seed/seedRailway.js
 */

const { ChromaClient } = require("chromadb");
const { DefaultEmbeddingFunction } = require("@chroma-core/default-embed");
const fs = require("fs");
const path = require("path");

const BACKUP_PATH = process.env.BACKUP_PATH ||
  "F:\\CODE-EQUALIZE-CHROMA-BACKUP\\code_errors_export_v2.json";

const CHROMA_HOST = process.env.CHROMA_HOST || "localhost";
const CHROMA_PORT = Number(process.env.CHROMA_PORT || 8001);

const COLLECTION_NAME = "code_errors";
const EXPECTED_COUNT = 252;
const BATCH_SIZE = 50;

async function seed() {
  // 1. Validate configuration
  if (!CHROMA_HOST || !Number.isInteger(CHROMA_PORT) ||
      CHROMA_PORT < 1 || CHROMA_PORT > 65535) {
    throw new Error("Invalid ChromaDB host or port configuration.");
  }

  // 2. Validate backup file
  const resolvedBackupPath = path.resolve(BACKUP_PATH);

  console.log(`[Seed] Reading backup: ${resolvedBackupPath}`);

  if (!fs.existsSync(resolvedBackupPath)) {
    throw new Error("Backup file not found. Migration aborted.");
  }

  const backup = JSON.parse(
    fs.readFileSync(resolvedBackupPath, "utf-8")
  );

  const { ids, documents, metadatas } = backup;

  // 3. Validate backup structure and record integrity
  if (
    backup.collection_name !== COLLECTION_NAME ||
    !Array.isArray(ids) ||
    !Array.isArray(documents) ||
    !Array.isArray(metadatas) ||
    ids.length !== EXPECTED_COUNT ||
    documents.length !== EXPECTED_COUNT ||
    metadatas.length !== EXPECTED_COUNT ||
    new Set(ids).size !== EXPECTED_COUNT ||
    ids.some(id => typeof id !== "string" || !id.trim()) ||
    documents.some(doc => typeof doc !== "string") ||
    metadatas.some(meta =>
      !meta || typeof meta !== "object" || Array.isArray(meta)
    )
  ) {
    throw new Error(
      `Backup validation failed. Expected ${EXPECTED_COUNT} valid, unique records.`
    );
  }

  console.log(`[Seed] Backup validated: ${ids.length} records.`);

  // 4. Connect to ChromaDB
  const ssl = CHROMA_PORT === 443;

  console.log(
    `[Seed] Connecting to ${ssl ? "https" : "http"}://${CHROMA_HOST}:${CHROMA_PORT}`
  );

  const client = new ChromaClient({
    host: CHROMA_HOST,
    port: CHROMA_PORT,
    ssl
  });

  // 5. Use the same embedding function as the backend
  const embeddingFunction = new DefaultEmbeddingFunction();

  // 6. Get or create the collection
  const collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: {
      description: "Programming Error Knowledge Base"
    },
    embeddingFunction
  });

  // 7. Require an empty destination to prevent duplicates
  const existing = await collection.count();

  if (existing !== 0) {
    throw new Error(
      `Destination collection already contains ${existing} records. ` +
      "Migration aborted to prevent duplicate or partial imports."
    );
  }

  console.log("[Seed] Destination collection is empty. Starting migration.");

  // 8. Insert records in batches
  let inserted = 0;

  for (let i = 0; i < EXPECTED_COUNT; i += BATCH_SIZE) {
    const end = Math.min(i + BATCH_SIZE, EXPECTED_COUNT);

    await collection.add({
      ids: ids.slice(i, end),
      documents: documents.slice(i, end),
      metadatas: metadatas.slice(i, end)
    });

    inserted = end;

    console.log(`[Seed] ${inserted}/${EXPECTED_COUNT} records inserted.`);
  }

  // 9. Verify final count
  const finalCount = await collection.count();

  if (finalCount !== EXPECTED_COUNT) {
    throw new Error(
      `Migration verification failed. Expected ${EXPECTED_COUNT}, found ${finalCount}.`
    );
  }

  console.log(
    `[Seed] SUCCESS! All ${finalCount} records migrated to Railway ChromaDB.`
  );
}

seed().catch(error => {
  console.error("[Seed] MIGRATION FAILED:", error.message);
  process.exitCode = 1;
});
