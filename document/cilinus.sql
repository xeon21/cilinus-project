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
INSERT INTO `price_tags` VALUES (1,1,1,2,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(2,1,2,2,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(3,1,3,1,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(4,1,4,2,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(5,2,5,1,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(6,2,1,2,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(7,2,NULL,3,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(8,2,NULL,3,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(9,3,1,2,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(10,3,2,2,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(11,3,3,1,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(12,3,4,2,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(13,4,1,4,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(14,4,2,4,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(15,4,3,1,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(16,4,4,4,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(17,4,5,1,5,1,1,NULL,1,5,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(18,4,NULL,3,6,1,1,NULL,1,6,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(19,5,6,1,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(20,5,7,1,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(21,5,8,2,3,1,1,NULL,1,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(22,5,6,1,4,1,1,NULL,1,4,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(23,8,9,1,1,1,1,NULL,1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(24,8,10,1,2,1,1,NULL,1,2,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(25,8,11,2,3,1,1,NULL,0,3,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(26,8,9,1,4,1,1,NULL,0,4,'2025-07-21 09:49:38','2025-07-21 09:49:38');
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
-- Temporary view structure for view `realtime_update_monitor`
--

DROP TABLE IF EXISTS `realtime_update_monitor`;
/*!50001 DROP VIEW IF EXISTS `realtime_update_monitor`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `realtime_update_monitor` AS SELECT 
 1 AS `update_id`,
 1 AS `update_type`,
 1 AS `status`,
 1 AS `retry_count`,
 1 AS `created_at`,
 1 AS `completed_at`,
 1 AS `duration_seconds`,
 1 AS `device_mac`,
 1 AS `location_store`,
 1 AS `product_name`,
 1 AS `product_sku`,
 1 AS `template_name`,
 1 AS `created_by_name`,
 1 AS `error_message`*/;
SET character_set_client = @saved_cs_client;

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
INSERT INTO `tag_templates` VALUES (1,NULL,'기본 가격표','price_tag','medium',200,150,'4:3','{\"elements\": [{\"type\": \"product_name\", \"style\": {\"fontSize\": 18, \"fontWeight\": \"bold\"}, \"position\": {\"x\": 10, \"y\": 10}}, {\"type\": \"price\", \"style\": {\"color\": \"#FF0000\", \"fontSize\": 36, \"fontWeight\": \"bold\"}, \"position\": {\"x\": 10, \"y\": 60}}]}',NULL,'기본',1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(2,NULL,'프로모션 가격표','promotion','large',300,200,'3:2','{\"elements\": [{\"type\": \"product_name\", \"position\": {\"x\": 10, \"y\": 10}}, {\"type\": \"original_price\", \"style\": {\"textDecoration\": \"line-through\"}, \"position\": {\"x\": 10, \"y\": 50}}, {\"type\": \"price\", \"style\": {\"color\": \"#FF0000\", \"fontSize\": 42}, \"position\": {\"x\": 10, \"y\": 90}}, {\"type\": \"discount_rate\", \"style\": {\"color\": \"#0000FF\", \"fontSize\": 32}, \"position\": {\"x\": 200, \"y\": 90}}]}',NULL,'프로모션',1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(3,NULL,'정보 표시','info','small',150,100,'3:2','{\"elements\": [{\"type\": \"text\", \"content\": \"정보\", \"position\": {\"x\": 10, \"y\": 10}}]}',NULL,'정보',1,1,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(4,1,'CJ프레시웨이 특가','promotion','flexible',250,180,'5:3','{\"elements\": [{\"url\": \"/assets/cj-logo.png\", \"type\": \"logo\", \"position\": {\"x\": 10, \"y\": 10}}, {\"type\": \"product_name\", \"position\": {\"x\": 10, \"y\": 50}}, {\"type\": \"price\", \"style\": {\"fontSize\": 48}, \"position\": {\"x\": 10, \"y\": 100}}]}',NULL,'특가',0,2,'2025-07-21 09:49:38','2025-07-21 09:49:38');
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
-- Temporary view structure for view `user_activity_summary`
--

DROP TABLE IF EXISTS `user_activity_summary`;
/*!50001 DROP VIEW IF EXISTS `user_activity_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `user_activity_summary` AS SELECT 
 1 AS `user_id`,
 1 AS `full_name`,
 1 AS `email`,
 1 AS `organization_id`,
 1 AS `organization_name`,
 1 AS `last_login`,
 1 AS `total_actions`,
 1 AS `product_actions`,
 1 AS `device_actions`,
 1 AS `content_updates`,
 1 AS `last_activity`*/;
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
INSERT INTO `users` VALUES (1,1,'superadmin@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','시스템관리자',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(2,1,'admin@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','본사관리자',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(3,2,'seoul.admin@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','서울지점관리자',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(4,3,'gyeonggi.admin@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','경기지점관리자',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(5,4,'busan.admin@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','부산지점관리자',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(6,5,'gangnam.manager@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','강남점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(7,6,'yeoksam.manager@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','역삼점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(8,7,'samsung.manager@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','삼성점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(9,8,'bundang.manager@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','분당점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(10,9,'pangyo.manager@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','판교점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(11,10,'centum.manager@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','센텀시티점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(12,11,'haeundae.manager@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','해운대점매니저',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(13,5,'gangnam.staff1@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','강남점직원1',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(14,5,'gangnam.staff2@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','강남점직원2',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38'),(15,6,'yeoksam.staff1@cjfreshway.com','$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','역삼점직원1',1,NULL,'2025-07-21 09:49:38','2025-07-21 09:49:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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
/*!50001 VIEW `product_price_history` AS select `p`.`id` AS `product_id`,`p`.`organization_id` AS `organization_id`,`p`.`sku` AS `sku`,`p`.`name` AS `product_name`,`p`.`current_price` AS `current_price`,`p`.`original_price` AS `original_price`,`p`.`is_promotion` AS `is_promotion`,`cu`.`created_at` AS `price_updated_at`,`cu`.`created_by` AS `updated_by_user_id`,`u`.`full_name` AS `updated_by_name`,json_extract(`sl`.`details`,'$.old_values.current_price') AS `old_price`,json_extract(`sl`.`details`,'$.new_values.current_price') AS `new_price` from (((`products` `p` left join `content_updates` `cu` on(((`p`.`id` = `cu`.`product_id`) and (`cu`.`update_type` = 'price')))) left join `users` `u` on((`cu`.`created_by` = `u`.`id`))) left join `system_logs` `sl` on(((`sl`.`entity_type` = 'product') and (`sl`.`entity_id` = `p`.`id`) and (`sl`.`action` = 'product.update') and (json_extract(`sl`.`details`,'$.fields[0]') = 'current_price')))) order by `p`.`id`,`cu`.`created_at` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `realtime_update_monitor`
--

/*!50001 DROP VIEW IF EXISTS `realtime_update_monitor`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `realtime_update_monitor` AS select `cu`.`id` AS `update_id`,`cu`.`update_type` AS `update_type`,`cu`.`status` AS `status`,`cu`.`retry_count` AS `retry_count`,`cu`.`created_at` AS `created_at`,`cu`.`completed_at` AS `completed_at`,timestampdiff(SECOND,`cu`.`created_at`,ifnull(`cu`.`completed_at`,now())) AS `duration_seconds`,`d`.`mac_address` AS `device_mac`,`d`.`location_store` AS `location_store`,`p`.`name` AS `product_name`,`p`.`sku` AS `product_sku`,`tt`.`name` AS `template_name`,`u`.`full_name` AS `created_by_name`,`cu`.`error_message` AS `error_message` from ((((`content_updates` `cu` left join `esl_devices` `d` on((`cu`.`device_id` = `d`.`id`))) left join `products` `p` on((`cu`.`product_id` = `p`.`id`))) left join `tag_templates` `tt` on((`cu`.`tag_template_id` = `tt`.`id`))) left join `users` `u` on((`cu`.`created_by` = `u`.`id`))) where (`cu`.`created_at` > (now() - interval 24 hour)) order by `cu`.`created_at` desc */;
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

--
-- Final view structure for view `user_activity_summary`
--

/*!50001 DROP VIEW IF EXISTS `user_activity_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `user_activity_summary` AS select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,`u`.`organization_id` AS `organization_id`,`o`.`name` AS `organization_name`,`u`.`last_login` AS `last_login`,count(distinct `sl`.`id`) AS `total_actions`,count(distinct (case when (`sl`.`action` like 'product.%') then `sl`.`id` end)) AS `product_actions`,count(distinct (case when (`sl`.`action` like 'device.%') then `sl`.`id` end)) AS `device_actions`,count(distinct `cu`.`id`) AS `content_updates`,max(`sl`.`created_at`) AS `last_activity` from (((`users` `u` left join `organizations` `o` on((`u`.`organization_id` = `o`.`id`))) left join `system_logs` `sl` on((`u`.`id` = `sl`.`user_id`))) left join `content_updates` `cu` on((`u`.`id` = `cu`.`created_by`))) where (`u`.`is_active` = true) group by `u`.`id` */;
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

-- Dump completed on 2025-07-22  9:06:33
