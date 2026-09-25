CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`wish_id` integer NOT NULL UNIQUE,
	`name` text NOT NULL,
	`token_hash` text NOT NULL UNIQUE,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_reservations_wish_id_wishes_id_fk` FOREIGN KEY (`wish_id`) REFERENCES `wishes`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `wishes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`wishlist_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`url` text,
	`price` integer,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_wishes_wishlist_id_wishlists_id_fk` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`code` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`description` text,
	`edit_password_hash` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
