-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2021 at 12:40 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `AustenRiggs`
--
CREATE DATABASE IF NOT EXISTS `AustenRiggs` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `AustenRiggs`;

-- --------------------------------------------------------

--
-- Table structure for table `cat_tags`
--

CREATE TABLE `cat_tags` (
  `id_cat_tag` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `color` varchar(7) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `DialogInterviews`
--

CREATE TABLE `DialogInterviews` (
  `idDialogInterview` int(10) UNSIGNED NOT NULL,
  `id_user` int(11) NOT NULL,
  `content` mediumtext DEFAULT NULL,
  `tagged` mediumtext DEFAULT NULL,
  `idDocument` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `idDocument` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `hash` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tagged_process`
--

CREATE TABLE `tagged_process` (
  `id_tagged_process` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_cat_tag` int(11) DEFAULT NULL,
  `idDialogInterview` int(10) UNSIGNED DEFAULT NULL,
  `stamp` int(10) UNSIGNED DEFAULT NULL,
  `startpos` int(11) DEFAULT NULL,
  `sentence` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `profile_image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cat_tags`
--
ALTER TABLE `cat_tags`
  ADD PRIMARY KEY (`id_cat_tag`),
  ADD UNIQUE KEY `title` (`title`),
  ADD UNIQUE KEY `color` (`color`),
  ADD KEY `id_user` (`id_user`);
--
-- Indexes for table `DialogInterviews`
--
ALTER TABLE `DialogInterviews`
  ADD PRIMARY KEY (`idDialogInterview`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `idDocument` (`idDocument`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`idDocument`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `tagged_process`
--
ALTER TABLE `tagged_process`
  ADD PRIMARY KEY (`id_tagged_process`),
  ADD KEY `id_cat_tag` (`id_cat_tag`),
  ADD KEY `idDialogInterview` (`idDialogInterview`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cat_tags`
--
ALTER TABLE `cat_tags`
  MODIFY `id_cat_tag` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `DialogInterviews`
--
ALTER TABLE `DialogInterviews`
  MODIFY `idDialogInterview` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `idDocument` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tagged_process`
--
ALTER TABLE `tagged_process`
  MODIFY `id_tagged_process` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cat_tags`
--
ALTER TABLE `cat_tags`
  ADD CONSTRAINT `cat_tags_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `DialogInterviews`
--
ALTER TABLE `DialogInterviews`
  ADD CONSTRAINT `DialogInterviews_ibfk_1` FOREIGN KEY (`idDocument`) REFERENCES `documents` (`idDocument`) ON DELETE CASCADE,
  ADD CONSTRAINT `DialogInterviews_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Constraints for table `tagged_process`
--
ALTER TABLE `tagged_process`
  ADD CONSTRAINT `tagged_process_ibfk_1` FOREIGN KEY (`id_cat_tag`) REFERENCES `cat_tags` (`id_cat_tag`) ON DELETE CASCADE,
  ADD CONSTRAINT `tagged_process_ibfk_2` FOREIGN KEY (`idDialogInterview`) REFERENCES `DialogInterviews` (`idDialogInterview`) ON DELETE CASCADE,
  ADD CONSTRAINT `tagged_process_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
