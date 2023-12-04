-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_userId_fkey";

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
