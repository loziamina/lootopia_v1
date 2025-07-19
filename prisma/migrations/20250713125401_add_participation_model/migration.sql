-- CreateTable
CREATE TABLE "Participation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "huntId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participation_userId_huntId_key" ON "Participation"("userId", "huntId");

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_huntId_fkey" FOREIGN KEY ("huntId") REFERENCES "TreasureHunt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
