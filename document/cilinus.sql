-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: cilinus
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `canvas_resolutions`
--

DROP TABLE IF EXISTS `canvas_resolutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canvas_resolutions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `width` int NOT NULL,
  `height` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canvas_resolutions`
--

LOCK TABLES `canvas_resolutions` WRITE;
/*!40000 ALTER TABLE `canvas_resolutions` DISABLE KEYS */;
INSERT INTO `canvas_resolutions` VALUES (1,'1920x158',1920,158,'2025-07-02 05:34:25','2025-07-02 05:34:25'),(2,'1920x540',1920,540,'2025-07-02 05:34:25','2025-07-02 05:34:25'),(5,'1280x1920',1280,1920,'2025-07-03 00:42:14','2025-07-03 00:42:14');
/*!40000 ALTER TABLE `canvas_resolutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_updates`
--

DROP TABLE IF EXISTS `content_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_updates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` int DEFAULT NULL,
  `price_tag_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `tag_template_id` int DEFAULT NULL,
  `update_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'price, template, full, layout, device_template',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'pending, in_progress, completed, failed',
  `retry_count` int DEFAULT '0',
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `price_tag_id` (`price_tag_id`),
  KEY `product_id` (`product_id`),
  KEY `tag_template_id` (`tag_template_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_updates_status` (`status`),
  KEY `idx_updates_created` (`created_at`),
  KEY `idx_updates_device_status` (`device_id`,`status`),
  CONSTRAINT `content_updates_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `esl_devices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `content_updates_ibfk_2` FOREIGN KEY (`price_tag_id`) REFERENCES `price_tags` (`id`) ON DELETE CASCADE,
  CONSTRAINT `content_updates_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `content_updates_ibfk_4` FOREIGN KEY (`tag_template_id`) REFERENCES `tag_templates` (`id`) ON DELETE CASCADE,
  CONSTRAINT `content_updates_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_updates`
--

LOCK TABLES `content_updates` WRITE;
/*!40000 ALTER TABLE `content_updates` DISABLE KEYS */;
INSERT INTO `content_updates` VALUES (1,1,1,1,2,'price','completed',0,NULL,6,'2025-07-21 07:49:38','2025-07-21 07:49:43'),(2,1,2,2,2,'price','completed',0,NULL,6,'2025-07-21 07:49:38','2025-07-21 07:49:41'),(3,2,5,5,1,'full','completed',0,NULL,6,'2025-07-21 08:49:38','2025-07-21 08:49:48'),(4,3,9,1,2,'template','in_progress',0,NULL,6,'2025-07-21 09:44:38',NULL),(5,4,13,1,4,'price','pending',0,NULL,6,'2025-07-21 09:47:38',NULL),(6,8,19,9,1,'full','failed',3,'Device not responding',8,'2025-07-21 09:19:38','2025-07-21 09:20:38'),(7,9,NULL,NULL,NULL,'device_template','failed',2,'Network timeout',8,'2025-07-21 09:29:38','2025-07-21 09:30:38');
/*!40000 ALTER TABLE `content_updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `device_status_dashboard`
--

DROP TABLE IF EXISTS `device_status_dashboard`;
/*!50001 DROP VIEW IF EXISTS `device_status_dashboard`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `device_status_dashboard` AS SELECT 
 1 AS `organization_id`,
 1 AS `organization_name`,
 1 AS `organization_type`,
 1 AS `total_devices`,
 1 AS `active_devices`,
 1 AS `error_devices`,
 1 AS `inactive_devices`,
 1 AS `avg_battery_level`,
 1 AS `avg_signal_strength`,
 1 AS `min_battery_level`,
 1 AS `low_battery_count`,
 1 AS `last_update`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `device_templates`
--

DROP TABLE IF EXISTS `device_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '23inch or 29inch',
  `layout_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'grid_2x2, grid_1x4, grid_2x3, custom',
  `max_tags` int NOT NULL,
  `grid_config` json NOT NULL,
  `preview_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `device_templates_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `device_templates_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_templates`
--

LOCK TABLES `device_templates` WRITE;
/*!40000 ALTER TABLE `device_templates` DISABLE KEYS */;
INSERT INTO `device_templates` VALUES (1,NULL,'23인치 2x2 기본 템플릿','23inch','grid_2x2',4,'{\"gap\": \"10px\", \"cols\": 2, \"rows\": 2, \"cellWidth\": \"50%\", \"cellHeight\": \"50%\"}',NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(2,NULL,'23인치 1x4 세로 템플릿','23inch','grid_1x4',4,'{\"gap\": \"5px\", \"cols\": 1, \"rows\": 4, \"cellWidth\": \"100%\", \"cellHeight\": \"25%\"}',NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(3,NULL,'29인치 2x3 템플릿','29inch','grid_2x3',6,'{\"gap\": \"10px\", \"cols\": 2, \"rows\": 3, \"cellWidth\": \"50%\", \"cellHeight\": \"33.33%\"}',NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(4,1,'CJ프레시웨이 커스텀 23인치','23inch','custom',5,'{\"positions\": [{\"x\": 0, \"y\": 0, \"width\": \"40%\", \"height\": \"40%\"}, {\"x\": \"45%\", \"y\": 0, \"width\": \"55%\", \"height\": \"40%\"}, {\"x\": 0, \"y\": \"45%\", \"width\": \"100%\", \"height\": \"55%\"}], \"customLayout\": true}',NULL,0,2,'2025-07-21 09:49:38','2025-07-21 09:49:38');
/*!40000 ALTER TABLE `device_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esl_devices`
--

DROP TABLE IF EXISTS `esl_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `esl_devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int NOT NULL,
  `device_template_id` int DEFAULT NULL,
  `mac_address` varchar(17) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '23inch or 29inch',
  `firmware_version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_store` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_aisle` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_shelf` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `battery_level` int DEFAULT NULL,
  `signal_strength` int DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'active' COMMENT 'active, inactive, error',
  `last_heartbeat` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mac_address` (`mac_address`),
  KEY `device_template_id` (`device_template_id`),
  KEY `idx_devices_org` (`organization_id`),
  KEY `idx_devices_status` (`status`),
  KEY `idx_devices_heartbeat` (`last_heartbeat`),
  KEY `idx_devices_location` (`location_store`,`location_aisle`,`location_shelf`),
  KEY `idx_devices_battery` (`battery_level`),
  CONSTRAINT `esl_devices_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `esl_devices_ibfk_2` FOREIGN KEY (`device_template_id`) REFERENCES `device_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esl_devices`
--

LOCK TABLES `esl_devices` WRITE;
/*!40000 ALTER TABLE `esl_devices` DISABLE KEYS */;
INSERT INTO `esl_devices` VALUES (1,5,1,'AA:BB:CC:DD:EE:01','23inch','v2.1.0','강남점','A','1',95,85,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(2,5,1,'AA:BB:CC:DD:EE:02','23inch','v2.1.0','강남점','A','2',92,82,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(3,5,2,'AA:BB:CC:DD:EE:03','23inch','v2.1.0','강남점','B','1',88,79,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(4,5,3,'AA:BB:CC:DD:EE:04','29inch','v2.1.0','강남점','C','1',85,75,'active','2025-07-21 09:44:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(5,6,1,'AA:BB:CC:DD:EE:11','23inch','v2.1.0','역삼점','A','1',90,80,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(6,6,1,'AA:BB:CC:DD:EE:12','23inch','v2.1.0','역삼점','A','2',87,78,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(7,6,2,'AA:BB:CC:DD:EE:13','23inch','v2.0.9','역삼점','B','1',82,72,'active','2025-07-21 09:39:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(8,7,1,'AA:BB:CC:DD:EE:21','23inch','v2.1.0','삼성점','A','1',93,83,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(9,7,1,'AA:BB:CC:DD:EE:22','23inch','v2.0.8','삼성점','A','2',15,65,'error','2025-07-21 08:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(10,7,3,'AA:BB:CC:DD:EE:23','29inch','v2.1.0','삼성점','C','1',0,0,'inactive','2025-07-21 07:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(11,8,1,'AA:BB:CC:DD:EE:31','23inch','v2.1.0','분당점','A','1',96,88,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(12,8,2,'AA:BB:CC:DD:EE:32','23inch','v2.1.0','분당점','B','1',91,84,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(13,9,4,'AA:BB:CC:DD:EE:41','23inch','v2.1.0','판교점','A','1',89,81,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(14,9,3,'AA:BB:CC:DD:EE:42','29inch','v2.1.0','판교점','B','1',94,86,'active','2025-07-21 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38');
/*!40000 ALTER TABLE `esl_devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization_closure`
--

DROP TABLE IF EXISTS `organization_closure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization_closure` (
  `ancestor_id` int NOT NULL,
  `descendant_id` int NOT NULL,
  `depth` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ancestor_id`,`descendant_id`),
  KEY `idx_descendant` (`descendant_id`),
  KEY `idx_depth` (`depth`),
  KEY `idx_anc_depth` (`ancestor_id`,`depth`),
  KEY `idx_closure_anc_desc` (`ancestor_id`,`descendant_id`),
  CONSTRAINT `organization_closure_ibfk_1` FOREIGN KEY (`ancestor_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `organization_closure_ibfk_2` FOREIGN KEY (`descendant_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization_closure`
--

LOCK TABLES `organization_closure` WRITE;
/*!40000 ALTER TABLE `organization_closure` DISABLE KEYS */;
INSERT INTO `organization_closure` VALUES (1,1,0),(2,2,0),(3,3,0),(4,4,0),(5,5,0),(6,6,0),(7,7,0),(8,8,0),(9,9,0),(10,10,0),(11,11,0),(1,2,1),(1,3,1),(1,4,1),(2,5,1),(2,6,1),(2,7,1),(3,8,1),(3,9,1),(4,10,1),(4,11,1),(1,5,2),(1,6,2),(1,7,2),(1,8,2),(1,9,2),(1,10,2),(1,11,2);
/*!40000 ALTER TABLE `organization_closure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `organization_hierarchy`
--

DROP TABLE IF EXISTS `organization_hierarchy`;
/*!50001 DROP VIEW IF EXISTS `organization_hierarchy`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `organization_hierarchy` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `type`,
 1 AS `address`,
 1 AS `address_detail`,
 1 AS `postal_code`,
 1 AS `city`,
 1 AS `district`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `phone`,
 1 AS `business_hours`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `level`,
 1 AS `parent_id`,
 1 AS `path`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'headquarters, branch, store',
  `address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_detail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_hours` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_city` (`city`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'CJ프레시웨이 본사','headquarters','서울특별시 중구 동호로 330','CJ제일제당센터','04560','서울','중구',37.55790000,127.00780000,'02-6740-1114','{\"fri\": \"09:00-18:00\", \"mon\": \"09:00-18:00\", \"sat\": \"closed\", \"sun\": \"closed\", \"thu\": \"09:00-18:00\", \"tue\": \"09:00-18:00\", \"wed\": \"09:00-18:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(2,'서울지점','branch','서울특별시 강남구 테헤란로 123','강남빌딩 5층','06234','서울','강남구',37.50120000,127.03960000,'02-555-0001','{\"fri\": \"09:00-18:00\", \"mon\": \"09:00-18:00\", \"sat\": \"09:00-14:00\", \"sun\": \"closed\", \"thu\": \"09:00-18:00\", \"tue\": \"09:00-18:00\", \"wed\": \"09:00-18:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(3,'경기지점','branch','경기도 성남시 분당구 판교로 255','판교테크노밸리','13486','경기','성남시',37.40200000,127.10870000,'031-555-0002','{\"fri\": \"09:00-18:00\", \"mon\": \"09:00-18:00\", \"sat\": \"09:00-14:00\", \"sun\": \"closed\", \"thu\": \"09:00-18:00\", \"tue\": \"09:00-18:00\", \"wed\": \"09:00-18:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(4,'부산지점','branch','부산광역시 해운대구 센텀중앙로 79','센텀사이언스파크','48058','부산','해운대구',35.16900000,129.13080000,'051-555-0003','{\"fri\": \"09:00-18:00\", \"mon\": \"09:00-18:00\", \"sat\": \"09:00-14:00\", \"sun\": \"closed\", \"thu\": \"09:00-18:00\", \"tue\": \"09:00-18:00\", \"wed\": \"09:00-18:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(5,'강남점','store','서울특별시 강남구 강남대로 456','1층','06123','서울','강남구',37.49790000,127.02760000,'02-333-1001','{\"fri\": \"10:00-22:00\", \"mon\": \"10:00-22:00\", \"sat\": \"10:00-22:00\", \"sun\": \"10:00-21:00\", \"thu\": \"10:00-22:00\", \"tue\": \"10:00-22:00\", \"wed\": \"10:00-22:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(6,'역삼점','store','서울특별시 강남구 역삼로 234','B1층','06234','서울','강남구',37.50060000,127.03640000,'02-333-1002','{\"fri\": \"10:00-22:00\", \"mon\": \"10:00-22:00\", \"sat\": \"10:00-22:00\", \"sun\": \"10:00-21:00\", \"thu\": \"10:00-22:00\", \"tue\": \"10:00-22:00\", \"wed\": \"10:00-22:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(7,'삼성점','store','서울특별시 강남구 삼성로 567','2층','06345','서울','강남구',37.51230000,127.06340000,'02-333-1003','{\"fri\": \"10:00-22:00\", \"mon\": \"10:00-22:00\", \"sat\": \"10:00-22:00\", \"sun\": \"10:00-21:00\", \"thu\": \"10:00-22:00\", \"tue\": \"10:00-22:00\", \"wed\": \"10:00-22:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(8,'분당점','store','경기도 성남시 분당구 정자로 123','1층','13561','경기','성남시',37.35950000,127.10520000,'031-333-2001','{\"fri\": \"10:00-22:00\", \"mon\": \"10:00-22:00\", \"sat\": \"10:00-22:00\", \"sun\": \"10:00-21:00\", \"thu\": \"10:00-22:00\", \"tue\": \"10:00-22:00\", \"wed\": \"10:00-22:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(9,'판교점','store','경기도 성남시 분당구 판교역로 235','B1층','13487','경기','성남시',37.39470000,127.11120000,'031-333-2002','{\"fri\": \"10:00-22:00\", \"mon\": \"10:00-22:00\", \"sat\": \"10:00-22:00\", \"sun\": \"10:00-21:00\", \"thu\": \"10:00-22:00\", \"tue\": \"10:00-22:00\", \"wed\": \"10:00-22:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(10,'센텀시티점','store','부산광역시 해운대구 센텀남대로 35','1층','48050','부산','해운대구',35.16890000,129.13000000,'051-333-3001','{\"fri\": \"10:00-22:00\", \"mon\": \"10:00-22:00\", \"sat\": \"10:00-22:00\", \"sun\": \"10:00-21:00\", \"thu\": \"10:00-22:00\", \"tue\": \"10:00-22:00\", \"wed\": \"10:00-22:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38'),(11,'해운대점','store','부산광역시 해운대구 해운대로 570','1층','48094','부산','해운대구',35.16280000,129.16350000,'051-333-3002','{\"fri\": \"10:00-22:00\", \"mon\": \"10:00-22:00\", \"sat\": \"10:00-22:00\", \"sun\": \"10:00-21:00\", \"thu\": \"10:00-22:00\", \"tue\": \"10:00-22:00\", \"wed\": \"10:00-22:00\"}','2025-07-21 09:49:38','2025-07-21 09:49:38');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resource` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'organization','create','organization.create','조직 생성','2025-07-21 09:49:38'),(2,'organization','read','organization.read','조직 조회','2025-07-21 09:49:38'),(3,'organization','update','organization.update','조직 수정','2025-07-21 09:49:38'),(4,'organization','delete','organization.delete','조직 삭제','2025-07-21 09:49:38'),(5,'user','create','user.create','사용자 생성','2025-07-21 09:49:38'),(6,'user','read','user.read','사용자 조회','2025-07-21 09:49:38'),(7,'user','update','user.update','사용자 수정','2025-07-21 09:49:38'),(8,'user','delete','user.delete','사용자 삭제','2025-07-21 09:49:38'),(9,'device','create','device.create','디바이스 생성','2025-07-21 09:49:38'),(10,'device','read','device.read','디바이스 조회','2025-07-21 09:49:38'),(11,'device','update','device.update','디바이스 수정','2025-07-21 09:49:38'),(12,'device','delete','device.delete','디바이스 삭제','2025-07-21 09:49:38'),(13,'product','create','product.create','상품 생성','2025-07-21 09:49:38'),(14,'product','read','product.read','상품 조회','2025-07-21 09:49:38'),(15,'product','update','product.update','상품 수정','2025-07-21 09:49:38'),(16,'product','delete','product.delete','상품 삭제','2025-07-21 09:49:38'),(17,'tag','create','tag.create','태그 생성','2025-07-21 09:49:38'),(18,'tag','read','tag.read','태그 조회','2025-07-21 09:49:38'),(19,'tag','update','tag.update','태그 수정','2025-07-21 09:49:38'),(20,'tag','delete','tag.delete','태그 삭제','2025-07-21 09:49:38'),(21,'template','create','template.create','템플릿 생성','2025-07-21 09:49:38'),(22,'template','read','template.read','템플릿 조회','2025-07-21 09:49:38'),(23,'template','update','template.update','템플릿 수정','2025-07-21 09:49:38'),(24,'template','delete','template.delete','템플릿 삭제','2025-07-21 09:49:38'),(25,'log','read','log.read','로그 조회','2025-07-21 09:49:38'),(26,'log','export','log.export','로그 내보내기','2025-07-21 09:49:38');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_tags`
--

DROP TABLE IF EXISTS `price_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `tag_template_id` int DEFAULT NULL,
  `grid_position` int NOT NULL,
  `grid_width` int DEFAULT '1',
  `grid_height` int DEFAULT '1',
  `custom_position` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int NOT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_device_position` (`device_id`,`grid_position`),
  KEY `tag_template_id` (`tag_template_id`),
  KEY `idx_tags_device` (`device_id`),
  KEY `idx_tags_product` (`product_id`),
  KEY `idx_tags_active` (`is_active`),
  KEY `idx_tags_order` (`device_id`,`display_order`),
  CONSTRAINT `price_tags_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `esl_devices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `price_tags_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  CONSTRAINT `price_tags_ibfk_3` FOREIGN KEY (`tag_template_id`) REFERENCES `tag_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_tags`
--

LOCK TABLES `price_tags` WRITE;
/*!40000 ALTER TABLE `price_tags` DISABLE KEYS */;
INSERT INTO `price_tags` VALUES (1,1,1,2,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(2,1,2,2,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(3,1,3,1,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(4,1,4,2,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(5,2,5,1,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(6,2,1,2,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(7,2,3,3,3,1,1,NULL,1,3,'2025-07-22 05:24:14','2025-07-21 09:49:38'),(8,2,1,3,4,1,1,NULL,1,4,'2025-07-22 05:24:14','2025-07-21 09:49:38'),(9,3,1,2,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(10,3,2,2,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(11,3,3,1,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(12,3,4,2,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(13,4,1,4,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(14,4,2,4,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(15,4,3,1,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(16,4,4,4,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(17,4,5,1,5,1,1,NULL,1,5,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(18,4,2,3,6,1,1,NULL,1,6,'2025-07-22 05:24:14','2025-07-21 09:49:38'),(19,5,6,1,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(20,5,7,1,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(21,5,8,2,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(22,5,6,1,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(23,8,9,1,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(24,8,10,1,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(25,8,11,2,3,1,1,NULL,0,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(26,8,9,1,4,1,1,NULL,0,4,'2025-07-21 09:49:38','2025-07-21 09:49:38');
/*!40000 ALTER TABLE `price_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `product_price_history`
--

DROP TABLE IF EXISTS `product_price_history`;
/*!50001 DROP VIEW IF EXISTS `product_price_history`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `product_price_history` AS SELECT 
 1 AS `product_id`,
 1 AS `organization_id`,
 1 AS `sku`,
 1 AS `product_name`,
 1 AS `current_price`,
 1 AS `original_price`,
 1 AS `is_promotion`,
 1 AS `price_updated_at`,
 1 AS `updated_by_user_id`,
 1 AS `updated_by_name`,
 1 AS `old_price`,
 1 AS `new_price`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barcode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'KRW',
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock_level` int DEFAULT '0',
  `is_promotion` tinyint(1) DEFAULT '0',
  `promotion_end_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_org_sku` (`organization_id`,`sku`),
  KEY `idx_products_org_sku` (`organization_id`,`sku`),
  KEY `idx_products_barcode` (`barcode`),
  KEY `idx_products_category` (`category`),
  KEY `idx_products_promotion` (`is_promotion`,`promotion_end_date`),
  KEY `idx_products_name` (`name`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,5,'SKU001','8801234567890','코카콜라 355ml','시원한 탄산음료','음료',1200.00,1500.00,'KRW','개',150,1,'2025-07-28 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(2,5,'SKU002','8801234567891','펩시콜라 355ml','상쾌한 탄산음료','음료',1100.00,1500.00,'KRW','개',120,1,'2025-07-28 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(3,5,'SKU003','8801234567892','새우깡 90g','바삭한 새우맛 과자','과자',1500.00,NULL,'KRW','봉',200,0,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(4,5,'SKU004','8801234567893','초코파이 12개입','부드러운 초콜릿 과자','과자',4500.00,5000.00,'KRW','박스',80,1,'2025-07-24 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(5,5,'SKU005','8801234567894','신라면 5개입','매운맛 라면','라면',3900.00,NULL,'KRW','묶음',100,0,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(6,6,'SKU001','8801234567890','코카콜라 355ml','시원한 탄산음료','음료',1300.00,1500.00,'KRW','개',100,1,'2025-07-26 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(7,6,'SKU006','8801234567895','짜파게티 5개입','짜장맛 라면','라면',4200.00,NULL,'KRW','묶음',90,0,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(8,6,'SKU007','8801234567896','허니버터칩','달콤한 감자칩','과자',1800.00,2000.00,'KRW','봉',150,1,'2025-07-23 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(9,7,'SKU001','8801234567890','코카콜라 355ml','시원한 탄산음료','음료',1250.00,1500.00,'KRW','개',80,1,'2025-07-28 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(10,7,'SKU008','8801234567897','빼빼로 아몬드','아몬드 초콜릿 과자','과자',1200.00,NULL,'KRW','개',200,0,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(11,7,'SKU009','8801234567898','육개장 사발면','매운 육개장맛','라면',1100.00,1300.00,'KRW','개',150,1,'2025-07-22 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(12,8,'SKU010','8801234567899','몽쉘 크림케이크','부드러운 크림케이크','제과',3500.00,NULL,'KRW','개',50,0,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(13,8,'SKU011','8801234567900','바나나우유','달콤한 바나나 우유','음료',1600.00,1800.00,'KRW','개',100,1,'2025-07-25 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38'),(14,9,'SKU012','8801234567901','진라면 순한맛','순한맛 라면','라면',900.00,NULL,'KRW','개',300,0,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(15,9,'SKU013','8801234567902','오예스','초콜릿 케이크','과자',2500.00,3000.00,'KRW','박스',60,1,'2025-07-31 09:49:38','2025-07-21 09:49:38','2025-07-21 09:49:38');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `data` json NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `thumbnail` mediumtext,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (26,'호ㅓㅏㅣ;','{\"scenes\": [{\"id\": \"7a01e994-ea7a-4520-8740-808244a6a6e7\", \"name\": \"기본 씬\", \"regions\": [{\"id\": \"8aaeda22-871b-4feb-af16-55b68828956f\", \"size\": 100, \"content\": {\"src\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAb0AAACeCAIAAAApA0M/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGMWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDMgNzkuOTY5MGE4NywgMjAyNS8wMy8wNi0xOToxMjowMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI2LjggKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNy0xNlQxNjowNjoxOCswOTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDctMTZUMTY6MDk6NTMrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDctMTZUMTY6MDk6NTMrMDk6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzYTI2NTc5LTFkMmUtYjM0ZS05ODFlLTFhMzk2NzM5NDk4NiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjc4YTkzNjMyLTAwN2ItMzY0Yi05YTA4LTMwMmFlZjNlMDI5NSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjVjYmI2Y2Y3LTgwOTctOTQ0OS1iMzM1LTgzODRhM2RlYWY1NSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWNiYjZjZjctODA5Ny05NDQ5LWIzMzUtODM4NGEzZGVhZjU1IiBzdEV2dDp3aGVuPSIyMDI1LTA3LTE2VDE2OjA2OjE4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjYuOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjNhMjY1NzktMWQyZS1iMzRlLTk4MWUtMWEzOTY3Mzk0OTg2IiBzdEV2dDp3aGVuPSIyMDI1LTA3LTE2VDE2OjA5OjUzKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjYuOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bly5tgAAfH1JREFUeJzsvXm4pUV17/9dVfVOezrzOT3PjM3cIkjQRkEkGkRjSwwB9Oq1Q+R3vSHqDRhNSDRCBmPU6FUMuQpoDKJRiIYoiChpQeymG2mgoaEP9HiGPufs+R2q1vr9seF47D490nQj7s/Dw/Pu2u+qqr3fPt+9qmrVKnp0QtDmN5jjOo50D9q8/HiEjnQPDpATDkwG1YvUjTZt2rR5udLWzTZt2rQ5MNq62aZNmzYHRls327Rp0+bAaOtmmzZt2hwYbd1s06ZNmwOjrZtt2rRpc2C0dbNNmzZtDoy2brZp06bNgdHWzTZt2rQ5MMyR7kCbNm1+kxgDngBGAAA54Fhg9nS3bQViAMAsIPrVt5rANgBAF9C9V9vdWXwwXd6dtm62adPmcHE/8N7dCt8NXLVb4f8EtgAA/gx4x6++tQ14CwDgE8CF07XyJeCbe+jAL/a/r3ujrZtt2rQ5LDw1RTTf9vzFN4Hybnc+/LxoAvjP3XRz/3nbvm85ONq62aZNm8PCD5+/uHPK2PxaYOtudz4w5XoN8DBw0kG1eO1BWe0H7XWhNm3aHBYm9XGXCc1dXjaBzwAA/uz5kgfwUqOtm23atDksTOrjl4Dmnm9b9/zFRcBpAIBvvYidOjja4/Q2bdocFk58/uIzwGeA84AzgPN3WxP/KQDg3UAE/DawBthysEP1a6dcH/sC5kl3o+1vtmnT5rBw5pShN4C7gL8GlgP3TykcA/4FAPAqAMD5z5fffVAtfnPKf48fVA17oO1vtmnT5nDxDuB84L+B1VNChd4L3Pu81/nQ84UnAwC6gfOAu4B/Aa7YLZBzn3xiynXfwfd6d9q62ebAWL9+/Zo1a6aWHH300Weccca0N4+MjNx5551TS2bNmnXuuefuqfK7775727ZWTDNKpdJFF120n7164IEHVq9evW7durGxsdtuu23FihXd3d0LFy48/fTTJ5vbpTOXXXbZtPU88cQTu3Rg90+xJybr3LvJrFmzFi9evGDBgt3fmvoN7IXTTjtt6dKlu5tMLX+J0g1cCFwI/Cnwhee9y4eA1lP6DwDAHOBvnr9/7PmLdcCZB9jWtNGdh4K2brY5MNasWXP55ZdPLVm+fPmPfvSjaW9etWrVLjevXLlyT7pZr9evuOKKjRs3TpZs2rRpWnGZygMPPPCnf/qn995779TC2267bWqLX/ziFwEMDw9P7czuujk4OHjppZdOduCRRx5pXexiuBcm69wfkxUrVlx77bW7yNytt956ww037LOhm266adJwqsnU8pc6EXDu87rZAACMAXcBALZMid+c5KcHrpsvGu35zTYvlHvvvXdwcHDat773ve/tfz3333//VNHcH/Prr7/+zDPP3EU0D456vf6hD31osgOHQYBuu+22E0444e67D27q7teQsd1Knnn+ojWI/v7zL7/9q/+dBwD4l72uwh9e2v5mm0PAunXrdncM6/X6/rhOk9x11127lNx6663ve9/79nT/zTfffM0110wtWb58+cUXX1wsFgFUq9V169btfwe+8pWvTHqpK1asmHYU32LlypX7WeckN910U+ti69atd95551Shv+KKK9auXZvP53e3Wr58+THHHDNthbNmzTrQPhx5PgM8AJwPLAEAbHze2Zzz/GzmfwIA3r3bLvLfed4PXfX8cL7FbcDqX73zvb8aDXrtbn3YveSgaOtmm0PALbfcsvtc5P333z/tzdNSr9evv/76XQpbnuy0Q/WRkZGpA+ElS5bccsstu0+zfvGLX9yTLzyVBx544Morr5ys6vOf//xebm6N+g+IqSp89dVX33zzzZOd37hx4/333z/t3MV73vOevcj3rx8dwJbntXKSOcA/AxGwFWhNm79qN8NTn7/4j1/VzTXPm0yyy7e1+y71aw+ox3ukrZttDp7ly5e3XKfbbrttZGSkr+9X1iwn/cclS5bsMgDfnanO5sqVKyf9xK9//etXX3317vffeOONU19OK5ot9jlDOjIycumll06tapcPcsi57LLL/uqv/mryO9mfhaCXA1cB5wLPADuArcCxwALg5OdXyePnl79P3s2wG/jH5+dAAXT96kL5VLoAABcAyw5pz3ejrZttDp4LLrhgcsi5atWqqS7nVP/xPe95zy4D6t255ZZbWhcrVqx497vfPambN9544z51c+XKlXsSzf3hIx/5yKSEfe5zn3shVe0/r3vd6yYbve+++15WfuVeOGnP4euL95rkbaqb2b2vhfIXf/movS7U5uB57WtfO3k9KXwtJhejV6xYMXv2tBkWf8nIyMjk3OKll156xhlnLFnSmgPDxo0bH3hg1/3Jg4ODUx3YN77xjQfVfQC4+eabJzV6xYoVe5lOffE4++yzD3+jbV4IbX+zzcFTKBSuvvrqll+5y1D9nnvuaV1M1dY9MTXU8ayzzsKvuqj33HPPLj5gvV6f+nJSZA+U9evXT84z7nNac6rV7oUHtPi+y4rZnhZ5tm7duntb/f39L/Y0Qpt90vY327wgzjvvvMnrhx9+ePJ6chy9P87g5M0rVqxoicJUtd1lKhPAjh07Dra/v6Rer7/lLW+ZfLn/05onTMf+tzsyMvKu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\", \"type\": \"image\"}}], \"resolutionId\": 1, \"transitionTime\": 5}]}','2025-07-22 01:29:49','2025-07-22 01:29:49','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAb0AAACeCAIAAAApA0M/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGMWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDMgNzkuOTY5MGE4NywgMjAyNS8wMy8wNi0xOToxMjowMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI2LjggKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNy0xNlQxNjowNjoxOCswOTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDctMTZUMTY6MDk6NTMrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDctMTZUMTY6MDk6NTMrMDk6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzYTI2NTc5LTFkMmUtYjM0ZS05ODFlLTFhMzk2NzM5NDk4NiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjc4YTkzNjMyLTAwN2ItMzY0Yi05YTA4LTMwMmFlZjNlMDI5NSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjVjYmI2Y2Y3LTgwOTctOTQ0OS1iMzM1LTgzODRhM2RlYWY1NSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWNiYjZjZjctODA5Ny05NDQ5LWIzMzUtODM4NGEzZGVhZjU1IiBzdEV2dDp3aGVuPSIyMDI1LTA3LTE2VDE2OjA2OjE4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjYuOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjNhMjY1NzktMWQyZS1iMzRlLTk4MWUtMWEzOTY3Mzk0OTg2IiBzdEV2dDp3aGVuPSIyMDI1LTA3LTE2VDE2OjA5OjUzKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjYuOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bly5tgAAfH1JREFUeJzsvXm4pUV17/9dVfVOezrzOT3PjM3cIkjQRkEkGkRjSwwB9Oq1Q+R3vSHqDRhNSDRCBmPU6FUMuQpoDKJRiIYoiChpQeymG2mgoaEP9HiGPufs+R2q1vr9seF47D490nQj7s/Dw/Pu2u+qqr3fPt+9qmrVKnp0QtDmN5jjOo50D9q8/HiEjnQPDpATDkwG1YvUjTZt2rR5udLWzTZt2rQ5MNq62aZNmzYHRls327Rp0+bAaOtmmzZt2hwYbd1s06ZNmwOjrZtt2rRpc2C0dbNNmzZtDoy2brZp06bNgdHWzTZt2rQ5MMyR7kCbNm1+kxgDngBGAAA54Fhg9nS3bQViAMAsIPrVt5rANgBAF9C9V9vdWXwwXd6dtm62adPmcHE/8N7dCt8NXLVb4f8EtgAA/gx4x6++tQ14CwDgE8CF07XyJeCbe+jAL/a/r3ujrZtt2rQ5LDw1RTTf9vzFN4Hybnc+/LxoAvjP3XRz/3nbvm85ONq62aZNm8PCD5+/uHPK2PxaYOtudz4w5XoN8DBw0kG1eO1BWe0H7XWhNm3aHBYm9XGXCc1dXjaBzwAA/uz5kgfwUqOtm23atDksTOrjl4Dmnm9b9/zFRcBpAIBvvYidOjja4/Q2bdocFk58/uIzwGeA84AzgPN3WxP/KQDg3UAE/DawBthysEP1a6dcH/sC5kl3o+1vtmnT5rBw5pShN4C7gL8GlgP3TykcA/4FAPAqAMD5z5fffVAtfnPKf48fVA17oO1vtmnT5nDxDuB84L+B1VNChd4L3Pu81/nQ84UnAwC6gfOAu4B/Aa7YLZBzn3xiynXfwfd6d9q62ebAWL9+/Zo1a6aWHH300Weccca0N4+MjNx5551TS2bNmnXuuefuqfK7775727ZWTDNKpdJFF120n7164IEHVq9evW7durGxsdtuu23FihXd3d0LFy48/fTTJ5vbpTOXXXbZtPU88cQTu3Rg90+xJybr3LvJrFmzFi9evGDBgt3fmvoN7IXTTjtt6dKlu5tMLX+J0g1cCFwI/Cnwhee9y4eA1lP6DwDAHOBvnr9/7PmLdcCZB9jWtNGdh4K2brY5MNasWXP55ZdPLVm+fPmPfvSjaW9etWrVLjevXLlyT7pZr9evuOKKjRs3TpZs2rRpWnGZygMPPPCnf/qn995779TC2267bWqLX/ziFwEMDw9P7czuujk4OHjppZdOduCRRx5pXexiuBcm69wfkxUrVlx77bW7yNytt956ww037LOhm266adJwqsnU8pc6EXDu87rZAACMAXcBALZMid+c5KcHrpsvGu35zTYvlHvvvXdwcHDat773ve/tfz3333//VNHcH/Prr7/+zDPP3EU0D456vf6hD31osgOHQYBuu+22E0444e67D27q7teQsd1Knnn+ojWI/v7zL7/9q/+dBwD4l72uwh9e2v5mm0PAunXrdncM6/X6/rhOk9x11127lNx6663ve9/79nT/zTfffM0110wtWb58+cUXX1wsFgFUq9V169btfwe+8pWvTHqpK1asmHYU32LlypX7WeckN910U+ti69atd95551Shv+KKK9auXZvP53e3Wr58+THHHDNthbNmzTrQPhx5PgM8AJwPLAEAbHze2Zzz/GzmfwIA3r3bLvLfed4PXfX8cL7FbcDqX73zvb8aDXrtbn3YveSgaOtmm0PALbfcsvtc5P333z/tzdNSr9evv/76XQpbnuy0Q/WRkZGpA+ElS5bccsstu0+zfvGLX9yTLzyVBx544Morr5ys6vOf//xebm6N+g+IqSp89dVX33zzzZOd37hx4/333z/t3MV73vOevcj3rx8dwJbntXKSOcA/AxGwFWhNm79qN8NTn7/4j1/VzTXPm0yyy7e1+y71aw+ox3ukrZttDp7ly5e3XKfbbrttZGSkr+9X1iwn/cclS5bsMgDfnanO5sqVKyf9xK9//etXX3317vffeOONU19OK5ot9jlDOjIycumll06tapcPcsi57LLL/uqv/mryO9mfhaCXA1cB5wLPADuArcCxwALg5OdXyePnl79P3s2wG/jH5+dAAXT96kL5VLoAABcAyw5pz3ejrZttDp4LLrhgcsi5atWqqS7nVP/xPe95zy4D6t255ZZbWhcrVqx497vfPambN9544z51c+XKlXsSzf3hIx/5yKSEfe5zn3shVe0/r3vd6yYbve+++15WfuVeOGnP4euL95rkbaqb2b2vhfIXf/movS7U5uB57WtfO3k9KXwtJhejV6xYMXv2tBkWf8nIyMjk3OKll156xhlnLFnSmgPDxo0bH3hg1/3Jg4ODUx3YN77xjQfVfQC4+eabJzV6xYoVe5lOffE4++yzD3+jbV4IbX+zzcFTKBSuvvrqll+5y1D9nnvuaV1M1dY9MTXU8ayzzsKvuqj33HPPLj5gvV6f+nJSZA+U9evXT84z7nNac6rV7oUHtPi+y4rZnhZ5tm7duntb/f39L/Y0Qpt90vY327wgzjvvvMnrhx9+ePJ6chy9P87g5M0rVqxoicJUtd1lKhPAjh07Dra/v6Rer7/lLW+ZfLn/05onTMf+tzsyMvKu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',1);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1,'2025-07-21 09:49:38'),(1,2,'2025-07-21 09:49:38'),(1,3,'2025-07-21 09:49:38'),(1,4,'2025-07-21 09:49:38'),(1,5,'2025-07-21 09:49:38'),(1,6,'2025-07-21 09:49:38'),(1,7,'2025-07-21 09:49:38'),(1,8,'2025-07-21 09:49:38'),(1,9,'2025-07-21 09:49:38'),(1,10,'2025-07-21 09:49:38'),(1,11,'2025-07-21 09:49:38'),(1,12,'2025-07-21 09:49:38'),(1,13,'2025-07-21 09:49:38'),(1,14,'2025-07-21 09:49:38'),(1,15,'2025-07-21 09:49:38'),(1,16,'2025-07-21 09:49:38'),(1,17,'2025-07-21 09:49:38'),(1,18,'2025-07-21 09:49:38'),(1,19,'2025-07-21 09:49:38'),(1,20,'2025-07-21 09:49:38'),(1,21,'2025-07-21 09:49:38'),(1,22,'2025-07-21 09:49:38'),(1,23,'2025-07-21 09:49:38'),(1,24,'2025-07-21 09:49:38'),(1,25,'2025-07-21 09:49:38'),(1,26,'2025-07-21 09:49:38'),(2,1,'2025-07-21 09:49:38'),(2,2,'2025-07-21 09:49:38'),(2,3,'2025-07-21 09:49:38'),(2,4,'2025-07-21 09:49:38'),(2,5,'2025-07-21 09:49:38'),(2,6,'2025-07-21 09:49:38'),(2,7,'2025-07-21 09:49:38'),(2,8,'2025-07-21 09:49:38'),(2,9,'2025-07-21 09:49:38'),(2,10,'2025-07-21 09:49:38'),(2,11,'2025-07-21 09:49:38'),(2,12,'2025-07-21 09:49:38'),(2,13,'2025-07-21 09:49:38'),(2,14,'2025-07-21 09:49:38'),(2,15,'2025-07-21 09:49:38'),(2,16,'2025-07-21 09:49:38'),(2,17,'2025-07-21 09:49:38'),(2,18,'2025-07-21 09:49:38'),(2,19,'2025-07-21 09:49:38'),(2,20,'2025-07-21 09:49:38'),(2,21,'2025-07-21 09:49:38'),(2,22,'2025-07-21 09:49:38'),(2,23,'2025-07-21 09:49:38'),(2,24,'2025-07-21 09:49:38'),(2,25,'2025-07-21 09:49:38'),(3,2,'2025-07-21 09:49:38'),(3,3,'2025-07-21 09:49:38'),(3,6,'2025-07-21 09:49:38'),(3,7,'2025-07-21 09:49:38'),(3,10,'2025-07-21 09:49:38'),(3,11,'2025-07-21 09:49:38'),(3,14,'2025-07-21 09:49:38'),(3,15,'2025-07-21 09:49:38'),(3,18,'2025-07-21 09:49:38'),(3,19,'2025-07-21 09:49:38'),(3,22,'2025-07-21 09:49:38'),(3,23,'2025-07-21 09:49:38'),(3,25,'2025-07-21 09:49:38'),(4,1,'2025-07-21 09:49:38'),(4,2,'2025-07-21 09:49:38'),(4,5,'2025-07-21 09:49:38'),(4,6,'2025-07-21 09:49:38'),(4,9,'2025-07-21 09:49:38'),(4,10,'2025-07-21 09:49:38'),(4,13,'2025-07-21 09:49:38'),(4,14,'2025-07-21 09:49:38'),(4,17,'2025-07-21 09:49:38'),(4,18,'2025-07-21 09:49:38'),(4,21,'2025-07-21 09:49:38'),(4,22,'2025-07-21 09:49:38'),(4,25,'2025-07-21 09:49:38'),(5,2,'2025-07-21 09:49:38'),(5,6,'2025-07-21 09:49:38'),(5,10,'2025-07-21 09:49:38'),(5,14,'2025-07-21 09:49:38'),(5,18,'2025-07-21 09:49:38'),(5,22,'2025-07-21 09:49:38'),(5,25,'2025-07-21 09:49:38');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_system` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'super_admin','시스템 관리자','시스템 전체 관리 권한',1,'2025-07-21 09:49:38'),(2,'admin','관리자','조직 내 전체 관리 권한',1,'2025-07-21 09:49:38'),(3,'manager','매니저','매장 관리 권한',1,'2025-07-21 09:49:38'),(4,'staff','직원','기본 사용 권한',1,'2025-07-21 09:49:38'),(5,'viewer','열람자','읽기 전용 권한',1,'2025-07-21 09:49:38');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_logs`
--

DROP TABLE IF EXISTS `system_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `details` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_logs_org_action` (`organization_id`,`action`),
  KEY `idx_logs_user` (`user_id`),
  KEY `idx_logs_entity` (`entity_type`,`entity_id`),
  KEY `idx_logs_created` (`created_at`),
  CONSTRAINT `system_logs_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `system_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_logs`
--

LOCK TABLES `system_logs` WRITE;
/*!40000 ALTER TABLE `system_logs` DISABLE KEYS */;
INSERT INTO `system_logs` VALUES (1,1,1,'user.login','user',1,'192.168.1.100','Mozilla/5.0 (Windows NT 10.0; Win64; x64)','{\"success\": true}','2025-07-21 06:49:38'),(2,1,2,'user.login','user',2,'192.168.1.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64)','{\"success\": true}','2025-07-21 07:49:38'),(3,5,6,'user.login','user',6,'192.168.1.110','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)','{\"success\": true}','2025-07-21 08:49:38'),(4,5,6,'product.update','product',1,'192.168.1.110','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)','{\"fields\": [\"current_price\", \"is_promotion\"], \"new_values\": {\"is_promotion\": true, \"current_price\": 1200}, \"old_values\": {\"is_promotion\": false, \"current_price\": 1500}}','2025-07-21 07:49:38'),(5,7,8,'device.update','device',9,'192.168.1.120','Mozilla/5.0 (Windows NT 10.0; Win64; x64)','{\"fields\": [\"status\"], \"new_values\": {\"status\": \"error\"}, \"old_values\": {\"status\": \"active\"}}','2025-07-21 08:49:38'),(6,1,2,'template.create','tag_template',4,'192.168.1.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64)','{\"name\": \"CJ프레시웨이 특가\", \"type\": \"promotion\"}','2025-07-21 04:49:38'),(7,5,3,'permission.grant','user',13,'192.168.1.102','Mozilla/5.0 (Windows NT 10.0; Win64; x64)','{\"role\": \"staff\", \"user\": \"gangnam.staff1@cjfreshway.com\"}','2025-07-21 05:49:38');
/*!40000 ALTER TABLE `system_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_templates`
--

DROP TABLE IF EXISTS `tag_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'price_tag, promotion, info, custom',
  `size_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'small, medium, large, flexible',
  `min_width` int NOT NULL,
  `min_height` int NOT NULL,
  `aspect_ratio` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layout_config` json NOT NULL,
  `preview_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `tag_templates_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tag_templates_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_templates`
--

LOCK TABLES `tag_templates` WRITE;
/*!40000 ALTER TABLE `tag_templates` DISABLE KEYS */;
INSERT INTO `tag_templates` VALUES (1,1,'기본 가격표','price_tag','medium',200,150,'4:3','{\"elements\": [{\"type\": \"product_name\", \"style\": {\"fontSize\": 18, \"fontWeight\": \"bold\"}, \"position\": {\"x\": 10, \"y\": 10}}, {\"type\": \"price\", \"style\": {\"color\": \"#FF0000\", \"fontSize\": 36, \"fontWeight\": \"bold\"}, \"position\": {\"x\": 10, \"y\": 60}}]}',NULL,'기본',1,1,'2025-07-21 09:49:38','2025-07-22 05:08:35'),(2,1,'프로모션 가격표','promotion','large',300,200,'3:2','{\"elements\": [{\"type\": \"product_name\", \"position\": {\"x\": 10, \"y\": 10}}, {\"type\": \"original_price\", \"style\": {\"textDecoration\": \"line-through\"}, \"position\": {\"x\": 10, \"y\": 50}}, {\"type\": \"price\", \"style\": {\"color\": \"#FF0000\", \"fontSize\": 42}, \"position\": {\"x\": 10, \"y\": 90}}, {\"type\": \"discount_rate\", \"style\": {\"color\": \"#0000FF\", \"fontSize\": 32}, \"position\": {\"x\": 200, \"y\": 90}}]}',NULL,'프로모션',1,1,'2025-07-21 09:49:38','2025-07-22 05:08:35'),(3,1,'정보 표시','info','small',150,100,'3:2','{\"elements\": [{\"type\": \"text\", \"content\": \"정보\", \"position\": {\"x\": 10, \"y\": 10}}]}',NULL,'정보',1,1,'2025-07-21 09:49:38','2025-07-22 05:08:35'),(4,1,'CJ프레시웨이 특가','promotion','flexible',250,180,'5:3','{\"elements\": [{\"url\": \"/assets/cj-logo.png\", \"type\": \"logo\", \"position\": {\"x\": 10, \"y\": 10}}, {\"type\": \"product_name\", \"position\": {\"x\": 10, \"y\": 50}}, {\"type\": \"price\", \"style\": {\"fontSize\": 48}, \"position\": {\"x\": 10, \"y\": 100}}]}',NULL,'특가',0,2,'2025-07-21 09:49:38','2025-07-21 09:49:38');
/*!40000 ALTER TABLE `tag_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `tag_utilization_analysis`
--

DROP TABLE IF EXISTS `tag_utilization_analysis`;
/*!50001 DROP VIEW IF EXISTS `tag_utilization_analysis`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `tag_utilization_analysis` AS SELECT 
 1 AS `device_id`,
 1 AS `mac_address`,
 1 AS `device_type`,
 1 AS `template_name`,
 1 AS `layout_type`,
 1 AS `max_tags`,
 1 AS `used_tags`,
 1 AS `available_slots`,
 1 AS `utilization_rate`,
 1 AS `product_tags`,
 1 AS `info_tags`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `granted` tinyint(1) DEFAULT '1',
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` int DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  KEY `assigned_by` (`assigned_by`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` int DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  KEY `assigned_by` (`assigned_by`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1,'2025-07-21 09:49:38',NULL,NULL),(2,2,'2025-07-21 09:49:38',1,NULL),(3,2,'2025-07-21 09:49:38',1,NULL),(4,2,'2025-07-21 09:49:38',1,NULL),(5,2,'2025-07-21 09:49:38',1,NULL),(6,3,'2025-07-21 09:49:38',3,NULL),(7,3,'2025-07-21 09:49:38',3,NULL),(8,3,'2025-07-21 09:49:38',3,NULL),(9,3,'2025-07-21 09:49:38',4,NULL),(10,3,'2025-07-21 09:49:38',4,NULL),(11,3,'2025-07-21 09:49:38',5,NULL),(12,3,'2025-07-21 09:49:38',5,NULL),(13,4,'2025-07-21 09:49:38',6,NULL),(14,4,'2025-07-21 09:49:38',6,NULL),(15,4,'2025-07-21 09:49:38',7,NULL);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_name` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_org` (`organization_id`),
  KEY `idx_users_active` (`is_active`),
  KEY `idx_user_last_login` (`last_login`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'superadmin@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','시스템관리자',1,'2025-07-22 08:56:46','2025-07-21 09:49:38','2025-07-22 08:56:46','신덕환'),(2,1,'admin@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','본사관리자',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','한승윤'),(3,2,'seoul.admin@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','서울지점관리자',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','우종윤'),(4,3,'gyeonggi.admin@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','경기지점관리자',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','강우성'),(5,4,'busan.admin@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','부산지점관리자',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','김부산'),(6,5,'gangnam.manager@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','강남점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','고성우'),(7,6,'yeoksam.manager@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','역삼점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','강연우'),(8,7,'samsung.manager@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','삼성점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','이우연'),(9,8,'bundang.manager@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','분당점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','김종민'),(10,9,'pangyo.manager@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','판교점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','이상현'),(11,10,'centum.manager@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','센텀시티점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','김푸르메'),(12,11,'haeundae.manager@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','해운대점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','강연식'),(13,5,'gangnam.staff1@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','강남점직원1',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','오하라'),(14,5,'gangnam.staff2@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','강남점직원2',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','구하민'),(15,6,'yeoksam.staff1@cjfreshway.com','$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu','역삼점직원1',1,NULL,'2025-07-21 09:49:38','2025-07-22 00:47:42','제춘식');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'cilinus'
--
/*!50003 DROP PROCEDURE IF EXISTS `GetDeviceStatusSummary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDeviceStatusSummary`(IN org_id INT )
BEGIN
    IF org_id IS NULL THEN
        -- 전체 요약
        SELECT 
            status,
            COUNT(*) as device_count,
            AVG(battery_level) as avg_battery,
            AVG(signal_strength) as avg_signal
        FROM esl_devices
        GROUP BY status;
    ELSE
        -- 특정 조직 및 하위 조직 요약
        SELECT 
            d.status,
            COUNT(*) as device_count,
            AVG(d.battery_level) as avg_battery,
            AVG(d.signal_strength) as avg_signal
        FROM esl_devices d
        INNER JOIN organization_closure oc ON d.organization_id = oc.descendant_id
        WHERE oc.ancestor_id = org_id
        GROUP BY d.status;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetOrganizationAncestors` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetOrganizationAncestors`(IN org_id INT)
BEGIN
    SELECT o.*, oc.depth as level
    FROM organizations o
    INNER JOIN organization_closure oc ON o.id = oc.ancestor_id
    WHERE oc.descendant_id = org_id
    ORDER BY oc.depth DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetOrganizationDescendants` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetOrganizationDescendants`(IN org_id INT)
BEGIN
    SELECT o.*, oc.depth as level
    FROM organizations o
    INNER JOIN organization_closure oc ON o.id = oc.descendant_id
    WHERE oc.ancestor_id = org_id
    ORDER BY oc.depth, o.name;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetPromotionRecommendations` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPromotionRecommendations`(
    IN org_id INT,
    IN limit_count INT 
)
BEGIN
    SELECT 
        p.*,
        COUNT(DISTINCT pt.device_id) as display_count,
        AVG(cu.completed_at - cu.created_at) as avg_update_time
    FROM products p
    LEFT JOIN price_tags pt ON p.id = pt.product_id
    LEFT JOIN content_updates cu ON p.id = cu.product_id AND cu.status = 'completed'
    WHERE p.organization_id IN (
        SELECT descendant_id 
        FROM organization_closure 
        WHERE ancestor_id = org_id
    )
    AND p.is_promotion = true
    AND p.promotion_end_date > NOW()
    GROUP BY p.id
    ORDER BY 
        p.promotion_end_date ASC,
        (p.original_price - p.current_price) / p.original_price DESC
    LIMIT limit_count;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserEffectivePermissions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserEffectivePermissions`(IN user_id INT)
BEGIN
    -- 역할 기반 권한
    SELECT DISTINCT p.*
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    INNER JOIN user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = user_id 
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    
    UNION
    
    -- 개별 부여된 권한
    SELECT DISTINCT p.*
    FROM permissions p
    INNER JOIN user_permissions up ON p.id = up.permission_id
    WHERE up.user_id = user_id 
        AND up.granted = true
        AND (up.expires_at IS NULL OR up.expires_at > NOW());
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `device_status_dashboard`
--

/*!50001 DROP VIEW IF EXISTS `device_status_dashboard`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `device_status_dashboard` AS select `o`.`id` AS `organization_id`,`o`.`name` AS `organization_name`,`o`.`type` AS `organization_type`,count(distinct `d`.`id`) AS `total_devices`,sum((case when (`d`.`status` = 'active') then 1 else 0 end)) AS `active_devices`,sum((case when (`d`.`status` = 'error') then 1 else 0 end)) AS `error_devices`,sum((case when (`d`.`status` = 'inactive') then 1 else 0 end)) AS `inactive_devices`,avg(`d`.`battery_level`) AS `avg_battery_level`,avg(`d`.`signal_strength`) AS `avg_signal_strength`,min(`d`.`battery_level`) AS `min_battery_level`,count((case when (`d`.`battery_level` < 20) then 1 end)) AS `low_battery_count`,max(`d`.`last_heartbeat`) AS `last_update` from (`organizations` `o` left join `esl_devices` `d` on((`o`.`id` = `d`.`organization_id`))) group by `o`.`id`,`o`.`name`,`o`.`type` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `organization_hierarchy`
--

/*!50001 DROP VIEW IF EXISTS `organization_hierarchy`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `organization_hierarchy` AS select `o`.`id` AS `id`,`o`.`name` AS `name`,`o`.`type` AS `type`,`o`.`address` AS `address`,`o`.`address_detail` AS `address_detail`,`o`.`postal_code` AS `postal_code`,`o`.`city` AS `city`,`o`.`district` AS `district`,`o`.`latitude` AS `latitude`,`o`.`longitude` AS `longitude`,`o`.`phone` AS `phone`,`o`.`business_hours` AS `business_hours`,`o`.`created_at` AS `created_at`,`o`.`updated_at` AS `updated_at`,(select `organization_closure`.`depth` from `organization_closure` where ((`organization_closure`.`descendant_id` = `o`.`id`) and (`organization_closure`.`ancestor_id` <> `o`.`id`)) order by `organization_closure`.`depth` desc limit 1) AS `level`,(select `o2`.`id` from (`organizations` `o2` join `organization_closure` `oc` on((`o2`.`id` = `oc`.`ancestor_id`))) where ((`oc`.`descendant_id` = `o`.`id`) and (`oc`.`depth` = 1))) AS `parent_id`,(select group_concat(`organization_closure`.`ancestor_id` order by `organization_closure`.`depth` DESC separator '/') from `organization_closure` where (`organization_closure`.`descendant_id` = `o`.`id`)) AS `path` from `organizations` `o` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `product_price_history`
--

/*!50001 DROP VIEW IF EXISTS `product_price_history`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `product_price_history` AS select `p`.`id` AS `product_id`,`p`.`organization_id` AS `organization_id`,`p`.`sku` AS `sku`,`p`.`name` AS `product_name`,`p`.`current_price` AS `current_price`,`p`.`original_price` AS `original_price`,`p`.`is_promotion` AS `is_promotion`,`cu`.`created_at` AS `price_updated_at`,`cu`.`created_by` AS `updated_by_user_id`,`u`.`user_name` AS `updated_by_name`,json_extract(`sl`.`details`,'$.old_values.current_price') AS `old_price`,json_extract(`sl`.`details`,'$.new_values.current_price') AS `new_price` from (((`products` `p` left join `content_updates` `cu` on(((`p`.`id` = `cu`.`product_id`) and (`cu`.`update_type` = 'price')))) left join `users` `u` on((`cu`.`created_by` = `u`.`id`))) left join `system_logs` `sl` on(((`sl`.`entity_type` = 'product') and (`sl`.`entity_id` = `p`.`id`) and (`sl`.`action` = 'product.update') and (json_extract(`sl`.`details`,'$.fields[0]') = 'current_price')))) order by `p`.`id`,`cu`.`created_at` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `tag_utilization_analysis`
--

/*!50001 DROP VIEW IF EXISTS `tag_utilization_analysis`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `tag_utilization_analysis` AS select `d`.`id` AS `device_id`,`d`.`mac_address` AS `mac_address`,`d`.`device_type` AS `device_type`,`dt`.`name` AS `template_name`,`dt`.`layout_type` AS `layout_type`,`dt`.`max_tags` AS `max_tags`,count(`pt`.`id`) AS `used_tags`,(`dt`.`max_tags` - count(`pt`.`id`)) AS `available_slots`,round(((count(`pt`.`id`) / `dt`.`max_tags`) * 100),2) AS `utilization_rate`,sum((case when (`pt`.`product_id` is not null) then 1 else 0 end)) AS `product_tags`,sum((case when (`pt`.`product_id` is null) then 1 else 0 end)) AS `info_tags` from ((`esl_devices` `d` join `device_templates` `dt` on((`d`.`device_template_id` = `dt`.`id`))) left join `price_tags` `pt` on(((`d`.`id` = `pt`.`device_id`) and (`pt`.`is_active` = true)))) group by `d`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-23  9:30:20
