CREATE TYPE "GalleryMediaType_new" AS ENUM ('IMAGE', 'VIDEO');

ALTER TABLE "Gallery"
ADD COLUMN "mediaType" "GalleryMediaType_new" NOT NULL DEFAULT 'IMAGE',
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN "mediaUrl" TEXT,
ADD COLUMN "thumbnailUrl" TEXT,
ADD COLUMN "duration" TEXT,
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

UPDATE "Gallery"
SET "mediaUrl" = COALESCE(NULLIF("imageUrl", ''), '');

ALTER TABLE "Gallery"
ALTER COLUMN "mediaUrl" SET NOT NULL,
ALTER COLUMN "mediaType" DROP DEFAULT;

DROP TYPE IF EXISTS "GalleryMediaType";
ALTER TYPE "GalleryMediaType_new" RENAME TO "GalleryMediaType";