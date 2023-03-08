-- CreateTable
CREATE TABLE "SharePrivateCollectionWith" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "sharedWithId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharePrivateCollectionWith_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SharePrivateCollectionWith" ADD CONSTRAINT "SharePrivateCollectionWith_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharePrivateCollectionWith" ADD CONSTRAINT "SharePrivateCollectionWith_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
