-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Genel',
ALTER COLUMN "price" DROP DEFAULT;
