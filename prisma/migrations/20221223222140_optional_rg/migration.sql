-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "rg" TEXT,
    "cellphone" TEXT NOT NULL,
    "cellphone_secondary" TEXT,
    "zipCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("birthDate", "cellphone", "cellphone_secondary", "city", "complement", "cpf", "createdAt", "email", "id", "name", "number", "password", "rg", "state", "street", "updatedAt", "zipCode") SELECT "birthDate", "cellphone", "cellphone_secondary", "city", "complement", "cpf", "createdAt", "email", "id", "name", "number", "password", "rg", "state", "street", "updatedAt", "zipCode" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_rg_key" ON "User"("rg");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
