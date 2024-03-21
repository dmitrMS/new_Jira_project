-- AlterTable
ALTER TABLE "user" ADD COLUMN     "team_id" INTEGER;

-- AlterTable
ALTER TABLE "work_time" ADD COLUMN     "task_name" VARCHAR,
ALTER COLUMN "task_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "team" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
