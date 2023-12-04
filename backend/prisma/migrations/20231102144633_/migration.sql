/*
  Warnings:

  - You are about to drop the `AgerageLife` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AgerageLife";

-- CreateTable
CREATE TABLE "AverageLife" (
    "age" DOUBLE PRECISION NOT NULL,
    "sex" TEXT NOT NULL,
    "year" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AverageLife_sex_year_key" ON "AverageLife"("sex", "year");
