CREATE DATABASE AustenRiggs CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
use AustenRiggs;
UNLOCK TABLES;

-- MySQL dump 10.13  Distrib 5.5.54, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: AustenRiggs
-- ------------------------------------------------------
-- Server version 5.5.54-0ubuntu0.14.04.1

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
-- Table structure for table `CatTypeInterview`
--

#DROP TABLE IF EXISTS `CatTypeInterview`;
#/*!40101 SET @saved_cs_client     = @@character_set_client */;
#/*!40101 SET character_set_client = utf8 */;
/*CREATE TABLE `CatTypeInterview` (
  `idType` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `typeInterview` varchar(45) NOT NULL,
  PRIMARY KEY (`idType`),
  UNIQUE KEY `typeInterview_UNIQUE` (`typeInterview`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;*/
#/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CatTypeInterview`
--

#LOCK TABLES `CatTypeInterview` WRITE;
#/*!40000 ALTER TABLE `CatTypeInterview` DISABLE KEYS */;
#INSERT INTO `CatTypeInterview` VALUES (1,'Dynamic');
#/*!40000 ALTER TABLE `CatTypeInterview` ENABLE KEYS */;
#UNLOCK TABLES;

--
-- Table structure for table `CatTypePerson`
--

#DROP TABLE IF EXISTS `CatTypePerson`;
#/*!40101 SET @saved_cs_client     = @@character_set_client */;
#/*!40101 SET character_set_client = utf8 */;
/*CREATE TABLE `CatTypePerson` (
  `idTypePerson` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `typePerson` varchar(11) NOT NULL,
  PRIMARY KEY (`idTypePerson`),
  UNIQUE KEY `typePerson_UNIQUE` (`typePerson`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;*/
#/*!40101 SET character_set_client = @saved_cs_client */;

#LOCK TABLES `CatTypePerson` WRITE;
#/*!40000 ALTER TABLE `CatTypePerson` DISABLE KEYS */;
#INSERT INTO `CatTypePerson` VALUES (3,'Default'),(1,'Interviewer'),(2,'Subject');
#/*!40000 ALTER TABLE `CatTypePerson` ENABLE KEYS */;
#UNLOCK TABLES;

drop table if exists documents;

CREATE TABLE documents (
  idDocument integer auto_increment primary key,
  name varchar(50) not null,
  hash varchar(100) not null,
  created_at timestamp not null default current_timestamp /* e.g. YYYY-MM-DD HH:MM:SS , 20061231153021 , 2006-12-31 15:30:21*/
);

DROP TABLE IF EXISTS `DialogInterviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DialogInterviews` (
  `idDialogInterview` int(10) unsigned NOT NULL AUTO_INCREMENT,
--  `idInterview` int(10) unsigned,
--  `typePerson` int(10) unsigned,
--  `stamp` int(10) unsigned,
  `content` mediumtext,
  `tagged` mediumtext,
  idDocument integer NOT NULL,
  PRIMARY KEY (`idDialogInterview`),
  FOREIGN KEY (idDocument)
    REFERENCES documents(idDocument)
    ON DELETE CASCADE
--  UNIQUE KEY `un_sentenceInterviews_idx` (`idInterview`,`stamp`),
--  KEY `fk_idInterview_idx` (`idInterview`),
--  KEY `fk_catTypePerson_idx` (`typePerson`),
--  CONSTRAINT `fk_idInterview` FOREIGN KEY (`idInterview`) REFERENCES `Interviews` (`idInterview`) ON DELETE NO ACTION ON UPDATE NO ACTION,
--  CONSTRAINT `fk_catTypePerson` FOREIGN KEY (`typePerson`) REFERENCES `CatTypePerson` (`idTypePerson`) ON DELETE NO ACTION ON UPDATE NO ACTION
);
/*!40101 SET character_set_client = @saved_cs_client */;


#DROP TABLE IF EXISTS `Interviewers`;
#/*!40101 SET @saved_cs_client     = @@character_set_client */;
#/*!40101 SET character_set_client = utf8 */;
/*CREATE TABLE `Interviewers` (
  `idInterviewer` int(10) unsigned AUTO_INCREMENT,
  `name` varchar(45),
  `lastName` varchar(45),
  PRIMARY KEY (`idInterviewer`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;*/
#/*!40101 SET character_set_client = @saved_cs_client */;

