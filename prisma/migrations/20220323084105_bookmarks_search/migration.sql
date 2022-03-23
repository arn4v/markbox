-- CreateIndex
CREATE FULLTEXT INDEX `bookmarks_title_idx` ON `bookmarks`(`title`);

-- CreateIndex
CREATE FULLTEXT INDEX `bookmarks_url_idx` ON `bookmarks`(`url`);

-- CreateIndex
CREATE FULLTEXT INDEX `bookmarks_title_url_idx` ON `bookmarks`(`title`, `url`);

-- CreateIndex
CREATE FULLTEXT INDEX `tags_name_idx` ON `tags`(`name`);
