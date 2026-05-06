-- AlterTable
ALTER TABLE "IngredientStep" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "IngredientStep" ADD CONSTRAINT "IngredientStep_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "IngredientCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
