-- DropIndex
DROP INDEX "Students_class_idx";

-- DropIndex
DROP INDEX "Subjects_class_idx";

-- AlterTable
ALTER TABLE "Marks" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Subjects" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Students_class_isDelete_idx" ON "Students"("class", "isDelete");

-- CreateIndex
CREATE INDEX "Subjects_class_isDelete_idx" ON "Subjects"("class", "isDelete");
