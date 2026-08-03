ALTER TABLE "Company"
ADD COLUMN "phones" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "emails" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "googleMapsUrl" TEXT,
ADD COLUMN "mission" TEXT,
ADD COLUMN "vision" TEXT,
ADD COLUMN "about" TEXT,
ADD COLUMN "socialLinks" JSONB;

UPDATE "Company"
SET "phones" = CASE
    WHEN "phone" IS NULL OR "phone" = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY["phone"]
  END,
  "emails" = CASE
    WHEN "email" IS NULL OR "email" = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY["email"]
  END;
