/*
  Warnings:

  - You are about to drop the column `user_id` on the `work_time` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "work_time" DROP CONSTRAINT "user";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "login" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "work_time" DROP COLUMN "user_id",
ADD COLUMN     "id_user" INTEGER,
ALTER COLUMN "begin_date" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "work_time" ADD CONSTRAINT "user" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
