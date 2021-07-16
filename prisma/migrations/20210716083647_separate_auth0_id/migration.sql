/*
  Warnings:

  - A unique constraint covering the columns `[auth0_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `auth0_id` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `users.auth0_id_unique` ON `users`(`auth0_id`);
