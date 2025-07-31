-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_blog_id_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_complaint_id_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_notice_id_fkey";

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "flat_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "Flat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
