-- CreateEnum
CREATE TYPE "CollectionVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "type" "CollectionVisibility" NOT NULL DEFAULT 'PUBLIC';
