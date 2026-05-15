/*
  Warnings:

  - You are about to drop the column `passwprdResetCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwprdResetCode",
ADD COLUMN     "passwordResetCode" TEXT;
