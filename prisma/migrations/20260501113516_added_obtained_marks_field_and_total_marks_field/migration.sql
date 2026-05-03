/*
  Warnings:

  - Added the required column `totalMarks` to the `Marks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Marks" ADD COLUMN     "obtainedMarks" INTEGER,
ADD COLUMN     "totalMarks" INTEGER NOT NULL;
