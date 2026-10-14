-- ==============================================================================
-- CampusFind: College Lost & Found Portal - Database Schema & Sample Dataset
-- Target Database: MySQL 8.0+
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `campusfind_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `campusfind_db`;

-- Drop Tables in reverse dependency order
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `return_records`;
DROP TABLE IF EXISTS `match_suggestions`;
DROP TABLE IF EXISTS `claims`;
DROP TABLE IF EXISTS `item_images`;
DROP TABLE IF EXISTS `item_reports`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. Table: users
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20),
  `college_id` VARCHAR(50),
  `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_STUDENT',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 2. Table: item_reports
-- ------------------------------------------------------------------------------
CREATE TABLE `item_reports` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `type` VARCHAR(10) NOT NULL, -- 'LOST' or 'FOUND'
  `item_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `colour` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `unique_marks` TEXT,
  `location` VARCHAR(150) NOT NULL,
  `event_date` DATE NOT NULL,
  `contact_preference` VARCHAR(50),
  `item_held_at` VARCHAR(100),
  `status` VARCHAR(30) NOT NULL DEFAULT 'OPEN',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_item_reports_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 3. Table: item_images
-- ------------------------------------------------------------------------------
CREATE TABLE `item_images` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `item_report_id` BIGINT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `is_primary` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_item_images_report` FOREIGN KEY (`item_report_id`) REFERENCES `item_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 4. Table: claims
-- ------------------------------------------------------------------------------
CREATE TABLE `claims` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `found_item_id` BIGINT NOT NULL,
  `claimant_id` BIGINT NOT NULL,
  `claim_description` TEXT NOT NULL,
  `private_ownership_proof` TEXT NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  `admin_notes` TEXT,
  `verified_by_user_id` BIGINT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_claims_found_item` FOREIGN KEY (`found_item_id`) REFERENCES `item_reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_claims_claimant` FOREIGN KEY (`claimant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_claims_verifier` FOREIGN KEY (`verified_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 5. Table: match_suggestions
-- ------------------------------------------------------------------------------
CREATE TABLE `match_suggestions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lost_item_id` BIGINT NOT NULL,
  `found_item_id` BIGINT NOT NULL,
  `match_score` DOUBLE NOT NULL,
  `match_reason` TEXT,
  `status` VARCHAR(30) NOT NULL DEFAULT 'SUGGESTED',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_match_lost_item` FOREIGN KEY (`lost_item_id`) REFERENCES `item_reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_match_found_item` FOREIGN KEY (`found_item_id`) REFERENCES `item_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 6. Table: return_records
-- ------------------------------------------------------------------------------
CREATE TABLE `return_records` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `claim_id` BIGINT NOT NULL UNIQUE,
  `item_report_id` BIGINT NOT NULL,
  `received_by_user_id` BIGINT NOT NULL,
  `returned_by_user_id` BIGINT NOT NULL,
  `return_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `handover_location` VARCHAR(150) NOT NULL,
  `verification_method` VARCHAR(100) NOT NULL,
  `remarks` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_return_claim` FOREIGN KEY (`claim_id`) REFERENCES `claims` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_item` FOREIGN KEY (`item_report_id`) REFERENCES `item_reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_receiver` FOREIGN KEY (`received_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_giver` FOREIGN KEY (`returned_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 7. Table: notifications
-- ------------------------------------------------------------------------------
CREATE TABLE `notifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `related_item_id` BIGINT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- SAMPLE DATA FOR DEMO & TESTING
-- Passwords below are BCrypt encoded for 'password123':
-- $2a$10$e7f0oXkCvyX2j1uGkP4fOeKqI4v3uR7KzD8.L5hE6n1m.oQ2r3uWa
-- ==============================================================================

-- 1. Insert Users (Admin & Students)
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `phone_number`, `college_id`, `role`, `created_at`) VALUES
(1, 'Admin Officer Sharma', 'admin@campus.edu', '$2a$10$wNq2YgqGZ2s7c4uQ0rZ5teR1uK8VzU7L5oN3r9K2m1Q2s4uWa1bCe', '+91 9876543210', 'ADM-2024-001', 'ROLE_ADMIN', NOW()),
(2, 'Aarav Patel', 'aarav.patel@campus.edu', '$2a$10$wNq2YgqGZ2s7c4uQ0rZ5teR1uK8VzU7L5oN3r9K2m1Q2s4uWa1bCe', '+91 9811122233', '21BCS10045', 'ROLE_STUDENT', NOW()),
(3, 'Sneha Reddy', 'sneha.reddy@campus.edu', '$2a$10$wNq2YgqGZ2s7c4uQ0rZ5teR1uK8VzU7L5oN3r9K2m1Q2s4uWa1bCe', '+91 9822233344', '22BCS10892', 'ROLE_STUDENT', NOW()),
(4, 'Rohan Verma', 'rohan.verma@campus.edu', '$2a$10$wNq2YgqGZ2s7c4uQ0rZ5teR1uK8VzU7L5oN3r9K2m1Q2s4uWa1bCe', '+91 9833344455', '20BME10012', 'ROLE_STUDENT', NOW());

-- 2. Insert Lost Item Reports
INSERT INTO `item_reports` (`id`, `user_id`, `type`, `item_name`, `category`, `colour`, `description`, `unique_marks`, `location`, `event_date`, `contact_preference`, `item_held_at`, `status`, `created_at`) VALUES
(1, 2, 'LOST', 'Apple AirPods Pro (2nd Gen)', 'Electronics', 'White', 'Lost inside the white MagSafe charging case near 2nd floor reading hall.', 'Small Batman sticker on back of charging case', 'Central Library, 2nd Floor', '2026-08-20', 'Email', NULL, 'POSSIBLE_MATCH', NOW()),
(2, 3, 'LOST', 'Blue Wildcraft Backpack', 'Bags & Backpacks', 'Navy Blue', 'Contains Engineering Physics textbook, scientific calculator (Casio 991EX), and class notebooks.', 'Keychain with red metal guitar tag', 'Block A Cafeteria', '2026-08-21', 'Phone', NULL, 'OPEN', NOW()),
(3, 4, 'LOST', 'Student ID Card & Metro Pass', 'ID Cards / Documents', 'Silver / Blue', 'Campus ID Card for Rohan Verma (20BME10012) in transparent hard lanyard.', 'Yellow thread knotted at top of lanyard clip', 'Sports Complex Ground', '2026-08-19', 'Campus Portal', NULL, 'CLAIM_REQUESTED', NOW());

-- 3. Insert Found Item Reports
INSERT INTO `item_reports` (`id`, `user_id`, `type`, `item_name`, `category`, `colour`, `description`, `unique_marks`, `location`, `event_date`, `contact_preference`, `item_held_at`, `status`, `created_at`) VALUES
(4, 3, 'FOUND', 'White Wireless Earbuds in Case', 'Electronics', 'White', 'Found Apple AirPods in charging case on reading desk row 4.', NULL, 'Central Library, 2nd Floor', '2026-08-20', 'Campus Portal', 'Admin Office', 'POSSIBLE_MATCH', NOW()),
(5, 4, 'FOUND', 'Campus Student ID Card', 'ID Cards / Documents', 'Silver / Blue', 'Student ID card with mechanical branch tag found near badminton court bench.', NULL, 'Sports Complex Ground', '2026-08-19', 'Campus Portal', 'Security Office', 'CLAIMED', NOW()),
(6, 2, 'FOUND', 'Titan Metal Analog Watch', 'Clothing & Accessories', 'Silver', 'Found on the washroom counter near CS department labs.', NULL, 'Block B, 3rd Floor', '2026-08-22', 'Campus Portal', 'Security Office', 'OPEN', NOW());

-- 4. Insert Item Images
INSERT INTO `item_images` (`id`, `item_report_id`, `image_url`, `file_name`, `is_primary`) VALUES
(1, 1, '/uploads/sample-airpods.jpg', 'sample-airpods.jpg', TRUE),
(2, 2, '/uploads/sample-backpack.jpg', 'sample-backpack.jpg', TRUE),
(3, 3, '/uploads/sample-idcard.jpg', 'sample-idcard.jpg', TRUE),
(4, 4, '/uploads/sample-airpods-found.jpg', 'sample-airpods-found.jpg', TRUE),
(5, 5, '/uploads/sample-idcard-found.jpg', 'sample-idcard-found.jpg', TRUE),
(6, 6, '/uploads/sample-watch.jpg', 'sample-watch.jpg', TRUE);

-- 5. Insert Match Suggestions
INSERT INTO `match_suggestions` (`id`, `lost_item_id`, `found_item_id`, `match_score`, `match_reason`, `status`, `created_at`) VALUES
(1, 1, 4, 92.5, 'Exact category match (Electronics), matching white colour, same location (Central Library 2nd Floor), matching date (2026-08-20)', 'SUGGESTED', NOW()),
(2, 3, 5, 88.0, 'Exact category match (ID Cards / Documents), matching location (Sports Complex), matching event date (2026-08-19)', 'CONFIRMED_BY_ADMIN', NOW());

-- 6. Insert Claims
INSERT INTO `claims` (`id`, `found_item_id`, `claimant_id`, `claim_description`, `private_ownership_proof`, `status`, `admin_notes`, `verified_by_user_id`, `created_at`) VALUES
(1, 5, 4, 'This is my college ID card and metro smart pass that fell out of my gym bag.', 'The back of the ID card has a handwritten parent phone number ending in 4455, and the metro card serial ends with 8812.', 'APPROVED', 'ID credentials verified against student portal database. Approved for pickup at Security Desk.', 1, NOW()),
(2, 4, 2, 'These are my AirPods Pro that I left on desk #14 while studying for midterms.', 'Case has a small black bat logo sticker on the bottom rear hinge; right earbud has a tiny scratch on the stem.', 'PENDING', NULL, NULL, NOW());

-- 7. Insert Return Records
INSERT INTO `return_records` (`id`, `claim_id`, `item_report_id`, `received_by_user_id`, `returned_by_user_id`, `return_date`, `handover_location`, `verification_method`, `remarks`, `created_at`) VALUES
(1, 1, 5, 4, 1, NOW(), 'Security Main Gate Office', 'Physical College ID & Signature Check', 'Student signed the return register and physically demonstrated biometric match.', NOW());

-- 8. Insert Notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `related_item_id`, `created_at`) VALUES
(1, 2, 'Potential Match Found!', 'A found item report matching your lost "Apple AirPods Pro" was posted at Central Library.', 'MATCH_FOUND', FALSE, 4, NOW()),
(2, 4, 'Claim Approved!', 'Your ownership claim for "Campus Student ID Card" has been approved by Admin Officer Sharma.', 'CLAIM_STATUS', FALSE, 5, NOW()),
(3, 4, 'Item Returned Successfully', 'Your item "Campus Student ID Card" has been handed over at Security Main Gate Office.', 'ITEM_RETURNED', TRUE, 5, NOW());
