-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: tramway.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `RegistroAuditoria`
--

DROP TABLE IF EXISTS `RegistroAuditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RegistroAuditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `entrada` datetime DEFAULT NULL,
  `salida` datetime DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `RegistroAuditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`),
  CONSTRAINT `RegistroAuditoria_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RegistroAuditoria`
--

LOCK TABLES `RegistroAuditoria` WRITE;
/*!40000 ALTER TABLE `RegistroAuditoria` DISABLE KEYS */;
INSERT INTO `RegistroAuditoria` VALUES (8,13,'2025-06-05 23:27:42','2025-06-08 16:59:07','::1'),(9,13,'2025-06-05 23:36:22','2025-06-05 23:56:55','192.168.1.123'),(10,10,'2025-06-05 23:52:42','2025-06-08 16:59:07','::1'),(11,10,'2025-06-05 23:55:47','2025-06-08 16:59:07','::1'),(12,10,'2025-06-05 23:57:05','2025-06-08 16:59:07','::1'),(13,10,'2025-06-05 23:59:12','2025-06-05 23:59:14','::1'),(14,10,'2025-06-05 23:59:25','2025-06-06 00:00:00','::1'),(15,10,'2025-06-06 00:05:00','2025-06-08 16:59:07','::1'),(16,10,'2025-06-06 01:41:06','2025-06-06 01:43:09','::1'),(17,16,'2025-06-06 01:43:20','2025-06-06 02:14:36','::1'),(18,10,'2025-06-06 02:14:45','2025-06-08 16:59:07','::1'),(19,10,'2025-06-08 00:33:27','2025-06-08 16:59:07','::1'),(20,10,'2025-06-08 01:19:52','2025-06-08 01:19:58','::1'),(21,16,'2025-06-08 01:20:09','2025-06-08 01:23:06','::1'),(22,16,'2025-06-08 01:24:26','2025-06-08 01:24:35','::1'),(23,16,'2025-06-08 01:31:06','2025-06-08 01:32:36','::ffff:192.168.2.3'),(24,10,'2025-06-08 01:31:33','2025-06-08 16:59:07','::ffff:192.168.2.8'),(25,16,'2025-06-08 01:39:19','2025-06-08 01:41:31','::ffff:192.168.2.7'),(26,10,'2025-06-08 01:43:00','2025-06-08 16:59:07','::ffff:192.168.2.3'),(27,16,'2025-06-08 02:28:06','2025-06-08 02:52:08','::ffff:192.168.2.8'),(28,10,'2025-06-08 02:52:33','2025-06-08 16:59:07','::1'),(29,10,'2025-06-08 15:04:14','2025-06-08 16:59:56','::1'),(30,16,'2025-06-08 15:39:06','2025-06-08 16:59:56','::ffff:192.168.2.7'),(31,10,'2025-06-08 16:45:33','2025-06-08 16:59:56','::ffff:192.168.2.3'),(32,10,'2025-06-08 18:28:45','2025-06-09 02:59:56','::ffff:192.168.2.3'),(33,10,'2025-06-08 19:21:26','2025-06-09 11:59:56','::ffff:192.168.2.3'),(34,10,'2025-06-08 20:22:02','2025-06-09 11:59:56','::ffff:192.168.2.3'),(35,10,'2025-06-08 21:13:05','2025-06-09 11:59:56','::ffff:192.168.2.3'),(36,10,'2025-06-08 22:09:50','2025-06-09 11:59:56','::ffff:192.168.2.3'),(37,10,'2025-06-09 02:15:07','2025-06-09 11:59:56','::ffff:192.168.2.3'),(38,10,'2025-06-09 03:05:18','2025-06-09 11:59:56','::ffff:192.168.2.3'),(39,10,'2025-06-09 12:15:14','2025-06-15 19:59:54','::1'),(40,16,'2025-06-12 14:48:12','2025-06-15 19:59:54','::1'),(41,10,'2025-06-15 19:48:43','2025-06-15 19:59:54','::1'),(42,10,'2025-06-15 20:01:48',NULL,'::1'),(43,10,'2025-06-15 21:55:47',NULL,'::1');
/*!40000 ALTER TABLE `RegistroAuditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ActivosFaltantes`
--

DROP TABLE IF EXISTS `ActivosFaltantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ActivosFaltantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unidad` int DEFAULT NULL,
  `existencias` int DEFAULT NULL,
  `diferencia_cantidad` int DEFAULT NULL,
  `diferencia_valor` decimal(10,2) DEFAULT NULL,
  `funcionario_id` int DEFAULT NULL,
  `jefe_id` int DEFAULT NULL,
  `observaciones` text,
  `fecha` date DEFAULT NULL,
  `bien_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `funcionario_id` (`funcionario_id`),
  KEY `jefe_id` (`jefe_id`),
  KEY `ActivosFaltantes_ibfk_100_idx` (`bien_id`),
  KEY `departamento_idx` (`unidad`),
  CONSTRAINT `ActivosFaltantes_ibfk_100` FOREIGN KEY (`bien_id`) REFERENCES `Activos` (`id`),
  CONSTRAINT `ActivosFaltantes_ibfk_2` FOREIGN KEY (`funcionario_id`) REFERENCES `Usuarios` (`id`),
  CONSTRAINT `ActivosFaltantes_ibfk_3` FOREIGN KEY (`jefe_id`) REFERENCES `Usuarios` (`id`),
  CONSTRAINT `ActivosFaltantes_ibfk_5` FOREIGN KEY (`funcionario_id`) REFERENCES `Usuarios` (`id`),
  CONSTRAINT `ActivosFaltantes_ibfk_6` FOREIGN KEY (`jefe_id`) REFERENCES `Usuarios` (`id`),
  CONSTRAINT `departamento` FOREIGN KEY (`unidad`) REFERENCES `Departamento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActivosFaltantes`