#LOCK TABLES `Interviewers` WRITE;
#/*!40000 ALTER TABLE `Interviewers` DISABLE KEYS */;
#INSERT INTO `Interviewers` VALUES (1,'Twitter','Twitter');
#/*!40000 ALTER TABLE `Interviewers` ENABLE KEYS */;
#UNLOCK TABLES;

#DROP TABLE IF EXISTS `Interviews`;
#/*!40101 SET @saved_cs_client     = @@character_set_client */;
#/*!40101 SET character_set_client = utf8 */;
/*CREATE TABLE `Interviews` (
  `idSubject` int(10) unsigned,
  `typeInterview` int(10) unsigned,
  `idInterviewer` int(10) unsigned,
  `idTranscriber` int(10) unsigned,
  `followUpNumber` int(11),
  `date` datetime,
  `content` mediumtext,
  `idInterview` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`idInterview`),
  #UNIQUE KEY `uniqueinterviews_idx` (`idSubject`,`typeInterview`,`idInterviewer`,`idTranscriber`,`followUpNumber`),
  KEY `fk_interviewer_idx` (`idInterviewer`),
  KEY `fk_transcriber_idx` (`idTranscriber`),
  KEY `fk_cattypeinterview_idx` (`typeInterview`),
  CONSTRAINT `fk_cattypeinterview` FOREIGN KEY (`typeInterview`) REFERENCES `CatTypeInterview` (`idType`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_interviewer` FOREIGN KEY (`idInterviewer`) REFERENCES `Interviewers` (`idInterviewer`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_subject` FOREIGN KEY (`idSubject`) REFERENCES `Subjects` (`idSubject`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_transcriber` FOREIGN KEY (`idTranscriber`) REFERENCES `Transcribers` (`idTranscriber`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */#;


#DROP TABLE IF EXISTS `Subjects`;
#/*!40101 SET @saved_cs_client     = @@character_set_client */;
#/*!40101 SET character_set_client = utf8 */;
/*CREATE TABLE `Subjects` (
  `idSubject` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`idSubject`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;*/
#/*!40101 SET character_set_client = @saved_cs_client */;

#LOCK TABLES `Subjects` WRITE;
#/*!40000 ALTER TABLE `Subjects` DISABLE KEYS */;
#INSERT INTO `Subjects` VALUES (1);
#/*!40000 ALTER TABLE `Subjects` ENABLE KEYS */;
#UNLOCK TABLES;


#DROP TABLE IF EXISTS `Transcribers`;
#/*!40101 SET @saved_cs_client     = @@character_set_client */;
#/*!40101 SET character_set_client = utf8 */;
/*CREATE TABLE `Transcribers` (
  `idTranscriber` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  PRIMARY KEY (`idTranscriber`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;*/
#/*!40101 SET character_set_client = @saved_cs_client */;

#LOCK TABLES `Transcribers` WRITE;
#/*!40000 ALTER TABLE `Transcribers` DISABLE KEYS */;
#INSERT INTO `Transcribers` VALUES (1,'Twitter','Twitter');
#/*!40000 ALTER TABLE `Transcribers` ENABLE KEYS */;
#UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-19 10:06:32
drop table if exists tagged_process;
drop table if exists cat_tags;

CREATE TABLE cat_tags (
id_cat_tag integer auto_increment primary key,
title varchar(50) not null unique,
color varchar(7) not null unique,
created_at timestamp not null default current_timestamp /* e.g. YYYY-MM-DD HH:MM:SS , 20061231153021 , 2006-12-31 15:30:21*/
);
CREATE TABLE tagged_process(
  id_tagged_process integer auto_increment primary key,
  id_cat_tag integer,
  idDialogInterview int(10) unsigned,
  stamp int(10) unsigned, 
  startpos int,
  sentence mediumtext,
  FOREIGN KEY (id_cat_tag)
    REFERENCES cat_tags(id_cat_tag)
    ON DELETE CASCADE,
    FOREIGN KEY (idDialogInterview)
    REFERENCES DialogInterviews(idDialogInterview)
 );

 /*Ejemplos cat_tags*/  
insert into cat_tags (title,color,created_at) values ('Misoginia','#ff0000','20061231153021');     
#insert into cat_tags (title,color,created_at) values ('Alto','#ff0000','20061231153021');     
#insert into cat_tags (title,color,created_at) values ('Medio','#00ff00','20061231153031');     
#insert into cat_tags (title,color,created_at) values ('Bajo','#0000ff','20061231153041'); 
