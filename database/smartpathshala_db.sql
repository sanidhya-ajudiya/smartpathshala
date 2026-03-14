-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 14, 2026 at 10:57 AM
-- Server version: 9.1.0
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartpathshala_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admissions`
--

DROP TABLE IF EXISTS `admissions`;
CREATE TABLE IF NOT EXISTS `admissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `guardian_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_applied_for` int DEFAULT NULL,
  `previous_school` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_general_ci DEFAULT 'Pending',
  `application_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Absent','Late','Half Day') COLLATE utf8mb4_general_ci NOT NULL,
  `remarks` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`student_id`,`date`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `student_id`, `date`, `status`, `remarks`, `created_at`) VALUES
(1, 1, '2026-02-08', 'Present', NULL, '2026-02-14 09:04:36');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
CREATE TABLE IF NOT EXISTS `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `created_at`) VALUES
(1, 'Class 1', '2026-02-13 11:05:14'),
(2, 'Class 2', '2026-02-13 11:05:14'),
(3, 'Class 3', '2026-02-13 11:05:14'),
(4, 'Class 4', '2026-02-13 11:05:14'),
(5, 'Class 5', '2026-02-13 11:05:14'),
(6, 'Class 6', '2026-02-13 11:05:14'),
(7, 'Class 7', '2026-02-13 11:05:14'),
(8, 'Class 8', '2026-02-13 11:05:14'),
(9, 'Class 9', '2026-02-13 11:05:14'),
(10, 'Class 10', '2026-02-13 11:05:14'),
(11, 'Class 1', '2026-02-13 11:05:47'),
(12, 'Class 2', '2026-02-13 11:05:47'),
(13, 'Class 3', '2026-02-13 11:05:47'),
(14, 'Class 4', '2026-02-13 11:05:47'),
(15, 'Class 5', '2026-02-13 11:05:47'),
(16, 'Class 6', '2026-02-13 11:05:47'),
(17, 'Class 7', '2026-02-13 11:05:47'),
(18, 'Class 8', '2026-02-13 11:05:47'),
(19, 'Class 9', '2026-02-13 11:05:47'),
(20, 'Class 10', '2026-02-13 11:05:47'),
(21, 'Class 1', '2026-02-13 11:06:22'),
(22, 'Class 2', '2026-02-13 11:06:22'),
(23, 'Class 3', '2026-02-13 11:06:22'),
(24, 'Class 4', '2026-02-13 11:06:22'),
(25, 'Class 5', '2026-02-13 11:06:22'),
(26, 'Class 6', '2026-02-13 11:06:22'),
(27, 'Class 7', '2026-02-13 11:06:22'),
(28, 'Class 8', '2026-02-13 11:06:22'),
(29, 'Class 9', '2026-02-13 11:06:22'),
(30, 'Class 10', '2026-02-13 11:06:22'),
(31, 'Class 1', '2026-02-13 11:12:01'),
(32, 'Class 2', '2026-02-13 11:12:01'),
(33, 'Class 3', '2026-02-13 11:12:01'),
(34, 'Class 4', '2026-02-13 11:12:01'),
(35, 'Class 5', '2026-02-13 11:12:01'),
(36, 'Class 6', '2026-02-13 11:12:01'),
(37, 'Class 7', '2026-02-13 11:12:01'),
(38, 'Class 8', '2026-02-13 11:12:01'),
(39, 'Class 9', '2026-02-13 11:12:01'),
(40, 'Class 10', '2026-02-13 11:12:01'),
(41, 'Class 1', '2026-02-13 11:15:24'),
(42, 'Class 2', '2026-02-13 11:15:24'),
(43, 'Class 3', '2026-02-13 11:15:24'),
(44, 'Class 4', '2026-02-13 11:15:24'),
(45, 'Class 5', '2026-02-13 11:15:24'),
(46, 'Class 6', '2026-02-13 11:15:24'),
(47, 'Class 7', '2026-02-13 11:15:24'),
(48, 'Class 8', '2026-02-13 11:15:24'),
(49, 'Class 9', '2026-02-13 11:15:24'),
(50, 'Class 10', '2026-02-13 11:15:24'),
(51, 'Class 1', '2026-02-13 11:15:51'),
(52, 'Class 2', '2026-02-13 11:15:51'),
(53, 'Class 3', '2026-02-13 11:15:51'),
(54, 'Class 4', '2026-02-13 11:15:51'),
(55, 'Class 5', '2026-02-13 11:15:51'),
(56, 'Class 6', '2026-02-13 11:15:51'),
(57, 'Class 7', '2026-02-13 11:15:51'),
(58, 'Class 8', '2026-02-13 11:15:51'),
(59, 'Class 9', '2026-02-13 11:15:51'),
(60, 'Class 10', '2026-02-13 11:15:51'),
(61, 'Class 1', '2026-02-14 07:15:19'),
(62, 'Class 2', '2026-02-14 07:15:19'),
(63, 'Class 3', '2026-02-14 07:15:19'),
(64, 'Class 4', '2026-02-14 07:15:19'),
(65, 'Class 5', '2026-02-14 07:15:19'),
(66, 'Class 6', '2026-02-14 07:15:19'),
(67, 'Class 7', '2026-02-14 07:15:19'),
(68, 'Class 8', '2026-02-14 07:15:19'),
(69, 'Class 9', '2026-02-14 07:15:19'),
(70, 'Class 10', '2026-02-14 07:15:19'),
(71, 'Class 1', '2026-03-14 10:15:12'),
(72, 'Class 2', '2026-03-14 10:15:12'),
(73, 'Class 3', '2026-03-14 10:15:12'),
(74, 'Class 4', '2026-03-14 10:15:12'),
(75, 'Class 5', '2026-03-14 10:15:12'),
(76, 'Class 6', '2026-03-14 10:15:12'),
(77, 'Class 7', '2026-03-14 10:15:12'),
(78, 'Class 8', '2026-03-14 10:15:12'),
(79, 'Class 9', '2026-03-14 10:15:12'),
(80, 'Class 10', '2026-03-14 10:15:12');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`) VALUES
(1, 'Mathematics', 'Mathematics Department'),
(2, 'Science', 'Science Department'),
(3, 'English', 'English Department'),
(4, 'Social Studies', 'Social Studies Department'),
(5, 'Hindi', 'Hindi Department'),
(6, 'Sports', 'Sports Department'),
(7, 'Administration', 'Administration Department'),
(8, 'Transport', 'Transport Department'),
(9, 'Library', 'Library Department');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
CREATE TABLE IF NOT EXISTS `exams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `name`, `start_date`, `end_date`, `class_id`) VALUES
(1, 'Mid Term 2024', '2024-08-31', '2024-09-14', 31),
(2, 'Mid Term 2024', '2024-08-31', '2024-09-14', 41),
(3, 'Mid Term 2024', '2024-08-31', '2024-09-14', 51),
(4, 'Mid Term 2024', '2024-09-01', '2024-09-15', 61),
(5, 'Mid Term 2024', '2024-09-01', '2024-09-15', 71);

-- --------------------------------------------------------

--
-- Table structure for table `fee_structure`
--