--

LOCK TABLES `ActivosFaltantes` WRITE;
/*!40000 ALTER TABLE `ActivosFaltantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ActivosFaltantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Componentes`
--

DROP TABLE IF EXISTS `Componentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Componentes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bien_id` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `numero_serial` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bien_id` (`bien_id`),
  CONSTRAINT `Componentes_ibfk_1` FOREIGN KEY (`bien_id`) REFERENCES `Activos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Componentes`
--

LOCK TABLES `Componentes` WRITE;
/*!40000 ALTER TABLE `Componentes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Componentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ConceptoDesincorporacion`
--

DROP TABLE IF EXISTS `ConceptoDesincorporacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ConceptoDesincorporacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ConceptoDesincorporacion`
--

LOCK TABLES `ConceptoDesincorporacion` WRITE;
/*!40000 ALTER TABLE `ConceptoDesincorporacion` DISABLE KEYS */;
INSERT INTO `ConceptoDesincorporacion` VALUES (18,'Desincorporación por Traspaso','51');
/*!40000 ALTER TABLE `ConceptoDesincorporacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ConceptoIncorporacion`
--

DROP TABLE IF EXISTS `ConceptoIncorporacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ConceptoIncorporacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ConceptoIncorporacion`
--

LOCK TABLES `ConceptoIncorporacion` WRITE;
/*!40000 ALTER TABLE `ConceptoIncorporacion` DISABLE KEYS */;
INSERT INTO `ConceptoIncorporacion` VALUES (3,'Inventario Inicial','01');
/*!40000 ALTER TABLE `ConceptoIncorporacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Departamento`
--

DROP TABLE IF EXISTS `Departamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Departamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Departamento`
--

LOCK TABLES `Departamento` WRITE;
/*!40000 ALTER TABLE `Departamento` DISABLE KEYS */;
INSERT INTO `Departamento` VALUES (7,'Sistemas','0'),(9,'Despacho','1'),(10,'Apostilla','2'),(11,'Consejo Local Participaciones Publicas','3'),(12,'CPDNNA','4'),(13,'Registro Civil Táriba','5'),(14,'Registro Civil Palo Gordo','6'),(15,'Registro Civil La Florida','7'),(16,'Talento Humano','8'),(17,'Presupuesto','9'),(18,'Hacienda','10'),(19,'Tesorería','11'),(20,'Compras y Suministros','12'),(21,'Bienes','13'),(22,'DATCA','14'),(23,'Rentas','15'),(24,'Comunicación, Información e Imagen','16'),(25,'Infraestructura','17'),(26,'Atención al Ciudadano','18'),(27,'Planificación y Gestión Urbana','19'),(28,'Catastro','20'),(29,'Vivienda','22'),(30,'Desarrollo Social','23'),(31,'Mercado Municipal','25'),(32,'Seguridad Laboral','26'),(33,'Sindicatura','27'),(34,'Servicios Públicos','28');
/*!40000 ALTER TABLE `Departamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DesincorporacionActivo`
--

DROP TABLE IF EXISTS `DesincorporacionActivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DesincorporacionActivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bien_id` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `concepto_id` int DEFAULT NULL,
  `dept_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bien_id` (`bien_id`),
  KEY `concepto_id` (`concepto_id`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `DesincorporacionActivo_ibfk_1` FOREIGN KEY (`bien_id`) REFERENCES `Activos` (`id`),
  CONSTRAINT `DesincorporacionActivo_ibfk_2` FOREIGN KEY (`concepto_id`) REFERENCES `ConceptoDesincorporacion` (`id`),
  CONSTRAINT `DesincorporacionActivo_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `DesincorporacionActivo_ibfk_4` FOREIGN KEY (`bien_id`) REFERENCES `Activos` (`id`),
  CONSTRAINT `DesincorporacionActivo_ibfk_5` FOREIGN KEY (`concepto_id`) REFERENCES `ConceptoDesincorporacion` (`id`),
  CONSTRAINT `DesincorporacionActivo_ibfk_6` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DesincorporacionActivo`
--

LOCK TABLES `DesincorporacionActivo` WRITE;
/*!40000 ALTER TABLE `DesincorporacionActivo` DISABLE KEYS */;
INSERT INTO `DesincorporacionActivo` VALUES (5,17,'2025-06-02',123.00,10,18,9);
/*!40000 ALTER TABLE `DesincorporacionActivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadoActivo`
--

DROP TABLE IF EXISTS `EstadoActivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadoActivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadoActivo`
--

LOCK TABLES `EstadoActivo` WRITE;
/*!40000 ALTER TABLE `EstadoActivo` DISABLE KEYS */;
INSERT INTO `EstadoActivo` VALUES (2,'Nuevo'),(3,'Usado'),(4,'Dañado');
/*!40000 ALTER TABLE `EstadoActivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IncorporacionActivo`
--

DROP TABLE IF EXISTS `IncorporacionActivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IncorporacionActivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bien_id` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `concepto_id` int NOT NULL,
  `dept_id` int NOT NULL,
  `isActive` int DEFAULT NULL,
  `isTraslado` int DEFAULT NULL,
  `observaciones` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bien_id` (`bien_id`),
  KEY `concepto_id` (`concepto_id`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `IncorporacionActivo_ibfk_1` FOREIGN KEY (`bien_id`) REFERENCES `Activos` (`id`),
  CONSTRAINT `IncorporacionActivo_ibfk_2` FOREIGN KEY (`concepto_id`) REFERENCES `ConceptoIncorporacion` (`id`),
  CONSTRAINT `IncorporacionActivo_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `IncorporacionActivo_ibfk_4` FOREIGN KEY (`bien_id`) REFERENCES `Activos` (`id`),
  CONSTRAINT `IncorporacionActivo_ibfk_5` FOREIGN KEY (`concepto_id`) REFERENCES `ConceptoIncorporacion` (`id`),
  CONSTRAINT `IncorporacionActivo_ibfk_6` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IncorporacionActivo`
--

LOCK TABLES `IncorporacionActivo` WRITE;
/*!40000 ALTER TABLE `IncorporacionActivo` DISABLE KEYS */;
INSERT INTO `IncorporacionActivo` VALUES (15,17,'2025-06-03',123.00,3223,3,18,NULL,NULL,NULL),(16,17,'2025-06-08',1500.00,18,3,23,NULL,NULL,NULL),(17,21,'2025-06-08',1500.00,20,3,19,NULL,NULL,NULL),(18,44,'2025-06-08',1500.00,1,3,12,NULL,NULL,NULL),(19,21,'2025-06-09',1500.00,20,3,9,NULL,NULL,NULL),(20,19,'2025-06-12',1500.00,18,3,21,NULL,NULL,NULL),(21,20,'2025-06-12',1000.00,5,3,21,NULL,NULL,NULL),(22,44,'2025-06-15',1500.00,1,3,9,1,NULL,NULL),(23,16,'2025-06-15',123.00,1,3,7,1,NULL,NULL),(24,44,'2025-06-15',1500.00,1,3,7,1,NULL,NULL);
/*!40000 ALTER TABLE `IncorporacionActivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RegistroLogs`
--

DROP TABLE IF EXISTS `RegistroLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RegistroLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `fecha` datetime DEFAULT (now()),
  `accion` varchar(255) DEFAULT NULL,
  `detalles` text,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `RegistroLogs_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`),
  CONSTRAINT `RegistroLogs_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RegistroLogs`
--

LOCK TABLES `RegistroLogs` WRITE;
/*!40000 ALTER TABLE `RegistroLogs` DISABLE KEYS */;
INSERT INTO `RegistroLogs` VALUES (1,16,'2025-06-08 02:28:58','create_user','Usuario creado: Adrian Vergel'),(2,10,'2025-06-15 20:24:58','Crear Incorporación','Se creó la incorporación del Bien: 123'),(3,10,'2025-06-15 20:26:21','Crear Incorporación','Se creó la incorporación del Bien: ID128756');
/*!40000 ALTER TABLE `RegistroLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Activos`
--

DROP TABLE IF EXISTS `Activos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Activos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subgrupo_id` int DEFAULT NULL,
  `cantidad` int NOT NULL,
  `nombre_descripcion` text NOT NULL,
  `marca_id` int DEFAULT NULL,
  `modelo_id` int DEFAULT NULL,
  `numero_serial` varchar(100) DEFAULT NULL,
  `valor_unitario` decimal(10,2) DEFAULT NULL,
  `valor_total` decimal(10,2) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `dept_id` int DEFAULT NULL,
  `estado_id` int DEFAULT NULL,
  `parroquia_id` int DEFAULT NULL,
  `numero_identificacion` varchar(100) NOT NULL,
  `isComputer` int DEFAULT NULL,
  `isActive` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_identificacion_UNIQUE` (`numero_identificacion`),
  KEY `subgrupo_id` (`subgrupo_id`),
  KEY `dept_id` (`dept_id`),
  KEY `estado_id` (`estado_id`),
  KEY `parroquia_id` (`parroquia_id`),
  KEY `fk_marca_idx` (`marca_id`),
  KEY `fk_modelo_idx` (`modelo_id`),
  CONSTRAINT `Activos_ibfk_1` FOREIGN KEY (`subgrupo_id`) REFERENCES `SubgrupoActivos` (`id`),
  CONSTRAINT `Activos_ibfk_2` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `Activos_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `EstadoActivo` (`id`),
  CONSTRAINT `Activos_ibfk_4` FOREIGN KEY (`parroquia_id`) REFERENCES `Parroquia` (`id`),
  CONSTRAINT `Activos_ibfk_5` FOREIGN KEY (`subgrupo_id`) REFERENCES `SubgrupoActivos` (`id`),
  CONSTRAINT `Activos_ibfk_6` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `Activos_ibfk_7` FOREIGN KEY (`estado_id`) REFERENCES `EstadoActivo` (`id`),
  CONSTRAINT `Activos_ibfk_8` FOREIGN KEY (`parroquia_id`) REFERENCES `Parroquia` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Activos`
--

LOCK TABLES `Activos` WRITE;
/*!40000 ALTER TABLE `Activos` DISABLE KEYS */;
INSERT INTO `Activos` VALUES (16,18,1,'123sad',29,7,'1234456',123.00,123.00,'2025-05-14',7,2,10,'123',NULL,NULL),(17,18,18,'Mesa de Oficina',29,7,'SN23456789',150.00,1500.00,'2023-10-01',7,2,10,'ID123456',NULL,NULL),(19,18,18,'Mesa de Oficina',29,7,'SN23456789',150.00,1500.00,'2023-10-01',7,2,10,'ID128456',NULL,NULL),(20,18,5,'Silla Ejecutiva',29,7,'SN98765432',200.00,1000.00,'2023-10-02',7,2,9,'ID789012',NULL,NULL),(21,19,20,'Estante de Almacenamiento',29,7,'SN45678901',75.00,1500.00,'2023-10-03',7,3,9,'ID345678',NULL,NULL),(44,21,1,'Mesa de Oficina',29,7,'SN23456789',150.00,1500.00,'2023-10-01',7,2,10,'ID128756',NULL,NULL);
/*!40000 ALTER TABLE `Activos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Parroquia`
--

DROP TABLE IF EXISTS `Parroquia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Parroquia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parroquia`
--

LOCK TABLES `Parroquia` WRITE;
/*!40000 ALTER TABLE `Parroquia` DISABLE KEYS */;
INSERT INTO `Parroquia` VALUES (9,'Táriba'),(10,'La Florida'),(11,'Amenodoro Rangel Lamús');
/*!40000 ALTER TABLE `Parroquia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubgrupoActivos`
--

DROP TABLE IF EXISTS `SubgrupoActivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SubgrupoActivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubgrupoActivos`
--

LOCK TABLES `SubgrupoActivos` WRITE;
/*!40000 ALTER TABLE `SubgrupoActivos` DISABLE KEYS */;
INSERT INTO `SubgrupoActivos` VALUES (18,'Máquinas, muebles y demás equipos de oficina','1'),(19,'Mobiliario y enseres de alojamiento','2'),(20,'Maquinaria y demás equipos de construcción, campo, industria y taller','3'),(21,'Equipos de transporte','4'),(22,'Equipos de telecomunicaciones','5'),(23,'Equipos médico-quirúrgicos, dentales y veterinarios','6'),(24,'Equipos científicos y de enseñanza','7'),(25,'Colecciones culturales; artísticas e históricas','8'),(26,'Armamento y material de defensa','9'),(27,'Instalaciones provisionales','10'),(28,'Semovientes','11'),(29,'Otros elementos','12');
/*!40000 ALTER TABLE `SubgrupoActivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoUsuario`
--

DROP TABLE IF EXISTS `TipoUsuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TipoUsuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoUsuario`
--

LOCK TABLES `TipoUsuario` WRITE;
/*!40000 ALTER TABLE `TipoUsuario` DISABLE KEYS */;
INSERT INTO `TipoUsuario` VALUES (1,'Administrador'),(2,'Responsable de bienes'),(3,'Jefe de Departamento');
/*!40000 ALTER TABLE `TipoUsuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Traslado`
--

DROP TABLE IF EXISTS `Traslado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Traslado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `cantidad` int DEFAULT NULL,
  `origen_id` int NOT NULL,
  `destino_id` int NOT NULL,
  `responsable_id` int NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `origen_id` (`origen_id`),
  KEY `destino_id` (`destino_id`),
  KEY `responsable_idx` (`responsable_id`),
  CONSTRAINT `responsable` FOREIGN KEY (`responsable_id`) REFERENCES `Usuarios` (`id`),
  CONSTRAINT `Traslado_ibfk_2` FOREIGN KEY (`origen_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `Traslado_ibfk_3` FOREIGN KEY (`destino_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `Traslado_ibfk_4` FOREIGN KEY (`origen_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `Traslado_ibfk_5` FOREIGN KEY (`destino_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `Traslado_ibfk_8` FOREIGN KEY (`origen_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `Traslado_ibfk_9` FOREIGN KEY (`destino_id`) REFERENCES `Departamento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Traslado`
--

LOCK TABLES `Traslado` WRITE;
/*!40000 ALTER TABLE `Traslado` DISABLE KEYS */;
INSERT INTO `Traslado` VALUES (2,'2023-10-01',10,10,11,10,'Transferencia de bienes'),(3,'2023-10-01',10,10,11,10,'Transferencia de bienes');
/*!40000 ALTER TABLE `Traslado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ComponentesTraslado`
--

DROP TABLE IF EXISTS `ComponentesTraslado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ComponentesTraslado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componente_id` int NOT NULL,
  `bien_origen_id` int NOT NULL,
  `bien_destino_id` int NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `componente_id` (`componente_id`),
  KEY `bien_origen_id` (`bien_origen_id`),
  KEY `bien_destino_id` (`bien_destino_id`),
  CONSTRAINT `ComponentesTraslado_ibfk_1` FOREIGN KEY (`componente_id`) REFERENCES `Componentes` (`id`),
  CONSTRAINT `ComponentesTraslado_ibfk_2` FOREIGN KEY (`bien_origen_id`) REFERENCES `Activos` (`id`),
  CONSTRAINT `ComponentesTraslado_ibfk_3` FOREIGN KEY (`bien_destino_id`) REFERENCES `Activos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ComponentesTraslado`
--

LOCK TABLES `ComponentesTraslado` WRITE;
/*!40000 ALTER TABLE `ComponentesTraslado` DISABLE KEYS */;
/*!40000 ALTER TABLE `ComponentesTraslado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_usuario` int DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `dept_id` int DEFAULT NULL,
  `cedula` varchar(20) NOT NULL,
  `login_token` varchar(255) DEFAULT NULL,
  `login_token_expiration` datetime DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiration` datetime DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `isActive` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `cedula_UNIQUE` (`cedula`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `tipo_usuario` (`tipo_usuario`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `Usuarios_ibfk_1` FOREIGN KEY(`tipo_usuario`) REFERENCES `TipoUsuario` (`id`),
  CONSTRAINT `Usuarios_ibfk_2` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`),
  CONSTRAINT `Usuarios_ibfk_3` FOREIGN KEY (`tipo_usuario`) REFERENCES `TipoUsuario` (`id`),
  CONSTRAINT `Usuarios_ibfk_4` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuarios`
--

LOCK TABLES `Usuarios` WRITE;
/*!40000 ALTER TABLE `Usuarios` DISABLE KEYS */;
INSERT INTO `Usuarios` VALUES (10,1,'admin@example.com','$2b$10$X6xJXMqoX9E2RkQ.NY6ks.XJiWBjC./XYrMuvr2R3DsH4woUUN75q','Administrador','Principal','0',NULL,'0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzUwMDI0NTUyLCJleHAiOjE3NTAwMjgxNTJ9.eIHWAmHtGEopN0HA10lW7EQtXMxyasJRzkzCXmqI7QI','2025-06-15 18:55:52',NULL,NULL,'admin',1),(13,1,'yoan@gmail.com','$2b$10$43FBLF15ZX0L15/ocKCCruSlE7bJn3MnGBV7TM.5.shjL1qBjLq2y','Yoan','Gel','0',7,'V-30297111',NULL,NULL,NULL,NULL,'Yoangel',1),(15,1,'ricardo@gmail.com','$2b$10$8yxdFEkfmYVZD/nnmcHdxe.WvzJuCoY9J268oj1ybzdPSxrSspaHC','Ricardo','Colmenares','13131',7,'32131','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJlbWFpbCI6InJpY2FyZG9AZ21haWwuY29tIiwiaWF0IjoxNzQ5NDI4NTY4LCJleHAiOjE3NDk0MzIxNjh9.mNSJqdOgr7XUfh5bVSQCl4ys_WEuNJvMrmNHbUrQyFo','2025-06-08 21:22:49',NULL,NULL,'rdcp',1),(16,1,'marina123@gmail.com','$2b$10$r2PRLP3MTyyOK7j8x36oyeOejM6D8tL9.fTOb1jeyX0m37WeM.jUe','Mariana','Morales ','87654321',7,'12345678','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJlbWFpbCI6Im1hcmluYTEyM0BnbWFpbC5jb20iLCJpYXQiOjE3NDk3Mzk2ODcsImV4cCI6MTc0OTc0MzI4N30.7GcIqA4_sCFWYsqGDq4vs5a17jsYfDJAJ5iZuFvSyd8','2025-06-12 11:48:07',NULL,NULL,'mari',1),(17,2,'mari321@gmail.com','$2b$10$dzpy4V.2zH8m8rv6nxrMkeLQmwwf6z1FgFnR7gkZCX95tIQrgghwm','Maria','Sierra','55555555',9,'123243424',NULL,NULL,NULL,NULL,'mary',1),(18,3,'luisana@gmail.com','$2b$10$H7KinI1BnCsI2MXdu/4ceOLM83roLr3rNx3qCPvzC7UhB9rhdwTcS','Luisana ','Moreno','555555553',11,'12324342421',NULL,NULL,NULL,NULL,'luisana',1),(19,3,'adrian24vergel@gmail.com','$2b$10$l0.X9yhpyd566FPOvNuiLOxeR9ZHXqF.vFG00OyS1rdiBApAv9p6u','Adrian','Vergel','0',19,'101010',NULL,NULL,NULL,NULL,'Adrian',1);
/*!40000 ALTER TABLE `Usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TransferenciaActivo`
--

DROP TABLE IF EXISTS `TransferenciaActivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TransferenciaActivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_traslado` int DEFAULT NULL,
  `id_mueble` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_traslado` (`id_traslado`),
  KEY `id_mueble` (`id_mueble`),
  CONSTRAINT `TransferenciaActivo_ibfk_1` FOREIGN KEY (`id_traslado`) REFERENCES `Traslado` (`id`),
  CONSTRAINT `TransferenciaActivo_ibfk_2` FOREIGN KEY (`id_mueble`) REFERENCES `Activos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TransferenciaActivo`
--

LOCK TABLES `TransferenciaActivo` WRITE;
/*!40000 ALTER TABLE `TransferenciaActivo` DISABLE KEYS */;
INSERT INTO `TransferenciaActivo` VALUES (2,3,16);
/*!40000 ALTER TABLE `TransferenciaActivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Configuracion`
--

DROP TABLE IF EXISTS `Configuracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Configuracion` (
  `id` int NOT NULL,
  `fecha` date NOT NULL,
  `colorprimario` varchar(45) DEFAULT NULL,
  `colorsecundario` varchar(45) DEFAULT NULL,
  `url_banner` varchar(150) DEFAULT NULL,
  `url_logo` varchar(150) DEFAULT NULL,
  `url_favicon` varchar(150) DEFAULT NULL,
  `nombre_institucion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Configuracion`
--

LOCK TABLES `Configuracion` WRITE;
/*!40000 ALTER TABLE `Configuracion` DISABLE KEYS */;
/*!40000 ALTER TABLE `Configuracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Marca`
--

DROP TABLE IF EXISTS `Marca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Marca` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Marca`
--

LOCK TABLES `Marca` WRITE;
/*!40000 ALTER TABLE `Marca` DISABLE KEYS */;
INSERT INTO `Marca` VALUES (31,'Dell'),(29,'Samsung'),(30,'Sony');
/*!40000 ALTER TABLE `Marca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Modelo`
--

DROP TABLE IF EXISTS `Modelo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Modelo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `idmarca` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `marca_idx` (`idmarca`),
  CONSTRAINT `fk_marca` FOREIGN KEY (`idmarca`) REFERENCES `Marca` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Modelo`
--

LOCK TABLES `Modelo` WRITE;
/*!40000 ALTER TABLE `Modelo` DISABLE KEYS */;
INSERT INTO `Modelo` VALUES (6,'Galaxy Book4',NULL),(7,'Galaxy Book4',29),(8,'E2450',31);
/*!40000 ALTER TABLE `Modelo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notificaciones`
--

DROP TABLE IF EXISTS `Notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dept_id` int NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha` date DEFAULT NULL,
  `isRead` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `departament_idx` (`dept_id`),
  CONSTRAINT `departament` FOREIGN KEY (`dept_id`) REFERENCES `Departamento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notificaciones`
--

LOCK TABLES `Notificaciones` WRITE;
/*!40000 ALTER TABLE `Notificaciones` DISABLE KEYS */;
INSERT INTO `Notificaciones` VALUES (1,10,'Nueva notificación de prueba','2025-06-15',1);
/*!40000 ALTER TABLE `Notificaciones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-15 18:32:44