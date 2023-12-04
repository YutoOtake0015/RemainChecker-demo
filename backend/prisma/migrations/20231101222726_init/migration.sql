-- CreateTable
CREATE TABLE "AgerageLife" (
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "year" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AgerageLife_sex_year_key" ON "AgerageLife"("sex", "year");
