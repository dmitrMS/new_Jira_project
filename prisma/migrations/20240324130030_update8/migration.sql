/*
  Warnings:

  - Added the required column `data_id` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "data_id" INTEGER NOT NULL;
