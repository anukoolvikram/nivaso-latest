/*
  Warnings:

  - You are about to drop the `SocietyDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SocietyDocument" DROP CONSTRAINT "SocietyDocument_society_id_fkey";

-- DropTable
DROP TABLE "SocietyDocument";
