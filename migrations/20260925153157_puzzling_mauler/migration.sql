CREATE TABLE `wishlist_edit_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`wishlist_id` integer NOT NULL,
	`token_hash` text NOT NULL UNIQUE,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_wishlist_edit_sessions_wishlist_id_wishlists_id_fk` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists`(`id`) ON DELETE CASCADE
);
