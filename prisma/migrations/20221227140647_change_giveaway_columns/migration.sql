/*
  Warnings:

  - You are about to drop the column `number` on the `Giveaway` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Giveaway" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "reference" TEXT NOT NULL,
    "status" TEXT,
    "winnerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Giveaway_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Giveaway" ("createdAt", "endDate", "id", "reference", "startDate", "status", "updatedAt", "winnerId") SELECT "createdAt", "endDate", "id", "reference", "startDate", "status", "updatedAt", "winnerId" FROM "Giveaway";
DROP TABLE "Giveaway";
ALTER TABLE "new_Giveaway" RENAME TO "Giveaway";
CREATE UNIQUE INDEX "Giveaway_reference_key" ON "Giveaway"("reference");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
