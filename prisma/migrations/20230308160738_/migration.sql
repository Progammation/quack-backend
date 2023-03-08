/*
  Warnings:

  - You are about to drop the `SharePrivateCollectionWith` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SharePrivateCollectionWith" DROP CONSTRAINT "SharePrivateCollectionWith_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "SharePrivateCollectionWith" DROP CONSTRAINT "SharePrivateCollectionWith_sharedWithId_fkey";

-- DropTable
DROP TABLE "SharePrivateCollectionWith";

-- CreateTable
CREATE TABLE "PrivateCollectionSharedWith" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "sharedWithId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivateCollectionSharedWith_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrivateCollectionSharedWith" ADD CONSTRAINT "PrivateCollectionSharedWith_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateCollectionSharedWith" ADD CONSTRAINT "PrivateCollectionSharedWith_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
