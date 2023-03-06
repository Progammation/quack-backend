-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "ViewCollection" DROP CONSTRAINT "ViewCollection_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "ViewLink" DROP CONSTRAINT "ViewLink_linkId_fkey";

-- AddForeignKey
ALTER TABLE "ViewCollection" ADD CONSTRAINT "ViewCollection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewLink" ADD CONSTRAINT "ViewLink_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
