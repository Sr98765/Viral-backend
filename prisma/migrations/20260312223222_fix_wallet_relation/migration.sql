/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "updatedAt";