DROP TABLE IF EXISTS `fee_structure`;
CREATE TABLE IF NOT EXISTS `fee_structure` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fee_structure`
--

INSERT INTO `fee_structure` (`id`, `class_id`, `category`, `amount`, `academic_year`) VALUES
(1, 31, 'Tuition Fee', 5000.00, '2024-2025'),
(2, 31, 'Transport Fee', 2000.00, '2024-2025'),
(3, 41, 'Tuition Fee', 5000.00, '2024-2025'),
(4, 41, 'Transport Fee', 2000.00, '2024-2025'),
(5, 51, 'Tuition Fee', 5000.00, '2024-2025'),
(6, 51, 'Transport Fee', 2000.00, '2024-2025'),
(7, 61, 'Tuition Fee', 5000.00, '2024-2025'),
(8, 61, 'Transport Fee', 2000.00, '2024-2025'),
(9, 71, 'Tuition Fee', 5000.00, '2024-2025'),
(10, 71, 'Transport Fee', 2000.00, '2024-2025');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

DROP TABLE IF EXISTS `inventory_items`;
CREATE TABLE IF NOT EXISTS `inventory_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `unit_price` decimal(10,2) DEFAULT NULL,
  `supplier` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_items`
--

INSERT INTO `inventory_items` (`id`, `name`, `category`, `quantity`, `unit_price`, `supplier`) VALUES
(1, 'Chalk Box', 'Stationery', 200, 50.00, 'ABC Suppliers'),
(2, 'Duster', 'Stationery', 50, 30.00, 'ABC Suppliers'),
(3, 'Desk', 'Furniture', 200, 2500.00, 'XYZ Furnitures'),
(4, 'Chalk Box', 'Stationery', 100, 50.00, 'ABC Suppliers'),
(5, 'Duster', 'Stationery', 50, 30.00, 'ABC Suppliers'),
(6, 'Desk', 'Furniture', 200, 2500.00, 'XYZ Furnitures'),
(7, 'Chalk Box', 'Stationery', 100, 50.00, 'ABC Suppliers'),
(8, 'Duster', 'Stationery', 50, 30.00, 'ABC Suppliers'),
(9, 'Desk', 'Furniture', 200, 2500.00, 'XYZ Furnitures'),
(10, 'Chalk Box', 'Stationery', 100, 50.00, 'ABC Suppliers'),
(11, 'Duster', 'Stationery', 50, 30.00, 'ABC Suppliers'),
(12, 'Desk', 'Furniture', 200, 2500.00, 'XYZ Furnitures'),
(13, 'Chalk Box', 'Stationery', 100, 50.00, 'ABC Suppliers'),
(14, 'Duster', 'Stationery', 50, 30.00, 'ABC Suppliers'),
(15, 'Desk', 'Furniture', 200, 2500.00, 'XYZ Furnitures');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
CREATE TABLE IF NOT EXISTS `inventory_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `type` enum('IN','OUT') COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  `date` date DEFAULT (curdate()),
  `remarks` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_transactions`
--

INSERT INTO `inventory_transactions` (`id`, `item_id`, `type`, `quantity`, `date`, `remarks`) VALUES
(1, 1, 'IN', 100, '2026-02-19', '');

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

DROP TABLE IF EXISTS `marks`;
CREATE TABLE IF NOT EXISTS `marks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `student_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `total_marks` decimal(5,2) DEFAULT '100.00',
  `grade` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_id` (`exam_id`),
  KEY `student_id` (`student_id`),
  KEY `subject_id` (`subject_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
CREATE TABLE IF NOT EXISTS `payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` int DEFAULT NULL,
  `month` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `basic_salary` decimal(10,2) DEFAULT NULL,
  `allowances` decimal(10,2) DEFAULT '0.00',
  `deductions` decimal(10,2) DEFAULT '0.00',
  `net_salary` decimal(10,2) DEFAULT NULL,
  `status` enum('Paid','Generated','Pending') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'STUDENT_VIEW', 'Permission for STUDENT_VIEW', '2026-02-13 10:57:11'),
(2, 'STUDENT_CREATE', 'Permission for STUDENT_CREATE', '2026-02-13 10:57:11'),
(3, 'STUDENT_EDIT', 'Permission for STUDENT_EDIT', '2026-02-13 10:57:11'),
(4, 'STUDENT_DELETE', 'Permission for STUDENT_DELETE', '2026-02-13 10:57:11'),
(5, 'TEACHER_VIEW', 'Permission for TEACHER_VIEW', '2026-02-13 10:57:11'),
(6, 'TEACHER_CREATE', 'Permission for TEACHER_CREATE', '2026-02-13 10:57:11'),
(7, 'TEACHER_EDIT', 'Permission for TEACHER_EDIT', '2026-02-13 10:57:11'),
(8, 'TEACHER_DELETE', 'Permission for TEACHER_DELETE', '2026-02-13 10:57:11'),
(9, 'FEE_COLLECT', 'Permission for FEE_COLLECT', '2026-02-13 10:57:11'),
(10, 'FEE_VIEW', 'Permission for FEE_VIEW', '2026-02-13 10:57:11'),
(11, 'EXAM_MANAGE', 'Permission for EXAM_MANAGE', '2026-02-13 10:57:11'),
(12, 'EXAM_VIEW', 'Permission for EXAM_VIEW', '2026-02-13 10:57:11'),
(13, 'ATTENDANCE_MARK', 'Permission for ATTENDANCE_MARK', '2026-02-13 10:57:11'),
(14, 'ATTENDANCE_VIEW', 'Permission for ATTENDANCE_VIEW', '2026-02-13 10:57:11'),
(15, 'PAYROLL_MANAGE', 'Permission for PAYROLL_MANAGE', '2026-02-13 10:57:11'),
(16, 'PAYROLL_VIEW', 'Permission for PAYROLL_VIEW', '2026-02-13 10:57:11'),
(17, 'USER_MANAGE', 'Permission for USER_MANAGE', '2026-02-13 10:57:11'),
(18, 'ROLE_MANAGE', 'Permission for ROLE_MANAGE', '2026-02-13 10:57:11'),
(19, 'STAFF_VIEW', 'Permission for STAFF_VIEW', '2026-03-14 10:15:11'),
(20, 'STAFF_CREATE', 'Permission for STAFF_CREATE', '2026-03-14 10:15:11'),
(21, 'STAFF_EDIT', 'Permission for STAFF_EDIT', '2026-03-14 10:15:11'),
(22, 'STAFF_DELETE', 'Permission for STAFF_DELETE', '2026-03-14 10:15:11'),
(23, 'ATTENDANCE_EDIT', 'Permission for ATTENDANCE_EDIT', '2026-03-14 10:15:11'),
(24, 'ATTENDANCE_DELETE', 'Permission for ATTENDANCE_DELETE', '2026-03-14 10:15:11'),
(25, 'FEE_CREATE', 'Permission for FEE_CREATE', '2026-03-14 10:15:11'),
(26, 'FEE_EDIT', 'Permission for FEE_EDIT', '2026-03-14 10:15:11'),
(27, 'FEE_DELETE', 'Permission for FEE_DELETE', '2026-03-14 10:15:11'),
(28, 'EXAM_CREATE', 'Permission for EXAM_CREATE', '2026-03-14 10:15:11'),
(29, 'EXAM_EDIT', 'Permission for EXAM_EDIT', '2026-03-14 10:15:11'),
(30, 'EXAM_DELETE', 'Permission for EXAM_DELETE', '2026-03-14 10:15:11'),
(31, 'TRANSPORT_VIEW', 'Permission for TRANSPORT_VIEW', '2026-03-14 10:15:11'),
(32, 'TRANSPORT_CREATE', 'Permission for TRANSPORT_CREATE', '2026-03-14 10:15:11'),
(33, 'TRANSPORT_EDIT', 'Permission for TRANSPORT_EDIT', '2026-03-14 10:15:11'),
(34, 'TRANSPORT_DELETE', 'Permission for TRANSPORT_DELETE', '2026-03-14 10:15:11'),
(35, 'INVENTORY_VIEW', 'Permission for INVENTORY_VIEW', '2026-03-14 10:15:11'),
(36, 'INVENTORY_CREATE', 'Permission for INVENTORY_CREATE', '2026-03-14 10:15:11'),
(37, 'INVENTORY_EDIT', 'Permission for INVENTORY_EDIT', '2026-03-14 10:15:11'),
(38, 'INVENTORY_DELETE', 'Permission for INVENTORY_DELETE', '2026-03-14 10:15:11');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Super Admin', 'Full access to everything', '2026-02-13 10:55:17'),
(2, 'Admin', 'Administrative access', '2026-02-13 10:55:17'),
(3, 'Teacher', 'Access to academic modules', '2026-02-13 10:55:17'),
(4, 'Student', 'Access to student portal', '2026-02-13 10:55:17');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(1, 38),
(3, 1),
(3, 2),
(3, 3),
(3, 5),
(3, 12),
(3, 14),
(4, 1),
(4, 12),
(4, 14);

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
CREATE TABLE IF NOT EXISTS `sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`)
) ENGINE=MyISAM AUTO_INCREMENT=241 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `class_id`, `name`, `created_at`) VALUES
(1, 1, 'A', '2026-02-13 11:05:14'),
(2, 1, 'B', '2026-02-13 11:05:14'),
(3, 1, 'C', '2026-02-13 11:05:14'),
(4, 2, 'A', '2026-02-13 11:05:14'),
(5, 2, 'B', '2026-02-13 11:05:14'),
(6, 2, 'C', '2026-02-13 11:05:14'),
(7, 3, 'A', '2026-02-13 11:05:14'),
(8, 3, 'B', '2026-02-13 11:05:14'),
(9, 3, 'C', '2026-02-13 11:05:14'),
(10, 4, 'A', '2026-02-13 11:05:14'),
(11, 4, 'B', '2026-02-13 11:05:14'),
(12, 4, 'C', '2026-02-13 11:05:14'),
(13, 5, 'A', '2026-02-13 11:05:14'),
(14, 5, 'B', '2026-02-13 11:05:14'),
(15, 5, 'C', '2026-02-13 11:05:14'),
(16, 6, 'A', '2026-02-13 11:05:14'),
(17, 6, 'B', '2026-02-13 11:05:14'),
(18, 6, 'C', '2026-02-13 11:05:14'),
(19, 7, 'A', '2026-02-13 11:05:14'),
(20, 7, 'B', '2026-02-13 11:05:14'),
(21, 7, 'C', '2026-02-13 11:05:14'),
(22, 8, 'A', '2026-02-13 11:05:14'),
(23, 8, 'B', '2026-02-13 11:05:14'),
(24, 8, 'C', '2026-02-13 11:05:14'),
(25, 9, 'A', '2026-02-13 11:05:14'),
(26, 9, 'B', '2026-02-13 11:05:14'),
(27, 9, 'C', '2026-02-13 11:05:14'),
(28, 10, 'A', '2026-02-13 11:05:14'),
(29, 10, 'B', '2026-02-13 11:05:14'),
(30, 10, 'C', '2026-02-13 11:05:14'),
(31, 11, 'A', '2026-02-13 11:05:47'),
(32, 11, 'B', '2026-02-13 11:05:47'),
(33, 11, 'C', '2026-02-13 11:05:47'),
(34, 12, 'A', '2026-02-13 11:05:47'),
(35, 12, 'B', '2026-02-13 11:05:47'),
(36, 12, 'C', '2026-02-13 11:05:47'),
(37, 13, 'A', '2026-02-13 11:05:47'),
(38, 13, 'B', '2026-02-13 11:05:47'),
(39, 13, 'C', '2026-02-13 11:05:47'),
(40, 14, 'A', '2026-02-13 11:05:47'),
(41, 14, 'B', '2026-02-13 11:05:47'),
(42, 14, 'C', '2026-02-13 11:05:47'),
(43, 15, 'A', '2026-02-13 11:05:47'),
(44, 15, 'B', '2026-02-13 11:05:47'),
(45, 15, 'C', '2026-02-13 11:05:47'),
(46, 16, 'A', '2026-02-13 11:05:47'),
(47, 16, 'B', '2026-02-13 11:05:47'),
(48, 16, 'C', '2026-02-13 11:05:47'),
(49, 17, 'A', '2026-02-13 11:05:47'),
(50, 17, 'B', '2026-02-13 11:05:47'),
(51, 17, 'C', '2026-02-13 11:05:47'),
(52, 18, 'A', '2026-02-13 11:05:47'),
(53, 18, 'B', '2026-02-13 11:05:47'),
(54, 18, 'C', '2026-02-13 11:05:47'),
(55, 19, 'A', '2026-02-13 11:05:47'),
(56, 19, 'B', '2026-02-13 11:05:47'),
(57, 19, 'C', '2026-02-13 11:05:47'),
(58, 20, 'A', '2026-02-13 11:05:47'),
(59, 20, 'B', '2026-02-13 11:05:47'),
(60, 20, 'C', '2026-02-13 11:05:47'),
(61, 21, 'A', '2026-02-13 11:06:22'),
(62, 21, 'B', '2026-02-13 11:06:22'),
(63, 21, 'C', '2026-02-13 11:06:22'),
(64, 22, 'A', '2026-02-13 11:06:22'),
(65, 22, 'B', '2026-02-13 11:06:22'),
(66, 22, 'C', '2026-02-13 11:06:22'),
(67, 23, 'A', '2026-02-13 11:06:22'),
(68, 23, 'B', '2026-02-13 11:06:22'),
(69, 23, 'C', '2026-02-13 11:06:22'),
(70, 24, 'A', '2026-02-13 11:06:22'),
(71, 24, 'B', '2026-02-13 11:06:22'),
(72, 24, 'C', '2026-02-13 11:06:22'),
(73, 25, 'A', '2026-02-13 11:06:22'),
(74, 25, 'B', '2026-02-13 11:06:22'),
(75, 25, 'C', '2026-02-13 11:06:22'),
(76, 26, 'A', '2026-02-13 11:06:22'),
(77, 26, 'B', '2026-02-13 11:06:22'),
(78, 26, 'C', '2026-02-13 11:06:22'),
(79, 27, 'A', '2026-02-13 11:06:22'),
(80, 27, 'B', '2026-02-13 11:06:22'),
(81, 27, 'C', '2026-02-13 11:06:22'),
(82, 28, 'A', '2026-02-13 11:06:22'),
(83, 28, 'B', '2026-02-13 11:06:22'),
(84, 28, 'C', '2026-02-13 11:06:22'),
(85, 29, 'A', '2026-02-13 11:06:22'),
(86, 29, 'B', '2026-02-13 11:06:22'),
(87, 29, 'C', '2026-02-13 11:06:22'),
(88, 30, 'A', '2026-02-13 11:06:22'),
(89, 30, 'B', '2026-02-13 11:06:22'),
(90, 30, 'C', '2026-02-13 11:06:22'),
(91, 31, 'A', '2026-02-13 11:12:01'),
(92, 31, 'B', '2026-02-13 11:12:01'),
(93, 31, 'C', '2026-02-13 11:12:01'),
(94, 32, 'A', '2026-02-13 11:12:01'),
(95, 32, 'B', '2026-02-13 11:12:01'),
(96, 32, 'C', '2026-02-13 11:12:01'),
(97, 33, 'A', '2026-02-13 11:12:01'),
(98, 33, 'B', '2026-02-13 11:12:01'),
(99, 33, 'C', '2026-02-13 11:12:01'),
(100, 34, 'A', '2026-02-13 11:12:01'),
(101, 34, 'B', '2026-02-13 11:12:01'),
(102, 34, 'C', '2026-02-13 11:12:01'),
(103, 35, 'A', '2026-02-13 11:12:01'),
(104, 35, 'B', '2026-02-13 11:12:01'),
(105, 35, 'C', '2026-02-13 11:12:01'),
(106, 36, 'A', '2026-02-13 11:12:01'),
(107, 36, 'B', '2026-02-13 11:12:01'),
(108, 36, 'C', '2026-02-13 11:12:01'),
(109, 37, 'A', '2026-02-13 11:12:01'),
(110, 37, 'B', '2026-02-13 11:12:01'),
(111, 37, 'C', '2026-02-13 11:12:01'),
(112, 38, 'A', '2026-02-13 11:12:01'),
(113, 38, 'B', '2026-02-13 11:12:01'),
(114, 38, 'C', '2026-02-13 11:12:01'),
(115, 39, 'A', '2026-02-13 11:12:01'),
(116, 39, 'B', '2026-02-13 11:12:01'),
(117, 39, 'C', '2026-02-13 11:12:01'),
(118, 40, 'A', '2026-02-13 11:12:01'),
(119, 40, 'B', '2026-02-13 11:12:01'),
(120, 40, 'C', '2026-02-13 11:12:01'),
(121, 41, 'A', '2026-02-13 11:15:24'),
(122, 41, 'B', '2026-02-13 11:15:24'),
(123, 41, 'C', '2026-02-13 11:15:24'),
(124, 42, 'A', '2026-02-13 11:15:24'),
(125, 42, 'B', '2026-02-13 11:15:24'),
(126, 42, 'C', '2026-02-13 11:15:24'),
(127, 43, 'A', '2026-02-13 11:15:24'),
(128, 43, 'B', '2026-02-13 11:15:24'),
(129, 43, 'C', '2026-02-13 11:15:24'),
(130, 44, 'A', '2026-02-13 11:15:24'),
(131, 44, 'B', '2026-02-13 11:15:24'),
(132, 44, 'C', '2026-02-13 11:15:24'),
(133, 45, 'A', '2026-02-13 11:15:24'),
(134, 45, 'B', '2026-02-13 11:15:24'),
(135, 45, 'C', '2026-02-13 11:15:24'),
(136, 46, 'A', '2026-02-13 11:15:24'),
(137, 46, 'B', '2026-02-13 11:15:24'),
(138, 46, 'C', '2026-02-13 11:15:24'),
(139, 47, 'A', '2026-02-13 11:15:24'),
(140, 47, 'B', '2026-02-13 11:15:24'),
(141, 47, 'C', '2026-02-13 11:15:24'),
(142, 48, 'A', '2026-02-13 11:15:24'),
(143, 48, 'B', '2026-02-13 11:15:24'),
(144, 48, 'C', '2026-02-13 11:15:24'),
(145, 49, 'A', '2026-02-13 11:15:24'),
(146, 49, 'B', '2026-02-13 11:15:24'),
(147, 49, 'C', '2026-02-13 11:15:24'),
(148, 50, 'A', '2026-02-13 11:15:24'),
(149, 50, 'B', '2026-02-13 11:15:24'),
(150, 50, 'C', '2026-02-13 11:15:24'),
(151, 51, 'A', '2026-02-13 11:15:51'),
(152, 51, 'B', '2026-02-13 11:15:51'),
(153, 51, 'C', '2026-02-13 11:15:51'),
(154, 52, 'A', '2026-02-13 11:15:51'),
(155, 52, 'B', '2026-02-13 11:15:51'),
(156, 52, 'C', '2026-02-13 11:15:51'),
(157, 53, 'A', '2026-02-13 11:15:51'),
(158, 53, 'B', '2026-02-13 11:15:51'),
(159, 53, 'C', '2026-02-13 11:15:51'),
(160, 54, 'A', '2026-02-13 11:15:51'),
(161, 54, 'B', '2026-02-13 11:15:51'),
(162, 54, 'C', '2026-02-13 11:15:51'),
(163, 55, 'A', '2026-02-13 11:15:51'),
(164, 55, 'B', '2026-02-13 11:15:51'),
(165, 55, 'C', '2026-02-13 11:15:51'),
(166, 56, 'A', '2026-02-13 11:15:51'),
(167, 56, 'B', '2026-02-13 11:15:51'),
(168, 56, 'C', '2026-02-13 11:15:51'),
(169, 57, 'A', '2026-02-13 11:15:51'),
(170, 57, 'B', '2026-02-13 11:15:51'),
(171, 57, 'C', '2026-02-13 11:15:51'),
(172, 58, 'A', '2026-02-13 11:15:51'),
(173, 58, 'B', '2026-02-13 11:15:51'),
(174, 58, 'C', '2026-02-13 11:15:51'),
(175, 59, 'A', '2026-02-13 11:15:51'),
(176, 59, 'B', '2026-02-13 11:15:51'),
(177, 59, 'C', '2026-02-13 11:15:51'),
(178, 60, 'A', '2026-02-13 11:15:51'),
(179, 60, 'B', '2026-02-13 11:15:51'),
(180, 60, 'C', '2026-02-13 11:15:51'),
(181, 61, 'A', '2026-02-14 07:15:19'),
(182, 61, 'B', '2026-02-14 07:15:19'),
(183, 61, 'C', '2026-02-14 07:15:19'),
(184, 62, 'A', '2026-02-14 07:15:19'),
(185, 62, 'B', '2026-02-14 07:15:19'),
(186, 62, 'C', '2026-02-14 07:15:19'),
(187, 63, 'A', '2026-02-14 07:15:19'),
(188, 63, 'B', '2026-02-14 07:15:19'),
(189, 63, 'C', '2026-02-14 07:15:19'),
(190, 64, 'A', '2026-02-14 07:15:19'),
(191, 64, 'B', '2026-02-14 07:15:19'),
(192, 64, 'C', '2026-02-14 07:15:19'),
(193, 65, 'A', '2026-02-14 07:15:19'),
(194, 65, 'B', '2026-02-14 07:15:19'),
(195, 65, 'C', '2026-02-14 07:15:19'),
(196, 66, 'A', '2026-02-14 07:15:19'),
(197, 66, 'B', '2026-02-14 07:15:19'),
(198, 66, 'C', '2026-02-14 07:15:19'),
(199, 67, 'A', '2026-02-14 07:15:19'),
(200, 67, 'B', '2026-02-14 07:15:19'),
(201, 67, 'C', '2026-02-14 07:15:19'),
(202, 68, 'A', '2026-02-14 07:15:19'),
(203, 68, 'B', '2026-02-14 07:15:19'),
(204, 68, 'C', '2026-02-14 07:15:19'),
(205, 69, 'A', '2026-02-14 07:15:19'),
(206, 69, 'B', '2026-02-14 07:15:19'),
(207, 69, 'C', '2026-02-14 07:15:19'),
(208, 70, 'A', '2026-02-14 07:15:19'),
(209, 70, 'B', '2026-02-14 07:15:19'),
(210, 70, 'C', '2026-02-14 07:15:19'),
(211, 71, 'A', '2026-03-14 10:15:12'),
(212, 71, 'B', '2026-03-14 10:15:12'),
(213, 71, 'C', '2026-03-14 10:15:12'),
(214, 72, 'A', '2026-03-14 10:15:12'),
(215, 72, 'B', '2026-03-14 10:15:12'),
(216, 72, 'C', '2026-03-14 10:15:12'),
(217, 73, 'A', '2026-03-14 10:15:12'),
(218, 73, 'B', '2026-03-14 10:15:12'),
(219, 73, 'C', '2026-03-14 10:15:12'),
(220, 74, 'A', '2026-03-14 10:15:12'),
(221, 74, 'B', '2026-03-14 10:15:12'),
(222, 74, 'C', '2026-03-14 10:15:12'),
(223, 75, 'A', '2026-03-14 10:15:12'),
(224, 75, 'B', '2026-03-14 10:15:12'),
(225, 75, 'C', '2026-03-14 10:15:12'),
(226, 76, 'A', '2026-03-14 10:15:12'),
(227, 76, 'B', '2026-03-14 10:15:12'),
(228, 76, 'C', '2026-03-14 10:15:12'),
(229, 77, 'A', '2026-03-14 10:15:12'),
(230, 77, 'B', '2026-03-14 10:15:12'),
(231, 77, 'C', '2026-03-14 10:15:12'),
(232, 78, 'A', '2026-03-14 10:15:12'),
(233, 78, 'B', '2026-03-14 10:15:12'),
(234, 78, 'C', '2026-03-14 10:15:12'),
(235, 79, 'A', '2026-03-14 10:15:12'),
(236, 79, 'B', '2026-03-14 10:15:12'),
(237, 79, 'C', '2026-03-14 10:15:12'),
(238, 80, 'A', '2026-03-14 10:15:12'),
(239, 80, 'B', '2026-03-14 10:15:12'),
(240, 80, 'C', '2026-03-14 10:15:12');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `roll_no` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `class_id` int DEFAULT NULL,
  `section_id` int DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `guardian_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `guardian_phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `class_id` (`class_id`),
  KEY `section_id` (`section_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `first_name`, `last_name`, `roll_no`, `class_id`, `section_id`, `dob`, `gender`, `address`, `phone`, `guardian_name`, `guardian_phone`, `admission_date`, `photo`, `created_at`) VALUES
