/*
  Warnings:

  - You are about to drop the `InvoiceNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InvoiceNote";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "number" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "totalValue" REAL NOT NULL,
    "luckyNumber" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "givewayId" TEXT,
    CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_givewayId_fkey" FOREIGN KEY ("givewayId") REFERENCES "Giveway" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_luckyNumber_key" ON "Invoice"("luckyNumber");
