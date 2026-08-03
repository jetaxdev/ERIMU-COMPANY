CREATE TYPE "PropertyStatus_new" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'COMING_SOON');

ALTER TABLE "Property"
ADD COLUMN "county" TEXT,
ADD COLUMN "town" TEXT,
ADD COLUMN "googleMapsUrl" TEXT,
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION,
ADD COLUMN "featuredImageId" TEXT;

ALTER TABLE "PropertyImage"
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Property"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "PropertyStatus_new"
USING (
  CASE
    WHEN "status"::text = 'DRAFT' THEN 'COMING_SOON'::"PropertyStatus_new"
    WHEN "status"::text = 'PUBLISHED' THEN 'AVAILABLE'::"PropertyStatus_new"
    WHEN "status"::text = 'ARCHIVED' THEN 'RESERVED'::"PropertyStatus_new"
    WHEN "status"::text = 'SOLD' THEN 'SOLD'::"PropertyStatus_new"
    ELSE 'COMING_SOON'::"PropertyStatus_new"
  END
);

DROP TYPE "PropertyStatus";
ALTER TYPE "PropertyStatus_new" RENAME TO "PropertyStatus";
ALTER TABLE "Property" ALTER COLUMN "status" SET DEFAULT 'COMING_SOON';

UPDATE "PropertyImage" pi
SET "sortOrder" = image_order.rn - 1
FROM (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "propertyId" ORDER BY "createdAt", "id") AS rn
  FROM "PropertyImage"
) AS image_order
WHERE image_order."id" = pi."id";

CREATE UNIQUE INDEX IF NOT EXISTS "PropertyAmenity_propertyId_name_key"
ON "PropertyAmenity"("propertyId", "name");

ALTER TABLE "Property"
ADD CONSTRAINT "Property_featuredImageId_fkey"
FOREIGN KEY ("featuredImageId") REFERENCES "PropertyImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
