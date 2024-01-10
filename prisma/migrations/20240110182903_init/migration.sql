-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "login" VARCHAR,
    "password" VARCHAR,
    "created_at" DATE,
    "updated_at" DATE,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_time" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER,
    "begin_date" DATE,
    "end_date" DATE,
    "created_at" DATE,
    "updated_at" DATE,

    CONSTRAINT "work_time_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "work_time" ADD CONSTRAINT "user" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
