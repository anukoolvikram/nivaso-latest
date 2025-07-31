/*
  Warnings:

  - You are about to drop the `_NoticeTags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_NoticeTags" DROP CONSTRAINT "_NoticeTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_NoticeTags" DROP CONSTRAINT "_NoticeTags_B_fkey";

-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "_NoticeTags";
