/*
  Warnings:

  - Added the required column `notice_id` to the `PollVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PollVote" ADD COLUMN     "notice_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