(1, 8, 'deep', 'gajera', 'R-1', 31, 91, '2005-07-24', 'Male', '456 Student St', '9313490447', '', '', '2024-03-28', NULL, '2026-02-13 11:12:01'),
(2, 9, 'Charlie', 'Student', 'R-2', 31, 91, '2014-12-31', 'Male', '456 Student St', '1234567890', '', '', '2024-03-31', NULL, '2026-02-13 11:12:01'),
(3, 10, 'David', 'Student', 'R-3', 31, 91, '2015-01-01', 'Male', '456 Student St', '1234567890', NULL, NULL, '2024-04-01', NULL, '2026-02-13 11:12:01'),
(4, 11, 'Eva', 'Student', 'R-4', 31, 91, '2015-01-01', 'Male', '456 Student St', '1234567890', NULL, NULL, '2024-04-01', NULL, '2026-02-13 11:12:01'),
(5, 12, 'Frank', 'Student', 'R-5', 31, 91, '2015-01-01', 'Male', '456 Student St', '1234567890', NULL, NULL, '2024-04-01', NULL, '2026-02-13 11:12:01'),
(6, 13, 'Grace', 'Student', 'R-6', 31, 91, '2015-01-01', 'Male', '456 Student St', '1234567890', NULL, NULL, '2024-04-01', NULL, '2026-02-13 11:12:01'),
(7, 14, 'Hannah', 'Student', 'R-7', 31, 91, '2015-01-01', 'Male', '456 Student St', '1234567890', NULL, NULL, '2024-04-01', NULL, '2026-02-13 11:12:01'),
(8, 15, 'Ian', 'Student', 'R-8', 31, 91, '2015-01-01', 'Male', '456 Student St', '1234567890', NULL, NULL, '2024-04-01', NULL, '2026-02-13 11:12:01');

