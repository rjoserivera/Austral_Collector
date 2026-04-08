-- SQL Migration: Add hashtag support and imagenes_extra column
-- Run this in phpMyAdmin or MySQL CLI against austral_collector_db

USE austral_collector_db;

-- Add imagenes_extra column to posts (stores JSON array of extra image URLs)
ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS imagenes_extra JSON NULL AFTER imagen_url;

-- Create hashtags table
CREATE TABLE IF NOT EXISTS hashtags (
    id     INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create pivot table linking posts ↔ hashtags
CREATE TABLE IF NOT EXISTS post_hashtags (
    post_id    INT NOT NULL,
    hashtag_id INT NOT NULL,
    PRIMARY KEY (post_id, hashtag_id),
    FOREIGN KEY (post_id)    REFERENCES posts(id)    ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
