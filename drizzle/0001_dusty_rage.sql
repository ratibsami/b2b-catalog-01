CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameFa` varchar(255) NOT NULL,
	`descriptionEn` text,
	`descriptionFa` text,
	`slug` varchar(255) NOT NULL,
	`bannerUrl` text,
	`bannerKey` varchar(512),
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`titleEn` varchar(255),
	`titleFa` varchar(255),
	`contentEn` longtext,
	`contentFa` longtext,
	`type` enum('text','html','markdown') DEFAULT 'text',
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionEn` varchar(500) NOT NULL,
	`questionFa` varchar(500) NOT NULL,
	`answerEn` longtext NOT NULL,
	`answerFa` longtext NOT NULL,
	`category` varchar(100),
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int,
	`senderName` varchar(255) NOT NULL,
	`senderEmail` varchar(320) NOT NULL,
	`senderPhone` varchar(20),
	`companyName` varchar(255),
	`message` longtext NOT NULL,
	`inquiryType` enum('product_inquiry','general_contact','partnership') NOT NULL DEFAULT 'product_inquiry',
	`status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
	`adminNotes` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(512) NOT NULL,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameFa` varchar(255) NOT NULL,
	`descriptionEn` longtext,
	`descriptionFa` longtext,
	`slug` varchar(255) NOT NULL,
	`sku` varchar(100) NOT NULL,
	`price` decimal(12,2),
	`priceHidden` boolean DEFAULT false,
	`minOrderQuantity` int DEFAULT 1,
	`availability` enum('in_stock','limited','out_of_stock') NOT NULL DEFAULT 'in_stock',
	`featuredImage` text,
	`featuredImageKey` varchar(512),
	`specifications` longtext,
	`isActive` boolean DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
