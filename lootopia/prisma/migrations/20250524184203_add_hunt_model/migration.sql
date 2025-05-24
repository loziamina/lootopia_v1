-- CreateTable
CREATE TABLE "Hunt" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "rewards" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,

    CONSTRAINT "Hunt_pkey" PRIMARY KEY ("id")
);
