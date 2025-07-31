/*
  Warnings:

  - A unique constraint covering the columns `[resident_id,option_id]` on the table `PollVote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PollVote_option_id_key";

-- DropIndex
DROP INDEX "PollVote_resident_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "PollVote_resident_id_option_id_key" ON "PollVote"("resident_id", "option_id");
