-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: austral_collector_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `configuracion`
--

DROP TABLE IF EXISTS `configuracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configuracion` (
  `clave` varchar(50) NOT NULL,
  `valor` text DEFAULT NULL,
  PRIMARY KEY (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion`
--

LOCK TABLES `configuracion` WRITE;
/*!40000 ALTER TABLE `configuracion` DISABLE KEYS */;
INSERT INTO `configuracion` VALUES ('miembro_destacado','1'),('portafolio_comunidad','uploads/general/general_1776356002_199.jpg'),('portafolio_video_1','https://www.youtube.com/watch?v=jg5zCZc-7To&list=RDjg5zCZc-7To&start_radio=1'),('portafolio_video_2','https://www.youtube.com/watch?v=E0d2uEQJbXs&list=RDjg5zCZc-7To&index=2'),('portafolio_video_3','https://www.youtube.com/watch?v=RkkGHJUpJCw&list=RDjg5zCZc-7To&index=3'),('portafolio_video_4','https://www.youtube.com/watch?v=a4na2opArGY&list=RDjg5zCZc-7To&index=4'),('txt_cumple','Feliz cumplea├▒os a los presntes'),('txt_destacado',''),('video_destacado_1','4'),('video_destacado_2','5'),('video_destacado_3','1'),('video_destacado_4','3');
/*!40000 ALTER TABLE `configuracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destacado_mes`
--

DROP TABLE IF EXISTS `destacado_mes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `destacado_mes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `mes_anio` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `destacado_mes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destacado_mes`
--

LOCK TABLES `destacado_mes` WRITE;
/*!40000 ALTER TABLE `destacado_mes` DISABLE KEYS */;
INSERT INTO `destacado_mes` VALUES (1,1,'04-2026');
/*!40000 ALTER TABLE `destacado_mes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `fecha_display` varchar(100) NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (1,'Comic con 2026','3 al 5 julio','uploads/eventos/evento_69d92aa37c82b7.73237135.png','2026-04-09 00:40:10'),(2,'Hotweel 2026','18 y 19 julio','uploads/eventos/evento_69d92a96dd07a7.96125750.png','2026-04-09 19:49:40');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `galeria_portafolio`
--

DROP TABLE IF EXISTS `galeria_portafolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `galeria_portafolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) DEFAULT '',
  `imagen_url` varchar(500) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galeria_portafolio`
--

LOCK TABLES `galeria_portafolio` WRITE;
/*!40000 ALTER TABLE `galeria_portafolio` DISABLE KEYS */;
INSERT INTO `galeria_portafolio` VALUES (9,'','uploads/portafolio/portafolio_1776355185_329.jpg',1,'2026-04-16 15:59:45'),(10,'ishigo kurosaki','uploads/portafolio/portafolio_1776355202_296.jpg',2,'2026-04-16 16:00:02'),(11,'pixelart','uploads/portafolio/portafolio_1776355219_588.png',0,'2026-04-16 16:00:19'),(12,'origime','uploads/portafolio/portafolio_1776355254_760.jpg',3,'2026-04-16 16:00:54');
/*!40000 ALTER TABLE `galeria_portafolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hashtags`
--

DROP TABLE IF EXISTS `hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hashtags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hashtags`
--

LOCK TABLES `hashtags` WRITE;
/*!40000 ALTER TABLE `hashtags` DISABLE KEYS */;
INSERT INTO `hashtags` VALUES (6,'AnimeFigure'),(29,'Avengers'),(20,'Cosplay'),(17,'DisneyCosplay'),(31,'DoctorStrange'),(27,'EggAttack'),(1,'EternalSailorMoon'),(10,'FateGrandOrder'),(9,'FateSeries'),(26,'IronMan'),(8,'Jalter'),(11,'JalterCosplay'),(15,'JudyHopps'),(3,'MagicalGirl'),(28,'Marvel'),(14,'MarvelCosplay'),(12,'MilesMorales'),(18,'PowerRangers'),(21,'PowerRangersCosplay'),(19,'RedRanger'),(5,'SailorMoonBootleg'),(2,'SailorMoonCollector'),(13,'SpiderManCosplay'),(16,'ZootopiaCosplay');
/*!40000 ALTER TABLE `hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hp_promociones`
--

DROP TABLE IF EXISTS `hp_promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hp_promociones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `seccion` enum('carousel','sidebar','bottom') NOT NULL DEFAULT 'carousel' COMMENT 'carousel=Partners, sidebar=Panel lateral, bottom=Destacados',
  `titulo` varchar(120) NOT NULL,
  `subtitulo` varchar(200) DEFAULT NULL,
  `imagen_url` varchar(300) DEFAULT NULL,
  `link_url` varchar(500) NOT NULL,
  `btn_texto` varchar(60) DEFAULT 'Ver m??s',
  `orden` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_seccion_activo` (`seccion`,`activo`,`orden`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hp_promociones`
--

LOCK TABLES `hp_promociones` WRITE;
/*!40000 ALTER TABLE `hp_promociones` DISABLE KEYS */;
INSERT INTO `hp_promociones` VALUES (1,'carousel','AmiAmi',NULL,'uploads/promos/promo_69e1403e94cf6.png','https://www.amiami.com/eng/?srsltid=AfmBOoo9t41c6ydfmDH08fkAv7H8yE-SnHq6uzj8XrseGbEO7t7Z06R-','Ver m├ís',0,1,'2026-04-16 20:02:06'),(2,'carousel','Richirocko',NULL,'uploads/promos/promo_69e1456265e83.png','https://tienda.richirocko.com/?srsltid=AfmBOooMKGEYLEF5TpVXRDU6dV6G68fk6r5Wkwz1SB3VR3Q6yoo6BFUT','Ver m├ís',1,1,'2026-04-16 20:16:41'),(3,'carousel','Geekz',NULL,'uploads/promos/promo_69e145e354815.png','https://www.geekz.cl/?srsltid=AfmBOoqCd8_lD9yi5o9UJu59aWZXfMiHckxXzOHW_8SueS4vDs1yFVU8','Ver m├ís',2,1,'2026-04-16 20:26:11'),(4,'carousel','AnimeStore',NULL,'uploads/promos/promo_69e1468bc11ae.png','https://animestore.cl/?srsltid=AfmBOoroMY8O2Gdo3Txq6EeNDq1s9fHpUTwQUGYc5F9h76xPUCTStYYM','Ver m├ís',4,1,'2026-04-16 20:28:59'),(5,'carousel','FigurasDBZChile',NULL,'uploads/promos/promo_69e14711436fd.png','https://www.figurasdbzchile.cl/','Ver m├ís',5,1,'2026-04-16 20:31:13'),(6,'carousel','NihonFigures',NULL,'uploads/promos/promo_69e147e6ec4b6.png','https://www.nihonfigures.com/?srsltid=AfmBOorwKeColvH5Z9GGSL9cyQDyW3RQPlgMgchzX8DdtAwExEhTO_cJ','Ver m├ís',5,1,'2026-04-16 20:34:46');
/*!40000 ALTER TABLE `hp_promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `identidad`
--

DROP TABLE IF EXISTS `identidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `identidad` (
  `id` varchar(50) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `identidad`
--

LOCK TABLES `identidad` WRITE;
/*!40000 ALTER TABLE `identidad` DISABLE KEYS */;
INSERT INTO `identidad` VALUES ('metas','­ƒÅå','Metas','Expandir la comunidad a nivel nacional, organizar eventos presenciales y posicionarnos como referentes del coleccionismo en Chile.'),('mision','­ƒÄ»','Misi├│n actual','Reunir a coleccionistas apasionados en una comunidad activa donde pueden compartir, exhibir y perseguir piezas ├║nicas del mundo del entretenimiento. :3'),('valores','Ô¡É','Valores','Comunidad, respeto, pasi├│n por la historia, autenticidad y colaboraci├│n entre miembros.');
/*!40000 ALTER TABLE `identidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `likes` (
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,2),(1,4),(1,5),(1,6),(2,11),(3,1),(3,3),(3,4),(3,5),(3,6),(3,8),(3,11);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `accion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (1,2,'login','Inicio de sesi├│n','2026-04-08 19:19:03'),(2,1,'login','Inicio de sesi├│n','2026-04-08 19:55:42'),(3,3,'login','Inicio de sesi├│n','2026-04-09 00:36:19'),(4,1,'login','Inicio de sesi├│n','2026-04-09 03:30:44'),(5,1,'figura','Public├│ un nuevo figura: 4rtyhj','2026-04-09 03:31:05'),(6,3,'login','Inicio de sesi├│n','2026-04-09 03:31:18'),(7,3,'admin','Elimin├│ publicaci├│n: 4rtyhj (figura). Motivo: la imagen no corresponde a nada de figura o cosplay','2026-04-09 03:38:06'),(8,3,'admin','Edit├│ perfil completo del usuario: Bocchi','2026-04-09 03:49:31'),(9,1,'login','Inicio de sesi├│n','2026-04-09 03:57:48'),(10,1,'figura','Public├│ un nuevo figura: wdddddddddddd','2026-04-09 03:58:06'),(11,3,'login','Inicio de sesi├│n','2026-04-09 03:58:17'),(12,3,'admin','Elimin├│ publicaci├│n: wdddddddddddd (figura). Motivo: el contenigo no corresponde a ningun tipo de figura o cosplay ','2026-04-09 03:58:58'),(13,3,'admin','Actualiz├│ secci├│n de identidad: mision','2026-04-09 04:56:44'),(14,1,'login','Inicio de sesi├│n','2026-04-09 16:24:00'),(15,1,'login','Inicio de sesi├│n','2026-04-09 16:36:49'),(16,3,'admin','Edit├│ perfil completo del usuario: Imagine','2026-04-09 19:34:34'),(17,3,'admin','Edit├│ perfil completo del usuario: Autral','2026-04-09 19:43:20'),(18,3,'alerta','Public├│ un nuevo evento: Hotweel 2026','2026-04-09 19:49:40'),(19,3,'alerta','Actualiz├│ el evento: Hotweel 2026','2026-04-10 16:51:34'),(20,3,'alerta','Actualiz├│ el evento: Comic con 2026','2026-04-10 16:51:47'),(21,2,'login','Inicio de sesi├│n','2026-04-10 17:07:32'),(22,2,'figura','Public├│ un nuevo figura: Kato megumi','2026-04-10 17:13:03'),(23,2,'figura','Public├│ un nuevo figura: Origime inoue','2026-04-10 17:22:46'),(24,2,'figura','Public├│ un nuevo figura: Anime waffles','2026-04-10 17:29:51'),(25,2,'figura','Public├│ un nuevo figura: Anime waffles','2026-04-10 17:29:51'),(26,3,'admin','Elimin├│ publicaci├│n: Anime waffles (figura). Motivo: error codigo \n','2026-04-10 17:32:12'),(27,2,'figura','Public├│ un nuevo figura: Ishigo','2026-04-10 17:35:49'),(28,2,'figura','Public├│ un nuevo figura: Ishigo','2026-04-10 17:35:49'),(29,3,'admin','Elimin├│ publicaci├│n: Ishigo (figura). Motivo: error codigo 2\n','2026-04-10 17:37:46'),(30,2,'figura','Public├│ un nuevo figura: IA bleach','2026-04-10 17:38:52'),(31,2,'figura','Public├│ un nuevo figura: Origime pan','2026-04-10 17:41:45'),(32,2,'figura','Public├│ un nuevo figura: Origime','2026-04-10 17:41:45'),(33,3,'admin','Actualiz├│ secci├│n de identidad: mision','2026-04-11 00:40:12'),(34,3,'admin','Elimin├│ publicaci├│n: IA bleach (figura). Motivo: Este contenido no representa ni figura ni cosplay ','2026-04-11 00:41:38'),(35,2,'figura','Public├│ un nuevo figura: Origime','2026-04-11 01:06:55'),(36,3,'admin','Edit├│ perfil completo del usuario: Autral','2026-04-13 17:13:55'),(37,3,'perfil','Puntuaste el perfil #1 con 5 estrellas.','2026-04-13 21:37:17'),(38,3,'login','Inicio de sesi├│n','2026-04-15 19:59:56'),(39,3,'login','Inicio de sesi├│n','2026-04-15 19:59:57'),(40,3,'login','Inicio de sesi├│n','2026-04-15 20:00:11'),(41,3,'login','Inicio de sesi├│n','2026-04-15 20:02:49'),(42,3,'login','Inicio de sesi├│n','2026-04-15 20:03:02'),(43,3,'login','Inicio de sesi├│n','2026-04-15 20:10:42'),(44,3,'login','Inicio de sesi├│n','2026-04-15 20:10:56'),(45,3,'login','Inicio de sesi├│n','2026-04-15 20:10:59'),(46,3,'login','Inicio de sesi├│n','2026-04-15 20:11:01'),(47,3,'login','Inicio de sesi├│n','2026-04-15 20:11:11'),(48,3,'login','Inicio de sesi├│n','2026-04-15 20:11:14'),(49,3,'login','Inicio de sesi├│n','2026-04-15 20:11:17'),(50,3,'login','Inicio de sesi├│n','2026-04-15 20:17:26'),(51,3,'login','Inicio de sesi├│n','2026-04-15 20:19:00'),(52,3,'login','Inicio de sesi├│n','2026-04-15 20:28:58'),(53,3,'login','Inicio de sesi├│n','2026-04-15 20:29:00'),(54,3,'login','Inicio de sesi├│n','2026-04-15 20:29:02'),(55,3,'login','Inicio de sesi├│n','2026-04-15 20:29:09'),(56,3,'login','Inicio de sesi├│n','2026-04-15 20:29:14'),(57,3,'login','Inicio de sesi├│n','2026-04-15 20:29:15'),(58,3,'login','Inicio de sesi├│n','2026-04-15 20:29:25'),(59,3,'login','Inicio de sesi├│n','2026-04-15 20:33:54'),(60,3,'login','Inicio de sesi├│n','2026-04-15 20:33:56'),(61,3,'login','Inicio de sesi├│n','2026-04-15 20:33:57'),(62,3,'login','Inicio de sesi├│n','2026-04-15 20:33:59'),(63,3,'login','Inicio de sesi├│n','2026-04-15 20:34:01'),(64,3,'login','Inicio de sesi├│n','2026-04-15 20:34:05'),(65,3,'login','Inicio de sesi├│n','2026-04-15 20:34:10'),(66,3,'login','Inicio de sesi├│n','2026-04-15 20:34:12'),(67,3,'login','Inicio de sesi├│n','2026-04-15 20:35:48'),(68,3,'login','Inicio de sesi├│n','2026-04-15 20:35:49'),(69,3,'login','Inicio de sesi├│n','2026-04-15 20:35:51'),(70,3,'login','Inicio de sesi├│n','2026-04-15 20:35:53'),(71,3,'login','Inicio de sesi├│n','2026-04-15 20:35:55'),(72,3,'login','Inicio de sesi├│n','2026-04-15 20:35:58'),(73,3,'login','Inicio de sesi├│n','2026-04-15 20:36:00'),(74,3,'login','Inicio de sesi├│n','2026-04-15 20:36:03'),(75,3,'login','Inicio de sesi├│n','2026-04-15 20:36:05'),(76,3,'login','Inicio de sesi├│n','2026-04-15 20:36:08'),(77,3,'login','Inicio de sesi├│n','2026-04-15 20:36:10'),(78,3,'login','Inicio de sesi├│n','2026-04-15 20:36:21'),(79,3,'login','Inicio de sesi├│n','2026-04-15 20:48:54'),(80,3,'login','Inicio de sesi├│n','2026-04-15 20:59:34'),(81,3,'figura','Public├│ un nuevo figura: asdada','2026-04-16 14:46:23'),(82,3,'figura','Public├│ un nuevo figura: asdada','2026-04-16 15:21:00'),(83,3,'figura','Public├│ un nuevo figura: ishigo y inoue','2026-04-16 20:58:29'),(84,3,'login','Inicio de sesi├│n','2026-04-16 21:07:35'),(85,3,'admin','Elimin├│ publicaci├│n: ishigo y inoue (figura). Motivo: nada','2026-04-16 21:08:00'),(86,3,'admin','Elimin├│ publicaci├│n: Origime (figura). Motivo: cosas','2026-04-16 21:08:30'),(87,3,'admin','Agreg├│ video: el principe','2026-04-16 21:09:10');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_ratings`
--

DROP TABLE IF EXISTS `perfil_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perfil_ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rater_id` int(11) NOT NULL,
  `rated_user_id` int(11) NOT NULL,
  `score` int(11) NOT NULL CHECK (`score` >= 1 and `score` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_rating` (`rater_id`,`rated_user_id`),
  KEY `rated_user_id` (`rated_user_id`),
  CONSTRAINT `perfil_ratings_ibfk_1` FOREIGN KEY (`rater_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `perfil_ratings_ibfk_2` FOREIGN KEY (`rated_user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_ratings`
--

LOCK TABLES `perfil_ratings` WRITE;
/*!40000 ALTER TABLE `perfil_ratings` DISABLE KEYS */;
INSERT INTO `perfil_ratings` VALUES (1,3,1,5,'2026-04-13 21:37:17');
/*!40000 ALTER TABLE `perfil_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_hashtags`
--

DROP TABLE IF EXISTS `post_hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_hashtags` (
  `post_id` int(11) NOT NULL,
  `hashtag_id` int(11) NOT NULL,
  PRIMARY KEY (`post_id`,`hashtag_id`),
  KEY `hashtag_id` (`hashtag_id`),
  CONSTRAINT `post_hashtags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_hashtags_ibfk_2` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_hashtags`
--

LOCK TABLES `post_hashtags` WRITE;
/*!40000 ALTER TABLE `post_hashtags` DISABLE KEYS */;
INSERT INTO `post_hashtags` VALUES (1,1),(1,2),(1,3),(2,1),(2,2),(2,5),(2,6),(3,8),(3,9),(3,10),(3,11),(4,12),(4,13),(4,14),(5,15),(5,16),(5,17),(6,18),(6,19),(6,20),(6,21),(7,26),(7,27),(7,28),(7,29),(8,28),(8,31);
/*!40000 ALTER TABLE `post_hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `imagenes_extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`imagenes_extra`)),
  `tipo` enum('figura','cosplay') NOT NULL,
  `anio` varchar(10) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,2,'Eternal Sailor Moon - S.H.Figuarts (Edition 2022/2023)','Figura de acci├│n de alta gama perteneciente a la l├¡nea S.H.Figuarts de Tamashii Nations (Bandai). Esta pieza representa la evoluci├│n final de Sailor Moon, destacando por sus imponentes alas blancas, el broche de coraz├│n dorado y su traje de tres capas (amarillo, rojo y azul). La figura incluye el Eternal Tiare (su b├ículo de poder) con un nivel de detalle excepcional en la parte superior. Al ser una figura articulada de ├║ltima generaci├│n, permite una posabilidad extrema manteniendo proporciones estilizadas y acabados de pintura perlados que le dan un aspecto premium.','uploads/posts/post_69d6af7283e020.18932563.jpg',NULL,'figura','2022',1,'2026-04-08 19:41:38'),(2,2,'Eternal Sailor Moon - Bootleg / Versi├│n Alternativa (No Oficial)','Esta pieza es una r├®plica no oficial inspirada en la l├¡nea S.H.Figuarts. Aunque intenta imitar el dise├▒o de la pel├¡cula Sailor Moon Eternal, se pueden observar diferencias notables que son importantes para un coleccionista:\r\n\r\nPintura: Los colores son m├ís planos y saturados; el amarillo del cabello es m├ís opaco y no tiene el efecto degradado de la original.\r\n\r\nAcabados: El b├ículo (Eternal Tiare) tiene un esculpido m├ís tosco y la gema roja superior carece de transparencia.\r\n\r\nArticulaciones: Las uniones (especialmente en codos y hombros) suelen ser m├ís visibles y de un pl├ístico con diferente brillo al resto del cuerpo.\r\n\r\nRostro: La expresi├│n y el detalle en los ojos son menos precisos que en la versi├│n de Tamashii Nations.','uploads/posts/post_69d6b266f06696.84814003.jpg',NULL,'figura','2023',2,'2026-04-08 19:54:14'),(3,1,'Jeanne d\'Arc (Alter) / Jalter','interpretaci├│n de Jeanne d\'Arc (Alter) de la franquicia Fate. El cosplay captura perfectamente la naturaleza \"Vengadora\" (Avenger) del personaje, destacando su caracter├¡stica armadura negra con bordes afilados y su corona oscura ornamentada. Porta la emblem├ítica espada negra con detalles carmes├¡ que imitan llamas. La caracterizaci├│n es impecable, incluyendo la peluca de color blanco cenizo con corte desordenado y el uso de lentes de contacto amarillos que reflejan la mirada intensa del personaje. La iluminaci├│n en tonos p├║rpuras y rosados resalta la atm├│sfera m├¡stica y oscura de esta variante del personaje.','uploads/posts/post_69d6b335d0a852.01440452.jpg','[\"uploads\\/posts\\/post_69d6b335d0f9c2.13476399.jpg\",\"uploads\\/posts\\/post_69d6b335d13a73.21173820.jpg\"]','cosplay','2024',0,'2026-04-08 19:57:41'),(4,1,'Miles Morales (Spider-Man)','Excepcional cosplay de Miles Morales que destaca por su fidelidad t├®cnica. El traje utiliza un patr├│n de tejido con textura de panal de abeja (honeycomb) que le otorga un aspecto cinematogr├ífico y profesional. Los lentes de la m├íscara presentan un borde rojo vibrante con una malla blanca micro-perforada de alta visibilidad, capturando la expresi├│n cl├ísica del personaje. La combinaci├│n de colores negro carb├│n y rojo intenso, junto con las telara├▒as blancas finamente impresas, lo convierten en una representaci├│n de alto nivel del Spider-Man de Brooklyn.','uploads/posts/post_69d6b3aec4a2a7.98583287.jpg',NULL,'cosplay','2023',3,'2026-04-08 19:59:42'),(5,1,'Judy Hopps (Human Version / Gijinka)','Creativa interpretaci├│n humanizada (Gijinka) de la oficial Judy Hopps. El cosplay captura la esencia del personaje mediante el uso de orejas de conejo de textura suave y el uniforme policial celeste caracter├¡stico. Destaca por el uso de accesorios tem├íticos que a├▒aden narrativa a la imagen, como la pluma en forma de zanahoria (referencia directa a la grabadora de la pel├¡cula) y un detalle muy especial para coleccionistas: una carcasa de celular inspirada en el broche de transformaci├│n de Sailor Moon, mostrando el lado fan de la cosplayer. La caracterizaci├│n se completa con una peluca gris plata en coletas y un maquillaje que resalta la expresi├│n alegre y decidida de la protagonista.','uploads/posts/post_69d6b4b0d92647.02406606.jpg',NULL,'cosplay','2022',2,'2026-04-08 20:04:00'),(6,1,'Red Rangers Multi-Generation (Power Rangers Group)','Impactante fotograf├¡a grupal que re├║ne a diversos l├¡deres de la franquicia Power Rangers. Los cosplays presentan un acabado en tela spandex brillante y cascos de fibra con visores opacos de alta fidelidad. De izquierda a derecha, podemos identificar a los Red Rangers de:\r\n\r\nMegaforce / Goseiger\r\n\r\nIn Space / Megaranger\r\n\r\nOperation Overdrive / Boukenger\r\n\r\nMighty Morphin / Zyuranger (El ic├│nico l├¡der original)\r\n\r\nSamurai / Shinkenger (En pose de ataque con espada)\r\n\r\nTime Force / Timeranger\r\n\r\nMystic Force / Magiranger (Con su caracter├¡stica capa blanca)\r\n\r\nEs una muestra excelente de la evoluci├│n del dise├▒o de los trajes a lo largo de los a├▒os, manteniendo la cohesi├│n del color rojo como s├¡mbolo de liderazgo.','uploads/posts/post_69d6b52a310b37.78823714.jpg',NULL,'cosplay','2020',1,'2026-04-08 20:06:02'),(7,1,'Iron Man Mark VI','Figura de colecci├│n con est├®tica \"Super Deformed\" (cabeza grande y cuerpo peque├▒o) que representa la armadura Mark VI de Tony Stark, reconocible por el reactor arc triangular en el pecho. Esta pieza destaca por su funci├│n de iluminaci├│n LED en los ojos y el pecho, adem├ís de un acabado de pintura carmes├¡ metalizado de alta calidad. Es una figura est├ítica dise├▒ada con un alto nivel de detalle en el esculpido de las placas de la armadura, capturando la esencia tecnol├│gica de Marvel en un formato compacto y elegante.','uploads/posts/post_69d6b718bb1c97.72213717.jpg','[\"uploads\\/posts\\/post_69d6b718bb74c8.06388791.jpg\"]','figura','2015',0,'2026-04-08 20:14:16'),(8,1,'Marvel Heroes Ensemble (Doctor Strange, Hulk & Star-Lord)','Conjunto de figuras estilizadas que re├║ne a tres de los h├®roes m├ís importantes del MCU. En primer plano destaca Doctor Strange en formato Mystery Mini, portando un escudo de energ├¡a m├¡stica y su ic├│nica Capa de Levitaci├│n. Lo acompa├▒an en el fondo un Funko Pop! de Hulk, mostrando su musculatura y expresi├│n de furia caracter├¡stica, y un Mystery Mini de Star-Lord con su m├íscara de combate y bl├ísters. La fotograf├¡a resalta la diferencia de texturas y el dise├▒o \"cabez├│n\" que ha dominado el coleccionismo moderno, ideal para exhibiciones tem├íticas de Marvel.','uploads/posts/post_69d6bc66ed74f6.57587694.jpg',NULL,'figura','2017',0,'2026-04-08 20:36:54'),(11,2,'Kato megumi','La waifus m├ís hermosa kato megumi','uploads/posts/post_69d92f9f18e8f9.09484441.jpg',NULL,'figura','2016',0,'2026-04-10 17:13:03'),(12,2,'Origime inoue','Uff waifus','uploads/posts/post_69d931e6164c46.13531572.jpg',NULL,'figura','2010',0,'2026-04-10 17:22:46'),(14,2,'Anime waffles','Dos waifus lindas','uploads/posts/post_69d9338f594cd0.02932073.jpg','[\"uploads\\/posts\\/post_69d9338f5cde52.77196397.jpg\"]','figura','2025',0,'2026-04-10 17:29:51'),(16,2,'Ishigo','Protagonista de bleach','uploads/posts/post_69d934f58c8825.61508672.jpg',NULL,'figura','2026',0,'2026-04-10 17:35:49'),(18,2,'Origime pan','Pan pan','uploads/posts/post_69d93659760a10.87447237.jpg',NULL,'figura','2009',0,'2026-04-10 17:41:45'),(19,2,'Origime','Origime op','uploads/posts/post_69d93659807e32.18266719.jpg',NULL,'figura','2007',0,'2026-04-10 17:41:45'),(21,3,'asdada','asdadad','uploads/posts/post_69e0f63f58d835.09662754.jpg',NULL,'figura','1221',0,'2026-04-16 14:46:23'),(22,3,'asdada','asdadad','uploads/posts/post_69e0fe5c30ea80.03498920.jpg',NULL,'figura','1221',0,'2026-04-16 15:21:00');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `biografia` text DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `avatar_url` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Bocchi','rjoseeliecer@gmail.com','$2y$12$9OkElmW.eDaU9UR7eTm4ge9Ypflb/077tis0HuEBCE8jIGNlP1xai','','','1994-07-25','','user',1,'uploads/profiles/avatar_1_1775678996.png','uploads/profiles/banner_1_1775678996.jpg','2026-04-08 16:27:06'),(2,'Imagine','breakerimagine16@gmail.com','$2y$12$9OkElmW.eDaU9UR7eTm4ge9Ypflb/077tis0HuEBCE8jIGNlP1xai','Kamijou','Touma','2026-04-10','wsdddddddddddd','user',1,'uploads/profiles/avatar_2_1775841637.jpg','uploads/profiles/banner_2_1775841637.jpg','2026-04-08 16:27:06'),(3,'Autral','austral.cadmin@gmail.com','$2y$12$9OkElmW.eDaU9UR7eTm4ge9Ypflb/077tis0HuEBCE8jIGNlP1xai','','','2026-04-10','','admin',1,'uploads/profiles/avatar_3_1775695308.png','uploads/profiles/banner_3_1775695308.jpg','2026-04-08 16:27:06');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `link_yt` varchar(255) NOT NULL,
  `destacado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,'re zero','https://www.youtube.com/watch?v=VDGG9zi53rQ&pp=ygUOZmlndXJhIGppbiB3b28%3D',0,'2026-04-09 00:37:37'),(2,'sun jin','https://www.youtube.com/watch?v=eRsfDA6BwQk&pp=ugMGCgJlcxABugUEEgJlc8oFDmZpZ3VyYSBqaW4gd29v0gcJCdkKAYcqIYzv2AcB',0,'2026-04-09 00:37:53'),(3,'shangiry','https://www.youtube.com/watch?v=kGXWuzpMLRo&pp=ygUOZmlndXJhIGppbiB3b28%3D',0,'2026-04-09 00:38:26'),(4,'sun jhin short','https://www.youtube.com/shorts/65apTQHwXZs',0,'2026-04-09 00:39:06'),(5,'fairy tail ','https://www.youtube.com/watch?v=rHh7fi7yX8o&pp=0gcJCdoKAYcqIYzv',0,'2026-04-09 00:39:32'),(6,'el principe','https://www.youtube.com/watch?v=jg5zCZc-7To&list=RDjg5zCZc-7To&start_radio=1',0,'2026-04-16 21:09:10');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos_portafolio`
--

DROP TABLE IF EXISTS `videos_portafolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `videos_portafolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT '',
  `descripcion` text DEFAULT NULL,
  `link_yt` varchar(255) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos_portafolio`
--

LOCK TABLES `videos_portafolio` WRITE;
/*!40000 ALTER TABLE `videos_portafolio` DISABLE KEYS */;
INSERT INTO `videos_portafolio` VALUES (1,'Video Antiguo','el hijo menor de la familia de reyes su opening ','https://www.youtube.com/watch?v=jg5zCZc-7To&list=RDjg5zCZc-7To&start_radio=1',1,'2026-04-16 16:03:21'),(2,'Video Antiguo','','https://www.youtube.com/watch?v=E0d2uEQJbXs&list=RDjg5zCZc-7To&index=2',0,'2026-04-16 16:03:21'),(3,'Video Antiguo',NULL,'https://www.youtube.com/watch?v=RkkGHJUpJCw&list=RDjg5zCZc-7To&index=3',2,'2026-04-16 16:03:21'),(4,'Video Antiguo',NULL,'https://www.youtube.com/watch?v=a4na2opArGY&list=RDjg5zCZc-7To&index=4',3,'2026-04-16 16:03:21');
/*!40000 ALTER TABLE `videos_portafolio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-17  1:25:19
