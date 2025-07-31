-- CreateTable
CREATE TABLE "ComplaintResponse" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "complaint_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "ComplaintResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComplaintResponse" ADD CONSTRAINT "ComplaintResponse_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintResponse" ADD CONSTRAINT "ComplaintResponse_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
