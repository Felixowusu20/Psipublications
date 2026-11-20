-- Supplementary materials bound to a manuscript / published article
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "productionSupplementary" TEXT;
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "productionSupplementaryUrl" TEXT;
ALTER TABLE "PublishedArticle" ADD COLUMN IF NOT EXISTS "supplementaryHtml" TEXT;
ALTER TABLE "PublishedArticle" ADD COLUMN IF NOT EXISTS "supplementaryUrl" TEXT;
