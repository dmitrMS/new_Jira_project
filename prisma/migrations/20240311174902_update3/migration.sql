/*
  Warnings:

  - You are about to drop the column `id_user` on the `work_time` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `work_time` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "work_time" DROP CONSTRAINT "user";

-- AlterTable
ALTER TABLE "work_time" DROP COLUMN "id_user",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "work_time" ADD CONSTRAINT "user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
