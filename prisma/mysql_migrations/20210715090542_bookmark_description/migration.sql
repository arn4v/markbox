-- AlterTable
ALTER TABLE `bookmarks` ADD COLUMN `description` VARCHAR(1000) NOT NULL DEFAULT '',
    MODIFY `title` VARCHAR(500) NOT NULL;
