/*
  Warnings:

  - You are about to drop the column `id_user` on the `work_time` table. All the data in the column will be lost.
  - Made the column `login` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `work_time` table without a default value. This is not possible if the table is not empty.
  - Made the column `begin_date` on table `work_time` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `work_time` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `work_time` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "work_time" DROP CONSTRAINT "user";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "login" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "work_time" DROP COLUMN "id_user",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "begin_date" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "work_time" ADD CONSTRAINT "user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
