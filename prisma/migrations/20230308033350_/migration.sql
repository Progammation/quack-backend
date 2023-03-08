/*
  Warnings:

  - You are about to drop the column `type` on the `Collection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "type",
ADD COLUMN     "visibility" "CollectionVisibility" NOT NULL DEFAULT 'PUBLIC';
