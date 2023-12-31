-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "registry" TEXT NOT NULL,
    "subscribe" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "lastPay" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "ban" BOOLEAN NOT NULL,
    "banDate" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Password" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "media" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "button" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_mode_key" ON "User"("mode");

-- CreateIndex
CREATE UNIQUE INDEX "User_ban_key" ON "User"("ban");

-- CreateIndex
CREATE UNIQUE INDEX "Password_password_key" ON "Password"("password");
