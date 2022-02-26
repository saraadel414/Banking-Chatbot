-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nbechatbot
-- ------------------------------------------------------
-- Server version	8.0.25

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
-- Table structure for table `bankaccount`
--

DROP TABLE IF EXISTS `bankaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bankaccount` (
  `BANKACCOUNTID` int NOT NULL AUTO_INCREMENT,
  `BA_BALANCE` int DEFAULT NULL,
  `PASSWORD` varchar(50) DEFAULT NULL,
  `CUSTOMERIDFK` int NOT NULL,
  `EMAIL` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`BANKACCOUNTID`),
  KEY `BANKACCOUNTID` (`BANKACCOUNTID`),
  KEY `CUSTOMERIDFK_idx` (`CUSTOMERIDFK`),
  CONSTRAINT `CUSTOMERIDFK` FOREIGN KEY (`CUSTOMERIDFK`) REFERENCES `customer` (`CUSTOMERID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bankaccount`
--

LOCK TABLES `bankaccount` WRITE;
/*!40000 ALTER TABLE `bankaccount` DISABLE KEYS */;
INSERT INTO `bankaccount` VALUES (25,130037,'147852369',2,NULL),(26,34640,'7654321',2,NULL),(27,90150,'998877',2,NULL),(28,90733,'666555444',5,NULL),(29,109560,'333222111',6,NULL),(30,130528,'1234567',4,NULL),(31,21530,'1234567',4,NULL),(32,67000,'1234567',3,NULL);
/*!40000 ALTER TABLE `bankaccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banktransaction`
--

DROP TABLE IF EXISTS `banktransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banktransaction` (
  `BANKTRANSACTIONID` int NOT NULL AUTO_INCREMENT,
  `BTCREATIONDATE` varchar(45) DEFAULT NULL,
  `BTAMOUNT` int DEFAULT NULL,
  `BTFROMACC` int DEFAULT NULL,
  `BTTOACC` int DEFAULT NULL,
  PRIMARY KEY (`BANKTRANSACTIONID`),
  KEY `BANKTRANSACTIONID` (`BANKTRANSACTIONID`) /*!80000 INVISIBLE */
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banktransaction`
--

LOCK TABLES `banktransaction` WRITE;
/*!40000 ALTER TABLE `banktransaction` DISABLE KEYS */;
INSERT INTO `banktransaction` VALUES (53,'2021-07-14 15:53:18',650,29,27),(56,'2021-07-14 15:59:38',60,29,30),(60,'2021-07-14 20:6:41',500,29,31),(64,'2021-07-13 21:59:19',700,25,28),(65,'2021-07-13 20:57:19',500,25,28),(71,'2021-07-14 21:31:8',900,25,28),(72,'2021-07-13 10:59:19',700,25,28),(92,'2021-07-18 16:44:59',100,25,26),(93,'2021-07-18 14:49:34',100,29,27),(96,'2021-07-19 17:35:59',200,28,26),(98,'2021-07-19 18:32:28',40,28,25),(99,'2021-07-19 19:2:5',80,28,25),(100,'2021-07-19 19:6:16',90,28,30),(101,'2021-07-19 19:8:40',100,28,30),(102,'2021-07-19 21:23:26',700,28,30),(104,'2021-07-25 4:37:58',100,29,26);
/*!40000 ALTER TABLE `banktransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `CUSTOMERID` int NOT NULL AUTO_INCREMENT,
  `CUSTOMERNAME` varchar(100) NOT NULL,
  `CUSTOMERADDRESS` varchar(100) NOT NULL,
  `CUSTOMERMOBILE` varchar(50) NOT NULL,
  `PASSWORD` varchar(50) NOT NULL,
  PRIMARY KEY (`CUSTOMERID`),
  KEY `CUSTOMERID` (`CUSTOMERID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (2,'Salma Elkholy','Dokki','01012131455','789654123'),(3,'Ahmed el basha ','maadi','01125659586','123654789'),(4,'Aya el negm ','October','01147856932','369852147'),(5,'Abdallah fares ','12 Shehab st mohandseen ','01123698521','96385274'),(6,'Kariman mohamed ','Mohndseen','01023366998','987456'),(7,'nour ahmed','Fayoum','01223665887','12345678');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `FAQID` int NOT NULL AUTO_INCREMENT,
  `Question` varchar(100) DEFAULT NULL,
  `COUNTER` int DEFAULT NULL,
  PRIMARY KEY (`FAQID`),
  KEY `FAQID` (`FAQID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,'what is covid',2);
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `FEEDBACKID` int NOT NULL AUTO_INCREMENT,
  `Rate` varchar(100) DEFAULT NULL,
  `COUNTER` int DEFAULT NULL,
  PRIMARY KEY (`FEEDBACKID`),
  KEY `FEEDBACKID` (`FEEDBACKID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'poor',0),(2,'bad',0),(3,'fair',1),(4,'good',3),(5,'excellent',1);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-27 17:39:21