-- --------------------------------------------------------

--
-- Table structure for table `student_fees`
--

DROP TABLE IF EXISTS `student_fees`;
CREATE TABLE IF NOT EXISTS `student_fees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `fee_structure_id` int DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT '0.00',
  `due_amount` decimal(10,2) DEFAULT '0.00',
  `payment_date` date DEFAULT NULL,
  `payment_method` enum('Cash','Online','Cheque','Bank Transfer') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('Paid','Pending','Partial') COLLATE utf8mb4_general_ci DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `fee_structure_id` (`fee_structure_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_fees`
--

INSERT INTO `student_fees` (`id`, `student_id`, `fee_structure_id`, `amount_paid`, `due_amount`, `payment_date`, `payment_method`, `transaction_id`, `status`) VALUES
(1, 1, 1, 5000.00, 0.00, '2026-02-19', 'Online', '', 'Paid');

-- --------------------------------------------------------

--
-- Table structure for table `student_transport`
--

DROP TABLE IF EXISTS `student_transport`;
CREATE TABLE IF NOT EXISTS `student_transport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `route_id` int DEFAULT NULL,
  `vehicle_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `route_id` (`route_id`),
  KEY `vehicle_id` (`vehicle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`)
) ENGINE=MyISAM AUTO_INCREMENT=421 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `code`, `class_id`) VALUES
(1, 'Mathematics', 'MAT-1', 1),
(2, 'Science', 'SCI-1', 1),
(3, 'English', 'ENG-1', 1),
(4, 'History', 'HIS-1', 1),
(5, 'Geography', 'GEO-1', 1),
(6, 'Computer Science', 'COM-1', 1),
(7, 'Mathematics', 'MAT-2', 2),
(8, 'Science', 'SCI-2', 2),
(9, 'English', 'ENG-2', 2),
(10, 'History', 'HIS-2', 2),
(11, 'Geography', 'GEO-2', 2),
(12, 'Computer Science', 'COM-2', 2),
(13, 'Mathematics', 'MAT-3', 3),
(14, 'Science', 'SCI-3', 3),
(15, 'English', 'ENG-3', 3),
(16, 'History', 'HIS-3', 3),
(17, 'Geography', 'GEO-3', 3),
(18, 'Computer Science', 'COM-3', 3),
(19, 'Mathematics', 'MAT-4', 4),
(20, 'Science', 'SCI-4', 4),
(21, 'English', 'ENG-4', 4),
(22, 'History', 'HIS-4', 4),
(23, 'Geography', 'GEO-4', 4),
(24, 'Computer Science', 'COM-4', 4),
(25, 'Mathematics', 'MAT-5', 5),
(26, 'Science', 'SCI-5', 5),
(27, 'English', 'ENG-5', 5),
(28, 'History', 'HIS-5', 5),
(29, 'Geography', 'GEO-5', 5),
(30, 'Computer Science', 'COM-5', 5),
(31, 'Mathematics', 'MAT-6', 6),
(32, 'Science', 'SCI-6', 6),
(33, 'English', 'ENG-6', 6),
(34, 'History', 'HIS-6', 6),
(35, 'Geography', 'GEO-6', 6),
(36, 'Computer Science', 'COM-6', 6),
(37, 'Mathematics', 'MAT-7', 7),
(38, 'Science', 'SCI-7', 7),
(39, 'English', 'ENG-7', 7),
(40, 'History', 'HIS-7', 7),
(41, 'Geography', 'GEO-7', 7),
(42, 'Computer Science', 'COM-7', 7),
(43, 'Mathematics', 'MAT-8', 8),
(44, 'Science', 'SCI-8', 8),
(45, 'English', 'ENG-8', 8),
(46, 'History', 'HIS-8', 8),
(47, 'Geography', 'GEO-8', 8),
(48, 'Computer Science', 'COM-8', 8),
(49, 'Mathematics', 'MAT-9', 9),
(50, 'Science', 'SCI-9', 9),
(51, 'English', 'ENG-9', 9),
(52, 'History', 'HIS-9', 9),
(53, 'Geography', 'GEO-9', 9),
(54, 'Computer Science', 'COM-9', 9),
(55, 'Mathematics', 'MAT-10', 10),
(56, 'Science', 'SCI-10', 10),
(57, 'English', 'ENG-10', 10),
(58, 'History', 'HIS-10', 10),
(59, 'Geography', 'GEO-10', 10),
(60, 'Computer Science', 'COM-10', 10),
(61, 'Mathematics', 'MAT-21', 21),
(62, 'Science', 'SCI-21', 21),
(63, 'English', 'ENG-21', 21),
(64, 'History', 'HIS-21', 21),
(65, 'Geography', 'GEO-21', 21),
(66, 'Computer Science', 'COM-21', 21),
(67, 'Mathematics', 'MAT-22', 22),
(68, 'Science', 'SCI-22', 22),
(69, 'English', 'ENG-22', 22),
(70, 'History', 'HIS-22', 22),
(71, 'Geography', 'GEO-22', 22),
(72, 'Computer Science', 'COM-22', 22),
(73, 'Mathematics', 'MAT-23', 23),
(74, 'Science', 'SCI-23', 23),
(75, 'English', 'ENG-23', 23),
(76, 'History', 'HIS-23', 23),
(77, 'Geography', 'GEO-23', 23),
(78, 'Computer Science', 'COM-23', 23),
(79, 'Mathematics', 'MAT-24', 24),
(80, 'Science', 'SCI-24', 24),
(81, 'English', 'ENG-24', 24),
(82, 'History', 'HIS-24', 24),
(83, 'Geography', 'GEO-24', 24),
(84, 'Computer Science', 'COM-24', 24),
(85, 'Mathematics', 'MAT-25', 25),
(86, 'Science', 'SCI-25', 25),
(87, 'English', 'ENG-25', 25),
(88, 'History', 'HIS-25', 25),
(89, 'Geography', 'GEO-25', 25),
(90, 'Computer Science', 'COM-25', 25),
(91, 'Mathematics', 'MAT-26', 26),
(92, 'Science', 'SCI-26', 26),
(93, 'English', 'ENG-26', 26),
(94, 'History', 'HIS-26', 26),
(95, 'Geography', 'GEO-26', 26),
(96, 'Computer Science', 'COM-26', 26),
(97, 'Mathematics', 'MAT-27', 27),
(98, 'Science', 'SCI-27', 27),
(99, 'English', 'ENG-27', 27),
(100, 'History', 'HIS-27', 27),
(101, 'Geography', 'GEO-27', 27),
(102, 'Computer Science', 'COM-27', 27),
(103, 'Mathematics', 'MAT-28', 28),
(104, 'Science', 'SCI-28', 28),
(105, 'English', 'ENG-28', 28),
(106, 'History', 'HIS-28', 28),
(107, 'Geography', 'GEO-28', 28),
(108, 'Computer Science', 'COM-28', 28),
(109, 'Mathematics', 'MAT-29', 29),
(110, 'Science', 'SCI-29', 29),
(111, 'English', 'ENG-29', 29),
(112, 'History', 'HIS-29', 29),
(113, 'Geography', 'GEO-29', 29),
(114, 'Computer Science', 'COM-29', 29),
(115, 'Mathematics', 'MAT-30', 30),
(116, 'Science', 'SCI-30', 30),
(117, 'English', 'ENG-30', 30),
(118, 'History', 'HIS-30', 30),
(119, 'Geography', 'GEO-30', 30),
(120, 'Computer Science', 'COM-30', 30),
(121, 'Mathematics', 'MAT-31', 31),
(122, 'Science', 'SCI-31', 31),
(123, 'English', 'ENG-31', 31),
(124, 'History', 'HIS-31', 31),
(125, 'Geography', 'GEO-31', 31),
(126, 'Computer Science', 'COM-31', 31),
(127, 'Mathematics', 'MAT-32', 32),
(128, 'Science', 'SCI-32', 32),
(129, 'English', 'ENG-32', 32),
(130, 'History', 'HIS-32', 32),
(131, 'Geography', 'GEO-32', 32),
(132, 'Computer Science', 'COM-32', 32),
(133, 'Mathematics', 'MAT-33', 33),
(134, 'Science', 'SCI-33', 33),
(135, 'English', 'ENG-33', 33),
(136, 'History', 'HIS-33', 33),
(137, 'Geography', 'GEO-33', 33),
(138, 'Computer Science', 'COM-33', 33),
(139, 'Mathematics', 'MAT-34', 34),
(140, 'Science', 'SCI-34', 34),
(141, 'English', 'ENG-34', 34),
(142, 'History', 'HIS-34', 34),
(143, 'Geography', 'GEO-34', 34),
(144, 'Computer Science', 'COM-34', 34),
(145, 'Mathematics', 'MAT-35', 35),
(146, 'Science', 'SCI-35', 35),
(147, 'English', 'ENG-35', 35),
(148, 'History', 'HIS-35', 35),
(149, 'Geography', 'GEO-35', 35),
(150, 'Computer Science', 'COM-35', 35),
(151, 'Mathematics', 'MAT-36', 36),
(152, 'Science', 'SCI-36', 36),
(153, 'English', 'ENG-36', 36),
(154, 'History', 'HIS-36', 36),
(155, 'Geography', 'GEO-36', 36),
(156, 'Computer Science', 'COM-36', 36),
(157, 'Mathematics', 'MAT-37', 37),
(158, 'Science', 'SCI-37', 37),
(159, 'English', 'ENG-37', 37),
(160, 'History', 'HIS-37', 37),
(161, 'Geography', 'GEO-37', 37),
(162, 'Computer Science', 'COM-37', 37),
(163, 'Mathematics', 'MAT-38', 38),
(164, 'Science', 'SCI-38', 38),
(165, 'English', 'ENG-38', 38),
(166, 'History', 'HIS-38', 38),
(167, 'Geography', 'GEO-38', 38),
(168, 'Computer Science', 'COM-38', 38),
(169, 'Mathematics', 'MAT-39', 39),
(170, 'Science', 'SCI-39', 39),
(171, 'English', 'ENG-39', 39),
(172, 'History', 'HIS-39', 39),
(173, 'Geography', 'GEO-39', 39),
(174, 'Computer Science', 'COM-39', 39),
(175, 'Mathematics', 'MAT-40', 40),
(176, 'Science', 'SCI-40', 40),
(177, 'English', 'ENG-40', 40),
(178, 'History', 'HIS-40', 40),
(179, 'Geography', 'GEO-40', 40),
(180, 'Computer Science', 'COM-40', 40),
(181, 'Mathematics', 'MAT-41', 41),
(182, 'Science', 'SCI-41', 41),
(183, 'English', 'ENG-41', 41),
(184, 'History', 'HIS-41', 41),
(185, 'Geography', 'GEO-41', 41),
(186, 'Computer Science', 'COM-41', 41),
(187, 'Mathematics', 'MAT-42', 42),
(188, 'Science', 'SCI-42', 42),
(189, 'English', 'ENG-42', 42),
(190, 'History', 'HIS-42', 42),
(191, 'Geography', 'GEO-42', 42),
(192, 'Computer Science', 'COM-42', 42),
(193, 'Mathematics', 'MAT-43', 43),
(194, 'Science', 'SCI-43', 43),
(195, 'English', 'ENG-43', 43),
(196, 'History', 'HIS-43', 43),
(197, 'Geography', 'GEO-43', 43),
(198, 'Computer Science', 'COM-43', 43),
(199, 'Mathematics', 'MAT-44', 44),
(200, 'Science', 'SCI-44', 44),
(201, 'English', 'ENG-44', 44),
(202, 'History', 'HIS-44', 44),
(203, 'Geography', 'GEO-44', 44),
(204, 'Computer Science', 'COM-44', 44),
(205, 'Mathematics', 'MAT-45', 45),
(206, 'Science', 'SCI-45', 45),
(207, 'English', 'ENG-45', 45),
(208, 'History', 'HIS-45', 45),
(209, 'Geography', 'GEO-45', 45),
(210, 'Computer Science', 'COM-45', 45),
(211, 'Mathematics', 'MAT-46', 46),
(212, 'Science', 'SCI-46', 46),
(213, 'English', 'ENG-46', 46),
(214, 'History', 'HIS-46', 46),
(215, 'Geography', 'GEO-46', 46),
(216, 'Computer Science', 'COM-46', 46),
(217, 'Mathematics', 'MAT-47', 47),
(218, 'Science', 'SCI-47', 47),
(219, 'English', 'ENG-47', 47),
(220, 'History', 'HIS-47', 47),
(221, 'Geography', 'GEO-47', 47),
(222, 'Computer Science', 'COM-47', 47),
(223, 'Mathematics', 'MAT-48', 48),
(224, 'Science', 'SCI-48', 48),
(225, 'English', 'ENG-48', 48),
(226, 'History', 'HIS-48', 48),
(227, 'Geography', 'GEO-48', 48),
(228, 'Computer Science', 'COM-48', 48),
(229, 'Mathematics', 'MAT-49', 49),
(230, 'Science', 'SCI-49', 49),
(231, 'English', 'ENG-49', 49),
(232, 'History', 'HIS-49', 49),
(233, 'Geography', 'GEO-49', 49),
(234, 'Computer Science', 'COM-49', 49),
(235, 'Mathematics', 'MAT-50', 50),
(236, 'Science', 'SCI-50', 50),
(237, 'English', 'ENG-50', 50),
(238, 'History', 'HIS-50', 50),
(239, 'Geography', 'GEO-50', 50),
(240, 'Computer Science', 'COM-50', 50),
(241, 'Mathematics', 'MAT-51', 51),
(242, 'Science', 'SCI-51', 51),
(243, 'English', 'ENG-51', 51),
(244, 'History', 'HIS-51', 51),
(245, 'Geography', 'GEO-51', 51),
(246, 'Computer Science', 'COM-51', 51),
(247, 'Mathematics', 'MAT-52', 52),
(248, 'Science', 'SCI-52', 52),
(249, 'English', 'ENG-52', 52),
(250, 'History', 'HIS-52', 52),
(251, 'Geography', 'GEO-52', 52),
(252, 'Computer Science', 'COM-52', 52),
(253, 'Mathematics', 'MAT-53', 53),
(254, 'Science', 'SCI-53', 53),
(255, 'English', 'ENG-53', 53),
(256, 'History', 'HIS-53', 53),
(257, 'Geography', 'GEO-53', 53),
(258, 'Computer Science', 'COM-53', 53),
(259, 'Mathematics', 'MAT-54', 54),
(260, 'Science', 'SCI-54', 54),
(261, 'English', 'ENG-54', 54),
(262, 'History', 'HIS-54', 54),
(263, 'Geography', 'GEO-54', 54),
(264, 'Computer Science', 'COM-54', 54),
(265, 'Mathematics', 'MAT-55', 55),
(266, 'Science', 'SCI-55', 55),
(267, 'English', 'ENG-55', 55),
(268, 'History', 'HIS-55', 55),
(269, 'Geography', 'GEO-55', 55),
(270, 'Computer Science', 'COM-55', 55),
(271, 'Mathematics', 'MAT-56', 56),
(272, 'Science', 'SCI-56', 56),
(273, 'English', 'ENG-56', 56),
(274, 'History', 'HIS-56', 56),
(275, 'Geography', 'GEO-56', 56),
(276, 'Computer Science', 'COM-56', 56),
(277, 'Mathematics', 'MAT-57', 57),
(278, 'Science', 'SCI-57', 57),
(279, 'English', 'ENG-57', 57),
(280, 'History', 'HIS-57', 57),
(281, 'Geography', 'GEO-57', 57),
(282, 'Computer Science', 'COM-57', 57),
(283, 'Mathematics', 'MAT-58', 58),
(284, 'Science', 'SCI-58', 58),
(285, 'English', 'ENG-58', 58),
(286, 'History', 'HIS-58', 58),
(287, 'Geography', 'GEO-58', 58),
(288, 'Computer Science', 'COM-58', 58),
(289, 'Mathematics', 'MAT-59', 59),
(290, 'Science', 'SCI-59', 59),
(291, 'English', 'ENG-59', 59),
(292, 'History', 'HIS-59', 59),
(293, 'Geography', 'GEO-59', 59),
(294, 'Computer Science', 'COM-59', 59),
(295, 'Mathematics', 'MAT-60', 60),
(296, 'Science', 'SCI-60', 60),
(297, 'English', 'ENG-60', 60),
(298, 'History', 'HIS-60', 60),
(299, 'Geography', 'GEO-60', 60),
(300, 'Computer Science', 'COM-60', 60),
(301, 'Mathematics', 'MAT-61', 61),
(302, 'Science', 'SCI-61', 61),
(303, 'English', 'ENG-61', 61),
(304, 'History', 'HIS-61', 61),
(305, 'Geography', 'GEO-61', 61),
(306, 'Computer Science', 'COM-61', 61),
(307, 'Mathematics', 'MAT-62', 62),
(308, 'Science', 'SCI-62', 62),
(309, 'English', 'ENG-62', 62),
(310, 'History', 'HIS-62', 62),
(311, 'Geography', 'GEO-62', 62),
(312, 'Computer Science', 'COM-62', 62),
(313, 'Mathematics', 'MAT-63', 63),
(314, 'Science', 'SCI-63', 63),
(315, 'English', 'ENG-63', 63),
(316, 'History', 'HIS-63', 63),
(317, 'Geography', 'GEO-63', 63),
(318, 'Computer Science', 'COM-63', 63),
(319, 'Mathematics', 'MAT-64', 64),
(320, 'Science', 'SCI-64', 64),
(321, 'English', 'ENG-64', 64),
(322, 'History', 'HIS-64', 64),
(323, 'Geography', 'GEO-64', 64),
(324, 'Computer Science', 'COM-64', 64),
(325, 'Mathematics', 'MAT-65', 65),
(326, 'Science', 'SCI-65', 65),
(327, 'English', 'ENG-65', 65),
(328, 'History', 'HIS-65', 65),
(329, 'Geography', 'GEO-65', 65),
(330, 'Computer Science', 'COM-65', 65),
(331, 'Mathematics', 'MAT-66', 66),
(332, 'Science', 'SCI-66', 66),
(333, 'English', 'ENG-66', 66),
(334, 'History', 'HIS-66', 66),
(335, 'Geography', 'GEO-66', 66),
(336, 'Computer Science', 'COM-66', 66),
(337, 'Mathematics', 'MAT-67', 67),
(338, 'Science', 'SCI-67', 67),
(339, 'English', 'ENG-67', 67),
(340, 'History', 'HIS-67', 67),
(341, 'Geography', 'GEO-67', 67),
(342, 'Computer Science', 'COM-67', 67),
(343, 'Mathematics', 'MAT-68', 68),
(344, 'Science', 'SCI-68', 68),
(345, 'English', 'ENG-68', 68),
(346, 'History', 'HIS-68', 68),
(347, 'Geography', 'GEO-68', 68),
(348, 'Computer Science', 'COM-68', 68),
(349, 'Mathematics', 'MAT-69', 69),
(350, 'Science', 'SCI-69', 69),
(351, 'English', 'ENG-69', 69),
(352, 'History', 'HIS-69', 69),
(353, 'Geography', 'GEO-69', 69),
(354, 'Computer Science', 'COM-69', 69),
(355, 'Mathematics', 'MAT-70', 70),
(356, 'Science', 'SCI-70', 70),
(357, 'English', 'ENG-70', 70),
(358, 'History', 'HIS-70', 70),
(359, 'Geography', 'GEO-70', 70),
(360, 'Computer Science', 'COM-70', 70),
(361, 'Mathematics', 'MAT-71', 71),
(362, 'Science', 'SCI-71', 71),
(363, 'English', 'ENG-71', 71),
(364, 'History', 'HIS-71', 71),
(365, 'Geography', 'GEO-71', 71),
(366, 'Computer Science', 'COM-71', 71),
(367, 'Mathematics', 'MAT-72', 72),
(368, 'Science', 'SCI-72', 72),
(369, 'English', 'ENG-72', 72),
(370, 'History', 'HIS-72', 72),
(371, 'Geography', 'GEO-72', 72),
(372, 'Computer Science', 'COM-72', 72),
(373, 'Mathematics', 'MAT-73', 73),
(374, 'Science', 'SCI-73', 73),
(375, 'English', 'ENG-73', 73),
(376, 'History', 'HIS-73', 73),
(377, 'Geography', 'GEO-73', 73),
(378, 'Computer Science', 'COM-73', 73),
(379, 'Mathematics', 'MAT-74', 74),
(380, 'Science', 'SCI-74', 74),
(381, 'English', 'ENG-74', 74),
(382, 'History', 'HIS-74', 74),
(383, 'Geography', 'GEO-74', 74),
(384, 'Computer Science', 'COM-74', 74),
(385, 'Mathematics', 'MAT-75', 75),
(386, 'Science', 'SCI-75', 75),
(387, 'English', 'ENG-75', 75),
(388, 'History', 'HIS-75', 75),
(389, 'Geography', 'GEO-75', 75),
(390, 'Computer Science', 'COM-75', 75),
(391, 'Mathematics', 'MAT-76', 76),
(392, 'Science', 'SCI-76', 76),
(393, 'English', 'ENG-76', 76),
(394, 'History', 'HIS-76', 76),
(395, 'Geography', 'GEO-76', 76),
(396, 'Computer Science', 'COM-76', 76),
(397, 'Mathematics', 'MAT-77', 77),
(398, 'Science', 'SCI-77', 77),
(399, 'English', 'ENG-77', 77),
(400, 'History', 'HIS-77', 77),
(401, 'Geography', 'GEO-77', 77),
(402, 'Computer Science', 'COM-77', 77),
(403, 'Mathematics', 'MAT-78', 78),
(404, 'Science', 'SCI-78', 78),
(405, 'English', 'ENG-78', 78),
(406, 'History', 'HIS-78', 78),
(407, 'Geography', 'GEO-78', 78),
(408, 'Computer Science', 'COM-78', 78),
(409, 'Mathematics', 'MAT-79', 79),
(410, 'Science', 'SCI-79', 79),
(411, 'English', 'ENG-79', 79),
(412, 'History', 'HIS-79', 79),
(413, 'Geography', 'GEO-79', 79),
(414, 'Computer Science', 'COM-79', 79),
(415, 'Mathematics', 'MAT-80', 80),
(416, 'Science', 'SCI-80', 80),
(417, 'English', 'ENG-80', 80),
(418, 'History', 'HIS-80', 80),
(419, 'Geography', 'GEO-80', 80),
(420, 'Computer Science', 'COM-80', 80);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `qualification` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `user_id`, `first_name`, `last_name`, `department_id`, `qualification`, `joining_date`, `phone`, `address`, `created_at`) VALUES
(2, 3, 'Jane', 'Smith', 2, 'M.Sc, B.Ed', '2020-05-14', '9876543210', '123 Teacher Lane', '2026-02-13 11:05:15'),
(3, 4, 'Robert', 'Brown', 3, 'M.Sc, B.Ed', '2020-05-14', '9876543210', '123 Teacher Lane', '2026-02-13 11:05:15'),
(4, 5, 'Emily', 'Davis', 4, 'M.Sc, B.Ed', '2020-05-15', '9876543210', '123 Teacher Lane', '2026-02-13 11:05:15'),
(5, 6, 'Michael', 'Wilson', 1, 'M.Sc, B.Ed', '2020-05-14', '9876543210', '123 Teacher Lane', '2026-02-13 11:05:15');

-- --------------------------------------------------------

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
CREATE TABLE IF NOT EXISTS `timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `section_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  KEY `section_id` (`section_id`),
  KEY `subject_id` (`subject_id`),
  KEY `teacher_id` (`teacher_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transport_routes`
--

DROP TABLE IF EXISTS `transport_routes`;
CREATE TABLE IF NOT EXISTS `transport_routes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `route_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `start_point` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `end_point` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fare` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport_routes`
--

INSERT INTO `transport_routes` (`id`, `route_name`, `start_point`, `end_point`, `fare`) VALUES
(1, 'Route 1', 'City Center', 'School', 1500.00),
(2, 'Route 1', 'City Center', 'School', 1500.00);

-- --------------------------------------------------------

--
-- Table structure for table `transport_vehicles`
--

DROP TABLE IF EXISTS `transport_vehicles`;
CREATE TABLE IF NOT EXISTS `transport_vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_number` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `driver_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driver_phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicle_number` (`vehicle_number`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport_vehicles`
--

