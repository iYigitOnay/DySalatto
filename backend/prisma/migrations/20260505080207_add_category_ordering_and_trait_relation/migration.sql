-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_CategoryToTraitGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToTraitGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToTraitGroup_B_index" ON "_CategoryToTraitGroup"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToTraitGroup" ADD CONSTRAINT "_CategoryToTraitGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTraitGroup" ADD CONSTRAINT "_CategoryToTraitGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "TraitGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
