-- MySQL dump 10.13  Distrib 5.7.19, for osx10.12 (x86_64)
--
-- Host: localhost    Database: moaa_dev
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `File_info`
--

DROP TABLE IF EXISTS `File_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `File_info` (
  `file_ID` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(100) CHARACTER SET utf8 NOT NULL,
  `size` int(11) DEFAULT NULL,
  `mimetype` varchar(120) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `Gpath` varchar(100) DEFAULT NULL,
  `Dpath` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `Bpath` varchar(100) DEFAULT NULL,
  `user_ID` varchar(50) NOT NULL,
  `_sec` varchar(70) NOT NULL,
  PRIMARY KEY (`file_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `File_info`
--

LOCK TABLES `File_info` WRITE;
/*!40000 ALTER TABLE `File_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `File_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('NLpO2zX_0GnGXJXLfEvYZ-n5XQdMnni4',1518677998,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"local:test\"}}'),('vvUDMcqh3fE3weWciDY2GBwSJIOkQy12',1518677967,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test` (
  `id` int(11) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (1,'336AB9EB4585FE69263A1FD5AB2282B5'),(2,'2566D001CEC544E544F4309E9D07A27F3500E48D41DB3011FC66C821B9872AF8173973D2FB9DB54EEA07E81B3BA6BECDFFD44CAC9BB8D83505974C9DB58DC5C9FD253E4B533F6F62AA45974A7D2EACC6E427A27C8C3FFF57441B1063C25780D0775F10A32FAA60ADBEFD591FDACE2DBFD0F077FB0D0EF5056B3277993A1A0D6B5FD4B2DE6C95ECCC68DDFFF561F8411E');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_info` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(32) NOT NULL,
  `password` varchar(300) DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `salt` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `user_ID` (`user_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_token`
--

DROP TABLE IF EXISTS `user_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_token` (
  `token_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` int(11) DEFAULT NULL,
  `Gaccess` varchar(200) DEFAULT NULL,
  `Grefresh` varchar(200) DEFAULT NULL,
  `Daccess` varchar(200) DEFAULT NULL,
  `Drefresh` varchar(200) DEFAULT NULL,
  `Baccess` varchar(200) DEFAULT NULL,
  `Brefresh` varchar(200) DEFAULT NULL,
  `Bfolder` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`token_ID`),
  UNIQUE KEY `user_ID` (`user_ID`),
  CONSTRAINT `user_token_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `user_info` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_token`
--

LOCK TABLES `user_token` WRITE;
/*!40000 ALTER TABLE `user_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_token` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-02-14 16:37:34
