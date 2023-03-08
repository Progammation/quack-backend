/*
  Warnings:

  - You are about to drop the `PrivateCollectionSharedWith` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PrivateCollectionSharedWith" DROP CONSTRAINT "PrivateCollectionSharedWith_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "PrivateCollectionSharedWith" DROP CONSTRAINT "PrivateCollectionSharedWith_sharedWithId_fkey";

-- DropTable
DROP TABLE "PrivateCollectionSharedWith";

-- CreateTable
CREATE TABLE "CollectionSharedWith" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "sharedWithId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionSharedWith_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionSharedWith" ADD CONSTRAINT "CollectionSharedWith_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSharedWith" ADD CONSTRAINT "CollectionSharedWith_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