INSERT INTO `transport_vehicles` (`id`, `vehicle_number`, `driver_name`, `driver_phone`, `capacity`) VALUES
(1, 'UP-32-AB-1234', 'Ram Singh', '9876500000', 40);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role_id` int DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', 'superadmin@school.com', 'admin123', 1, 'active', '2026-02-13 10:57:11', '2026-02-13 11:15:18'),
(2, 'teacher_john', 'john@school.com', 'password123', 3, 'active', '2026-02-13 11:05:15', '2026-02-13 11:15:24'),
(3, 'teacher_jane', 'jane@school.com', 'password123', 3, 'active', '2026-02-13 11:05:15', '2026-02-13 11:15:24'),
(4, 'teacher_robert', 'robert@school.com', 'password123', 3, 'active', '2026-02-13 11:05:15', '2026-02-13 11:15:24'),
(5, 'teacher_emily', 'emily@school.com', 'password123', 3, 'active', '2026-02-13 11:05:15', '2026-02-13 11:15:24'),
(6, 'teacher_michael', 'michael@school.com', 'password123', 3, 'active', '2026-02-13 11:05:15', '2026-02-13 11:15:24'),
(7, 'student_alice', 'alice@student.com', 'password123', 4, 'active', '2026-02-13 11:05:15', '2026-02-13 11:15:24'),
(8, 'student_bob', 'bob@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24'),
(9, 'student_charlie', 'charlie@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24'),
(10, 'student_david', 'david@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24'),
(11, 'student_eva', 'eva@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24'),
(12, 'student_frank', 'frank@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24'),
(13, 'student_grace', 'grace@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24'),
(14, 'student_hannah', 'hannah@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24'),
(15, 'student_ian', 'ian@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24'),
(16, 'student_jack', 'jack@student.com', 'password123', 4, 'active', '2026-02-13 11:12:01', '2026-02-13 11:15:24');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
