/*
  Warnings:

  - You are about to drop the column `birthDay` on the `Person` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "birthDay",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL;
