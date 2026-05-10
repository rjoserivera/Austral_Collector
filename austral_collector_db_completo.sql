-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-05-2026 a las 00:17:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `austral_collector_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

CREATE TABLE `configuracion` (
  `clave` varchar(50) NOT NULL,
  `valor` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`clave`, `valor`) VALUES
('miembro_destacado', ''),
('portafolio_comunidad', 'uploads/general/general_1776356002_199.jpg'),
('portafolio_video_1', 'https://www.youtube.com/watch?v=jg5zCZc-7To&list=RDjg5zCZc-7To&start_radio=1'),
('portafolio_video_2', 'https://www.youtube.com/watch?v=E0d2uEQJbXs&list=RDjg5zCZc-7To&index=2'),
('portafolio_video_3', 'https://www.youtube.com/watch?v=RkkGHJUpJCw&list=RDjg5zCZc-7To&index=3'),
('portafolio_video_4', 'https://www.youtube.com/watch?v=a4na2opArGY&list=RDjg5zCZc-7To&index=4'),
('txt_cumple', 'Feliz cumpleaños a los presentes'),
('txt_destacado', ''),
('video_destacado_1', '2'),
('video_destacado_2', '5'),
('video_destacado_3', '1'),
('video_destacado_4', '3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destacado_mes`
--

CREATE TABLE `destacado_mes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mes_anio` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `destacado_mes`
--

INSERT INTO `destacado_mes` (`id`, `user_id`, `mes_anio`) VALUES
(1, 1, '04-2026');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `fecha_display` varchar(100) NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id`, `titulo`, `fecha_display`, `imagen_url`, `created_at`) VALUES
(1, 'Comic con 2026', '3 al 5 julio', 'uploads/eventos/evento_69d92aa37c82b7.73237135.png', '2026-04-09 00:40:10'),
(2, 'Hotweel 2026', '18 y 19 julio', 'uploads/eventos/evento_69d92a96dd07a7.96125750.png', '2026-04-09 19:49:40'),
(3, 'EXHIBICIÓN DE FIGURAS', '19 de abril, 2026', 'uploads/eventos/evento_69f36192d70784.04771951.png', '2026-04-30 14:05:06'),
(4, 'Comic-Con México', '15 de Marzo', 'uploads/eventos/evento_69f36318412433.50479454.png', '2026-04-30 14:11:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `galeria_portafolio`
--

CREATE TABLE `galeria_portafolio` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT '',
  `imagen_url` varchar(500) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `galeria_portafolio`
--

INSERT INTO `galeria_portafolio` (`id`, `descripcion`, `imagen_url`, `orden`, `created_at`) VALUES
(9, 'asss', 'uploads/portafolio/portafolio_1776355185_329.jpg', 1, '2026-04-16 15:59:45'),
(10, 'ishigo kurosaki', 'uploads/portafolio/portafolio_1776355202_296.jpg', 1, '2026-04-16 16:00:02'),
(11, 'pixelart', 'uploads/portafolio/portafolio_1776355219_588.png', 2, '2026-04-16 16:00:19'),
(12, 'origime', 'uploads/portafolio/portafolio_1776355254_760.jpg', 3, '2026-04-16 16:00:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hashtags`
--

CREATE TABLE `hashtags` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hashtags`
--

INSERT INTO `hashtags` (`id`, `nombre`) VALUES
(90, 'aerith_strife_remake'),
(78, 'akira_kenobi_clone'),
(6, 'AnimeFigure'),
(63, 'austral'),
(35, 'australcollector'),
(29, 'Avengers'),
(37, 'bocchi'),
(69, 'bulmacapsulecorp'),
(33, 'capcom'),
(38, 'collector'),
(20, 'Cosplay'),
(84, 'dante_smith_hunter'),
(17, 'DisneyCosplay'),
(31, 'DoctorStrange'),
(27, 'EggAttack'),
(72, 'elena_strife_ff'),
(1, 'EternalSailorMoon'),
(10, 'FateGrandOrder'),
(9, 'FateSeries'),
(34, 'figura'),
(66, 'hokagenaruto'),
(60, 'imagine'),
(26, 'IronMan'),
(8, 'Jalter'),
(11, 'JalterCosplay'),
(87, 'joker_croft_raider'),
(15, 'JudyHopps'),
(75, 'ken_ackerman_titan'),
(3, 'MagicalGirl'),
(203, 'maka'),
(28, 'Marvel'),
(14, 'MarvelCosplay'),
(12, 'MilesMorales'),
(18, 'PowerRangers'),
(21, 'PowerRangersCosplay'),
(32, 'pragmata'),
(19, 'RedRanger'),
(5, 'SailorMoonBootleg'),
(2, 'SailorMoonCollector'),
(204, 'souleater'),
(13, 'SpiderManCosplay'),
(39, 'top'),
(81, 'yuki_tanaka_vocaloid'),
(16, 'ZootopiaCosplay');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hp_promociones`
--

CREATE TABLE `hp_promociones` (
  `id` int(10) UNSIGNED NOT NULL,
  `seccion` enum('carousel','sidebar','bottom') NOT NULL DEFAULT 'carousel' COMMENT 'carousel=Partners, sidebar=Panel lateral, bottom=Destacados',
  `titulo` varchar(120) NOT NULL,
  `subtitulo` varchar(200) DEFAULT NULL,
  `imagen_url` varchar(300) DEFAULT NULL,
  `link_url` varchar(500) NOT NULL,
  `btn_texto` varchar(60) DEFAULT 'Ver m??s',
  `orden` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `hp_promociones`
--

INSERT INTO `hp_promociones` (`id`, `seccion`, `titulo`, `subtitulo`, `imagen_url`, `link_url`, `btn_texto`, `orden`, `activo`, `created_at`) VALUES
(1, 'carousel', 'AmiAmi', NULL, 'uploads/promos/promo_69e1403e94cf6.png', 'https://www.amiami.com/eng/?srsltid=AfmBOoo9t41c6ydfmDH08fkAv7H8yE-SnHq6uzj8XrseGbEO7t7Z06R-', 'Ver m├ís', 0, 1, '2026-04-16 20:02:06'),
(2, 'carousel', 'Richirocko', NULL, 'uploads/promos/promo_69e1456265e83.png', 'https://tienda.richirocko.com/?srsltid=AfmBOooMKGEYLEF5TpVXRDU6dV6G68fk6r5Wkwz1SB3VR3Q6yoo6BFUT', 'Ver m├ís', 1, 1, '2026-04-16 20:16:41'),
(3, 'carousel', 'Geekz', NULL, 'uploads/promos/promo_69e145e354815.png', 'https://www.geekz.cl/?srsltid=AfmBOoqCd8_lD9yi5o9UJu59aWZXfMiHckxXzOHW_8SueS4vDs1yFVU8', 'Ver m├ís', 2, 1, '2026-04-16 20:26:11'),
(4, 'carousel', 'AnimeStore', NULL, 'uploads/promos/promo_69e1468bc11ae.png', 'https://animestore.cl/?srsltid=AfmBOoroMY8O2Gdo3Txq6EeNDq1s9fHpUTwQUGYc5F9h76xPUCTStYYM', 'Ver m├ís', 4, 1, '2026-04-16 20:28:59'),
(5, 'carousel', 'FigurasDBZChile', NULL, 'uploads/promos/promo_69e14711436fd.png', 'https://www.figurasdbzchile.cl/', 'Ver m├ís', 5, 1, '2026-04-16 20:31:13'),
(6, 'carousel', 'NihonFigures', NULL, 'uploads/promos/promo_69e147e6ec4b6.png', 'https://www.nihonfigures.com/?srsltid=AfmBOorwKeColvH5Z9GGSL9cyQDyW3RQPlgMgchzX8DdtAwExEhTO_cJ', 'Ver m├ís', 5, 1, '2026-04-16 20:34:46'),
(7, 'carousel', 'mirax', NULL, 'uploads/promos/promo_69ec123527534.png', 'https://www.mirax.cl/index.php?menu=445&srsltid=AfmBOoq9FP_JhVrB-U9p3hlazNayGwnKygzcdXeOq4vSgZDNetfFn5ko', 'Ver más', 0, 1, '2026-04-25 01:00:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `identidad`
--

CREATE TABLE `identidad` (
  `id` varchar(50) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `identidad`
--

INSERT INTO `identidad` (`id`, `icon`, `title`, `descripcion`) VALUES
('metas', '🏁', 'Metas', 'Expandir la comunidad a nivel nacional, organizar eventos presenciales y posicionarnos como referentes del coleccionismo en Chile.'),
('mision', '🎯', 'Misión', 'Reunir a coleccionistas apasionados en una comunidad activa donde pueden compartir, exhibir y perseguir piezas Únicas del mundo del entretenimiento. :3'),
('valores', '👍', 'Valores', 'Comunidad, respeto, pasión por la historia, autenticidad y colaboración entre miembros.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `likes`
--

CREATE TABLE `likes` (
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `likes`
--

INSERT INTO `likes` (`user_id`, `post_id`) VALUES
(1, 38),
(1, 52),
(1, 56),
(1, 57),
(1, 80),
(1, 81),
(1, 82),
(1, 92),
(2, 38),
(2, 39),
(2, 40),
(2, 41),
(2, 42),
(2, 44),
(2, 52),
(2, 56),
(2, 64),
(2, 69),
(2, 80),
(2, 88),
(3, 38),
(3, 40),
(3, 42),
(3, 43),
(3, 44),
(3, 45),
(3, 56),
(3, 80),
(3, 81),
(3, 93),
(5, 38),
(5, 41),
(5, 42),
(5, 43),
(5, 46),
(5, 52),
(5, 56),
(5, 58),
(5, 70),
(5, 80),
(10, 38),
(10, 40),
(10, 41),
(10, 42),
(10, 43),
(10, 45),
(10, 52),
(10, 56),
(10, 57),
(10, 58),
(10, 69),
(10, 76),
(10, 80),
(10, 81),
(10, 82),
(12, 38),
(12, 40),
(12, 41),
(12, 42),
(12, 43),
(12, 44),
(12, 45),
(12, 56),
(12, 57),
(12, 80),
(12, 81),
(12, 92),
(13, 38),
(13, 39),
(13, 41),
(13, 42),
(13, 43),
(13, 45),
(13, 46),
(13, 56),
(13, 70),
(13, 80),
(13, 82),
(13, 88),
(14, 38),
(14, 39),
(14, 41),
(14, 43),
(14, 44),
(14, 46),
(14, 52),
(14, 56),
(14, 57),
(14, 70),
(14, 76),
(14, 80),
(14, 82),
(17, 38),
(17, 40),
(17, 41),
(17, 44),
(17, 46),
(17, 52),
(17, 56),
(17, 57),
(17, 80),
(19, 38),
(19, 39),
(19, 41),
(19, 46),
(19, 52),
(19, 56),
(19, 57),
(19, 69),
(19, 76),
(19, 80),
(19, 88),
(19, 92),
(22, 38),
(22, 42),
(22, 43),
(22, 45),
(22, 56),
(22, 57),
(22, 70),
(22, 76),
(22, 80),
(22, 92),
(24, 38),
(24, 39),
(24, 41),
(24, 43),
(24, 44),
(24, 52),
(24, 56),
(24, 57),
(24, 58),
(24, 80),
(24, 81),
(28, 38),
(28, 41),
(28, 42),
(28, 43),
(28, 56),
(28, 64),
(28, 76),
(29, 38),
(29, 39),
(29, 41),
(29, 42),
(29, 56),
(29, 57),
(29, 64),
(29, 76),
(29, 80),
(29, 82),
(29, 88),
(29, 92),
(31, 38),
(31, 41),
(31, 42),
(31, 45),
(31, 46),
(31, 52),
(31, 56),
(31, 69),
(31, 76),
(31, 80),
(33, 38),
(33, 40),
(33, 42),
(33, 43),
(33, 56),
(33, 58),
(33, 64),
(33, 80),
(33, 81),
(33, 82),
(39, 38),
(39, 40),
(39, 41),
(39, 42),
(39, 44),
(39, 45),
(39, 46),
(39, 52),
(39, 56),
(39, 80),
(39, 81),
(39, 88),
(39, 92),
(40, 38),
(40, 39),
(40, 41),
(40, 42),
(40, 43),
(40, 44),
(40, 45),
(40, 52),
(40, 56),
(40, 69),
(40, 76),
(40, 80),
(40, 92),
(42, 38),
(42, 40),
(42, 41),
(42, 44),
(42, 56),
(42, 64),
(42, 80),
(42, 81),
(42, 82),
(43, 38),
(43, 39),
(43, 40),
(43, 41),
(43, 42),
(43, 43),
(43, 44),
(43, 46),
(43, 52),
(43, 56),
(43, 57),
(43, 64),
(43, 80),
(43, 82),
(43, 88),
(43, 92),
(44, 38),
(44, 40),
(44, 42),
(44, 43),
(44, 44),
(44, 46),
(44, 56),
(44, 57),
(44, 80),
(46, 38),
(46, 46),
(46, 52),
(46, 56),
(46, 64),
(46, 80),
(46, 88),
(46, 92),
(48, 38),
(48, 40),
(48, 41),
(48, 42),
(48, 43),
(48, 44),
(48, 56),
(48, 69),
(48, 76),
(48, 80),
(48, 82),
(49, 38),
(49, 39),
(49, 42),
(49, 43),
(49, 44),
(49, 45),
(49, 52),
(49, 56),
(49, 58),
(49, 69),
(49, 80),
(51, 38),
(51, 43),
(51, 44),
(51, 46),
(51, 70),
(51, 76),
(51, 80),
(51, 82),
(51, 88),
(53, 38),
(53, 40),
(53, 42),
(53, 43),
(53, 44),
(53, 46),
(53, 56),
(53, 76),
(53, 80),
(53, 81),
(53, 82),
(58, 38),
(58, 39),
(58, 40),
(58, 46),
(58, 56),
(58, 70),
(58, 80),
(58, 92),
(59, 38),
(59, 40),
(59, 41),
(59, 42),
(59, 44),
(59, 56),
(59, 58),
(59, 69),
(59, 70),
(59, 80),
(59, 82),
(60, 38),
(60, 40),
(60, 41),
(60, 42),
(60, 43),
(60, 44),
(60, 45),
(60, 56),
(60, 57),
(60, 58),
(60, 80),
(60, 81),
(60, 88),
(61, 38),
(61, 39),
(61, 41),
(61, 42),
(61, 43),
(61, 52),
(61, 56),
(61, 70),
(61, 76),
(61, 80),
(61, 82),
(61, 92),
(62, 38),
(62, 41),
(62, 42),
(62, 45),
(62, 46),
(62, 52),
(62, 56),
(62, 57),
(62, 70),
(62, 80),
(62, 82),
(64, 38),
(64, 39),
(64, 42),
(64, 43),
(64, 44),
(64, 45),
(64, 46),
(64, 52),
(64, 56),
(64, 64),
(64, 69),
(64, 80),
(64, 82),
(64, 88),
(66, 38),
(66, 42),
(66, 44),
(66, 56),
(66, 76),
(66, 80),
(66, 81),
(67, 38),
(67, 39),
(67, 42),
(67, 43),
(67, 44),
(67, 46),
(67, 52),
(67, 56),
(67, 69),
(67, 80),
(67, 92),
(69, 38),
(69, 41),
(69, 42),
(69, 45),
(69, 46),
(69, 56),
(69, 57),
(69, 69),
(69, 70),
(69, 80),
(69, 82),
(69, 92),
(71, 38),
(71, 39),
(71, 44),
(71, 56),
(71, 64),
(71, 76),
(71, 80),
(71, 81),
(71, 82),
(71, 92),
(76, 38),
(76, 40),
(76, 41),
(76, 42),
(76, 43),
(76, 44),
(76, 46),
(76, 52),
(76, 56),
(76, 57),
(76, 76),
(76, 80),
(77, 38),
(77, 39),
(77, 40),
(77, 41),
(77, 43),
(77, 52),
(77, 56),
(77, 57),
(77, 58),
(77, 80),
(77, 82),
(77, 88),
(77, 92),
(78, 38),
(78, 40),
(78, 41),
(78, 42),
(78, 43),
(78, 56),
(78, 70),
(78, 76),
(78, 80),
(78, 81),
(78, 92),
(80, 38),
(80, 39),
(80, 41),
(80, 45),
(80, 52),
(80, 56),
(80, 57),
(80, 58),
(80, 69),
(80, 80),
(80, 81),
(81, 38),
(81, 42),
(81, 43),
(81, 45),
(81, 52),
(81, 56),
(81, 58),
(81, 80),
(81, 88),
(82, 38),
(82, 40),
(82, 41),
(82, 43),
(82, 45),
(82, 56),
(82, 69),
(82, 82),
(82, 92);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `accion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logs`
--

INSERT INTO `logs` (`id`, `user_id`, `tipo`, `accion`, `created_at`) VALUES
(1, 2, 'login', 'Inicio de sesi├│n', '2026-04-08 19:19:03'),
(2, 1, 'login', 'Inicio de sesi├│n', '2026-04-08 19:55:42'),
(3, 3, 'login', 'Inicio de sesi├│n', '2026-04-09 00:36:19'),
(4, 1, 'login', 'Inicio de sesi├│n', '2026-04-09 03:30:44'),
(5, 1, 'figura', 'Public├│ un nuevo figura: 4rtyhj', '2026-04-09 03:31:05'),
(6, 3, 'login', 'Inicio de sesi├│n', '2026-04-09 03:31:18'),
(7, 3, 'admin', 'Elimin├│ publicaci├│n: 4rtyhj (figura). Motivo: la imagen no corresponde a nada de figura o cosplay', '2026-04-09 03:38:06'),
(8, 3, 'admin', 'Edit├│ perfil completo del usuario: Bocchi', '2026-04-09 03:49:31'),
(9, 1, 'login', 'Inicio de sesi├│n', '2026-04-09 03:57:48'),
(10, 1, 'figura', 'Public├│ un nuevo figura: wdddddddddddd', '2026-04-09 03:58:06'),
(11, 3, 'login', 'Inicio de sesi├│n', '2026-04-09 03:58:17'),
(12, 3, 'admin', 'Elimin├│ publicaci├│n: wdddddddddddd (figura). Motivo: el contenigo no corresponde a ningun tipo de figura o cosplay ', '2026-04-09 03:58:58'),
(13, 3, 'admin', 'Actualiz├│ secci├│n de identidad: mision', '2026-04-09 04:56:44'),
(14, 1, 'login', 'Inicio de sesi├│n', '2026-04-09 16:24:00'),
(15, 1, 'login', 'Inicio de sesi├│n', '2026-04-09 16:36:49'),
(16, 3, 'admin', 'Edit├│ perfil completo del usuario: Imagine', '2026-04-09 19:34:34'),
(17, 3, 'admin', 'Edit├│ perfil completo del usuario: Autral', '2026-04-09 19:43:20'),
(18, 3, 'alerta', 'Public├│ un nuevo evento: Hotweel 2026', '2026-04-09 19:49:40'),
(19, 3, 'alerta', 'Actualiz├│ el evento: Hotweel 2026', '2026-04-10 16:51:34'),
(20, 3, 'alerta', 'Actualiz├│ el evento: Comic con 2026', '2026-04-10 16:51:47'),
(21, 2, 'login', 'Inicio de sesi├│n', '2026-04-10 17:07:32'),
(22, 2, 'figura', 'Public├│ un nuevo figura: Kato megumi', '2026-04-10 17:13:03'),
(23, 2, 'figura', 'Public├│ un nuevo figura: Origime inoue', '2026-04-10 17:22:46'),
(24, 2, 'figura', 'Public├│ un nuevo figura: Anime waffles', '2026-04-10 17:29:51'),
(25, 2, 'figura', 'Public├│ un nuevo figura: Anime waffles', '2026-04-10 17:29:51'),
(26, 3, 'admin', 'Elimin├│ publicaci├│n: Anime waffles (figura). Motivo: error codigo \n', '2026-04-10 17:32:12'),
(27, 2, 'figura', 'Public├│ un nuevo figura: Ishigo', '2026-04-10 17:35:49'),
(28, 2, 'figura', 'Public├│ un nuevo figura: Ishigo', '2026-04-10 17:35:49'),
(29, 3, 'admin', 'Elimin├│ publicaci├│n: Ishigo (figura). Motivo: error codigo 2\n', '2026-04-10 17:37:46'),
(30, 2, 'figura', 'Public├│ un nuevo figura: IA bleach', '2026-04-10 17:38:52'),
(31, 2, 'figura', 'Public├│ un nuevo figura: Origime pan', '2026-04-10 17:41:45'),
(32, 2, 'figura', 'Public├│ un nuevo figura: Origime', '2026-04-10 17:41:45'),
(33, 3, 'admin', 'Actualiz├│ secci├│n de identidad: mision', '2026-04-11 00:40:12'),
(34, 3, 'admin', 'Elimin├│ publicaci├│n: IA bleach (figura). Motivo: Este contenido no representa ni figura ni cosplay ', '2026-04-11 00:41:38'),
(35, 2, 'figura', 'Public├│ un nuevo figura: Origime', '2026-04-11 01:06:55'),
(36, 3, 'admin', 'Edit├│ perfil completo del usuario: Autral', '2026-04-13 17:13:55'),
(37, 3, 'perfil', 'Puntuaste el perfil #1 con 5 estrellas.', '2026-04-13 21:37:17'),
(38, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 19:59:56'),
(39, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 19:59:57'),
(40, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:00:11'),
(41, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:02:49'),
(42, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:03:02'),
(43, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:10:42'),
(44, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:10:56'),
(45, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:10:59'),
(46, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:11:01'),
(47, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:11:11'),
(48, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:11:14'),
(49, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:11:17'),
(50, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:17:26'),
(51, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:19:00'),
(52, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:28:58'),
(53, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:29:00'),
(54, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:29:02'),
(55, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:29:09'),
(56, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:29:14'),
(57, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:29:15'),
(58, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:29:25'),
(59, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:33:54'),
(60, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:33:56'),
(61, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:33:57'),
(62, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:33:59'),
(63, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:34:01'),
(64, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:34:05'),
(65, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:34:10'),
(66, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:34:12'),
(67, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:35:48'),
(68, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:35:49'),
(69, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:35:51'),
(70, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:35:53'),
(71, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:35:55'),
(72, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:35:58'),
(73, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:36:00'),
(74, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:36:03'),
(75, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:36:05'),
(76, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:36:08'),
(77, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:36:10'),
(78, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:36:21'),
(79, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:48:54'),
(80, 3, 'login', 'Inicio de sesi├│n', '2026-04-15 20:59:34'),
(81, 3, 'figura', 'Public├│ un nuevo figura: asdada', '2026-04-16 14:46:23'),
(82, 3, 'figura', 'Public├│ un nuevo figura: asdada', '2026-04-16 15:21:00'),
(83, 3, 'figura', 'Public├│ un nuevo figura: ishigo y inoue', '2026-04-16 20:58:29'),
(84, 3, 'login', 'Inicio de sesi├│n', '2026-04-16 21:07:35'),
(85, 3, 'admin', 'Elimin├│ publicaci├│n: ishigo y inoue (figura). Motivo: nada', '2026-04-16 21:08:00'),
(86, 3, 'admin', 'Elimin├│ publicaci├│n: Origime (figura). Motivo: cosas', '2026-04-16 21:08:30'),
(87, 3, 'admin', 'Agreg├│ video: el principe', '2026-04-16 21:09:10'),
(88, 1, 'login', 'Inicio de sesión', '2026-04-17 16:43:57'),
(89, 3, 'login', 'Inicio de sesión', '2026-04-17 17:01:22'),
(90, 3, 'admin', 'Actualizó sección de identidad: mision', '2026-04-17 17:07:09'),
(91, 3, 'admin', 'Actualizó sección de identidad: valores', '2026-04-17 17:07:46'),
(92, 3, 'admin', 'Actualizó sección de identidad: metas', '2026-04-17 17:08:12'),
(93, 3, 'admin', 'Actualizó sección de identidad: mision', '2026-04-17 17:08:48'),
(94, 3, 'admin', 'Actualizó sección de identidad: valores', '2026-04-17 17:08:49'),
(95, 3, 'admin', 'Actualizó sección de identidad: metas', '2026-04-17 17:08:50'),
(96, 3, 'perfil', 'Puntuaste el perfil #2 con 3 estrellas.', '2026-04-17 20:19:31'),
(97, 3, 'admin', 'Eliminó publicación: asdada (figura). Motivo: aaa', '2026-04-17 23:49:14'),
(98, 3, 'admin', 'Eliminó publicación: Origime pan (figura). Motivo: aaaaaaa', '2026-04-17 23:49:27'),
(99, 3, 'admin', 'Eliminó publicación: Origime (figura). Motivo: aaaaaaaaaa', '2026-04-17 23:49:32'),
(100, 3, 'admin', 'Eliminó publicación: Ishigo (figura). Motivo: aaaaaaaaaaa', '2026-04-17 23:49:40'),
(101, 3, 'admin', 'Eliminó publicación: Anime waffles (figura). Motivo: aaaaaaaaaaaaaaaa', '2026-04-17 23:49:47'),
(102, 3, 'admin', 'Eliminó publicación: Origime inoue (figura). Motivo: aaaaaaaaaaaaaaaaaa', '2026-04-17 23:49:54'),
(103, 3, 'admin', 'Eliminó publicación: Kato megumi (figura). Motivo: aaaaaaaaaaaaaa', '2026-04-17 23:50:00'),
(104, 3, 'login', 'Inicio de sesión', '2026-04-18 00:49:22'),
(105, 3, 'perfil', 'Retiraste tu calificación del perfil #1.', '2026-04-18 00:51:43'),
(106, 3, 'perfil', 'Puntuaste el perfil #1 con 4 estrellas.', '2026-04-18 00:51:50'),
(107, 3, 'perfil', 'Puntuaste el perfil #1 con 1 estrellas.', '2026-04-18 00:51:54'),
(108, 3, 'perfil', 'Puntuaste el perfil #1 con 5 estrellas.', '2026-04-18 00:51:58'),
(109, 3, 'figura', 'Publicó un nuevo figura: sssss', '2026-04-18 01:19:06'),
(110, 3, 'login', 'Inicio de sesión', '2026-04-20 14:52:41'),
(111, 3, 'admin', 'Editó perfil completo del usuario: Bocchi', '2026-04-20 14:52:56'),
(112, 3, 'login', 'Inicio de sesión', '2026-04-20 15:51:32'),
(113, 3, 'admin', 'Editó perfil completo del usuario: Autral', '2026-04-20 16:04:37'),
(114, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-20 16:04:56'),
(115, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-20 16:05:08'),
(116, 3, 'login', 'Inicio de sesión', '2026-04-23 19:49:25'),
(117, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:50:21'),
(118, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:50:26'),
(119, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:50:31'),
(120, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:50:35'),
(121, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:50:39'),
(122, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:50:39'),
(123, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:50:52'),
(124, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:51:03'),
(125, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-23 19:58:39'),
(126, 3, 'login', 'Inicio de sesión', '2026-04-24 16:09:30'),
(127, 3, 'perfil', 'Puntuaste el perfil #1 con 4 estrellas.', '2026-04-24 16:41:44'),
(128, 3, 'admin', 'Eliminó publicación: Frieren (figura). Motivo: aaaaaaaaaa', '2026-04-24 19:37:36'),
(129, 3, 'admin', 'Editó perfil completo del usuario: Link_Kenobi_General', '2026-04-24 19:38:46'),
(130, 3, 'admin', 'Editó perfil completo del usuario: HokageNaruto', '2026-04-24 21:16:49'),
(131, 3, 'admin', 'Actualizó los textos de la mascota virtual', '2026-04-24 22:40:14'),
(132, 3, 'login', 'Inicio de sesión', '2026-04-25 00:31:11'),
(133, 3, 'login', 'Inicio de sesión', '2026-04-25 00:32:49'),
(134, 3, 'login', 'Inicio de sesión', '2026-04-25 00:36:15'),
(135, 3, 'admin', 'Editó perfil completo del usuario: Jill_Uchiha_Sasuke', '2026-04-25 00:49:51'),
(136, 3, 'admin', 'Actualizó los textos de la mascota virtual', '2026-04-25 00:50:54'),
(137, 3, 'admin', 'Editó perfil completo del usuario: Yuki_Tanaka_Vocaloid', '2026-04-25 00:52:51'),
(138, 3, 'admin', 'Editó perfil completo del usuario: Imagine', '2026-04-25 00:53:06'),
(139, 3, 'admin', 'Editó perfil completo del usuario: Bocchi', '2026-04-25 00:53:16'),
(140, 3, 'admin', 'Editó perfil completo del usuario: Autral', '2026-04-25 00:53:27'),
(141, 3, 'figura', 'Publicó un nuevo figura: ko - on', '2026-04-25 01:16:45'),
(142, 3, 'login', 'Inicio de sesión', '2026-04-27 17:47:41'),
(143, 3, 'login', 'Inicio de sesión', '2026-04-27 18:54:49'),
(144, 3, 'figura', 'Publicó un nuevo figura: mala', '2026-04-27 20:49:12'),
(145, 3, 'figura', 'Publicó un nuevo figura: maka', '2026-04-27 20:50:07'),
(146, 3, 'figura', 'Eliminó publicación: maka', '2026-04-27 20:56:35'),
(147, 3, 'figura', 'Eliminó publicación: mala', '2026-04-27 20:56:37'),
(148, 3, 'login', 'Inicio de sesión', '2026-04-28 20:09:35'),
(149, 3, 'login', 'Inicio de sesión', '2026-04-30 14:04:00'),
(150, 3, 'alerta', 'Publicó un nuevo evento: EXHIBICIÓN DE FIGURAS DE COLECCIÓN EN LINKSTART', '2026-04-30 14:05:06'),
(151, 3, 'alerta', 'Actualizó el evento: EXHIBICIÓN DE FIGURAS', '2026-04-30 14:07:00'),
(152, 3, 'alerta', 'Publicó un nuevo evento: Comic-Con México', '2026-04-30 14:11:36'),
(153, 3, 'admin', 'Editó perfil completo del usuario: Link_Kenobi_General', '2026-04-30 17:23:06'),
(154, 2, 'login', 'Inicio de sesión', '2026-04-30 19:39:27'),
(155, 2, 'login', 'Inicio de sesión', '2026-04-30 19:40:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascot_texts`
--

CREATE TABLE `mascot_texts` (
  `id` int(11) NOT NULL,
  `section_name` enum('inicio','nosotros','galeria','miembros','contacto') NOT NULL,
  `message` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascot_texts`
--

INSERT INTO `mascot_texts` (`id`, `section_name`, `message`, `updated_at`) VALUES
(1, 'inicio', 'Hola! Bienvenido a Austral Collector.', '2026-04-24 22:40:14'),
(2, 'nosotros', 'Conoce mas sobre nuestra historia y nuestra pasión por el coleccionismo.', '2026-04-24 22:40:14'),
(3, 'galeria', 'Explora las increibles figuras y cosplays de nuestra comunidad.', '2026-04-24 22:40:14'),
(4, 'miembros', 'íDescubre a otros coleccionistas y comparte tus pasiones!', '2026-04-20 16:39:19'),
(5, 'contacto', 'Tienes alguna duda o sugerencia? escríbenos, estamos para ayudarte!', '2026-04-24 22:40:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_ratings`
--

CREATE TABLE `perfil_ratings` (
  `id` int(11) NOT NULL,
  `rater_id` int(11) NOT NULL,
  `rated_user_id` int(11) NOT NULL,
  `score` int(11) NOT NULL CHECK (`score` >= 1 and `score` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfil_ratings`
--

INSERT INTO `perfil_ratings` (`id`, `rater_id`, `rated_user_id`, `score`, `created_at`) VALUES
(2, 3, 2, 3, '2026-04-17 20:19:31'),
(3, 3, 1, 4, '2026-04-24 16:41:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `imagenes_extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`imagenes_extra`)),
  `tipo` enum('figura','cosplay') NOT NULL,
  `anio` varchar(10) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `nombre`, `descripcion`, `imagen_url`, `imagenes_extra`, `tipo`, `anio`, `orden`, `created_at`) VALUES
(1, 2, 'Eternal Sailor Moon - S.H.Figuarts (Edition 2022/2023)', 'Figura de acci├│n de alta gama perteneciente a la l├¡nea S.H.Figuarts de Tamashii Nations (Bandai). Esta pieza representa la evoluci├│n final de Sailor Moon, destacando por sus imponentes alas blancas, el broche de coraz├│n dorado y su traje de tres capas (amarillo, rojo y azul). La figura incluye el Eternal Tiare (su b├ículo de poder) con un nivel de detalle excepcional en la parte superior. Al ser una figura articulada de ├║ltima generaci├│n, permite una posabilidad extrema manteniendo proporciones estilizadas y acabados de pintura perlados que le dan un aspecto premium.', 'uploads/posts/post_69d6af7283e020.18932563.jpg', NULL, 'figura', '2022', 1, '2026-04-08 23:41:38'),
(2, 2, 'Eternal Sailor Moon - Bootleg / Versi├│n Alternativa (No Oficial)', 'Esta pieza es una r├®plica no oficial inspirada en la l├¡nea S.H.Figuarts. Aunque intenta imitar el dise├▒o de la pel├¡cula Sailor Moon Eternal, se pueden observar diferencias notables que son importantes para un coleccionista:\r\n\r\nPintura: Los colores son m├ís planos y saturados; el amarillo del cabello es m├ís opaco y no tiene el efecto degradado de la original.\r\n\r\nAcabados: El b├ículo (Eternal Tiare) tiene un esculpido m├ís tosco y la gema roja superior carece de transparencia.\r\n\r\nArticulaciones: Las uniones (especialmente en codos y hombros) suelen ser m├ís visibles y de un pl├ístico con diferente brillo al resto del cuerpo.\r\n\r\nRostro: La expresi├│n y el detalle en los ojos son menos precisos que en la versi├│n de Tamashii Nations.', 'uploads/posts/post_69d6b266f06696.84814003.jpg', NULL, 'figura', '2023', 2, '2026-04-08 23:54:14'),
(3, 1, 'Jeanne d\'Arc (Alter) / Jalter', 'interpretaci├│n de Jeanne d\'Arc (Alter) de la franquicia Fate. El cosplay captura perfectamente la naturaleza \"Vengadora\" (Avenger) del personaje, destacando su caracter├¡stica armadura negra con bordes afilados y su corona oscura ornamentada. Porta la emblem├ítica espada negra con detalles carmes├¡ que imitan llamas. La caracterizaci├│n es impecable, incluyendo la peluca de color blanco cenizo con corte desordenado y el uso de lentes de contacto amarillos que reflejan la mirada intensa del personaje. La iluminaci├│n en tonos p├║rpuras y rosados resalta la atm├│sfera m├¡stica y oscura de esta variante del personaje.', 'uploads/posts/post_69d6b335d0a852.01440452.jpg', '[\"uploads\\/posts\\/post_69d6b335d0f9c2.13476399.jpg\",\"uploads\\/posts\\/post_69d6b335d13a73.21173820.jpg\"]', 'cosplay', '2024', 0, '2026-04-08 23:57:41'),
(4, 1, 'Miles Morales (Spider-Man)', 'Excepcional cosplay de Miles Morales que destaca por su fidelidad t├®cnica. El traje utiliza un patr├│n de tejido con textura de panal de abeja (honeycomb) que le otorga un aspecto cinematogr├ífico y profesional. Los lentes de la m├íscara presentan un borde rojo vibrante con una malla blanca micro-perforada de alta visibilidad, capturando la expresi├│n cl├ísica del personaje. La combinaci├│n de colores negro carb├│n y rojo intenso, junto con las telara├▒as blancas finamente impresas, lo convierten en una representaci├│n de alto nivel del Spider-Man de Brooklyn.', 'uploads/posts/post_69d6b3aec4a2a7.98583287.jpg', NULL, 'cosplay', '2023', 3, '2026-04-08 23:59:42'),
(5, 1, 'Judy Hopps (Human Version / Gijinka)', 'Creativa interpretaci├│n humanizada (Gijinka) de la oficial Judy Hopps. El cosplay captura la esencia del personaje mediante el uso de orejas de conejo de textura suave y el uniforme policial celeste caracter├¡stico. Destaca por el uso de accesorios tem├íticos que a├▒aden narrativa a la imagen, como la pluma en forma de zanahoria (referencia directa a la grabadora de la pel├¡cula) y un detalle muy especial para coleccionistas: una carcasa de celular inspirada en el broche de transformaci├│n de Sailor Moon, mostrando el lado fan de la cosplayer. La caracterizaci├│n se completa con una peluca gris plata en coletas y un maquillaje que resalta la expresi├│n alegre y decidida de la protagonista.', 'uploads/posts/post_69d6b4b0d92647.02406606.jpg', NULL, 'cosplay', '2022', 2, '2026-04-09 00:04:00'),
(6, 1, 'Red Rangers Multi-Generation (Power Rangers Group)', 'Impactante fotograf├¡a grupal que re├║ne a diversos l├¡deres de la franquicia Power Rangers. Los cosplays presentan un acabado en tela spandex brillante y cascos de fibra con visores opacos de alta fidelidad. De izquierda a derecha, podemos identificar a los Red Rangers de:\r\n\r\nMegaforce / Goseiger\r\n\r\nIn Space / Megaranger\r\n\r\nOperation Overdrive / Boukenger\r\n\r\nMighty Morphin / Zyuranger (El ic├│nico l├¡der original)\r\n\r\nSamurai / Shinkenger (En pose de ataque con espada)\r\n\r\nTime Force / Timeranger\r\n\r\nMystic Force / Magiranger (Con su caracter├¡stica capa blanca)\r\n\r\nEs una muestra excelente de la evoluci├│n del dise├▒o de los trajes a lo largo de los a├▒os, manteniendo la cohesi├│n del color rojo como s├¡mbolo de liderazgo.', 'uploads/posts/post_69d6b52a310b37.78823714.jpg', NULL, 'cosplay', '2020', 1, '2026-04-09 00:06:02'),
(7, 1, 'Iron Man Mark VI', 'Figura de colecci├│n con est├®tica \"Super Deformed\" (cabeza grande y cuerpo peque├▒o) que representa la armadura Mark VI de Tony Stark, reconocible por el reactor arc triangular en el pecho. Esta pieza destaca por su funci├│n de iluminaci├│n LED en los ojos y el pecho, adem├ís de un acabado de pintura carmes├¡ metalizado de alta calidad. Es una figura est├ítica dise├▒ada con un alto nivel de detalle en el esculpido de las placas de la armadura, capturando la esencia tecnol├│gica de Marvel en un formato compacto y elegante.', 'uploads/posts/post_69d6b718bb1c97.72213717.jpg', '[\"uploads\\/posts\\/post_69d6b718bb74c8.06388791.jpg\"]', 'figura', '2015', 0, '2026-04-09 00:14:16'),
(8, 1, 'Marvel Heroes Ensemble (Doctor Strange, Hulk & Star-Lord)', 'Conjunto de figuras estilizadas que re├║ne a tres de los h├®roes m├ís importantes del MCU. En primer plano destaca Doctor Strange en formato Mystery Mini, portando un escudo de energ├¡a m├¡stica y su ic├│nica Capa de Levitaci├│n. Lo acompa├▒an en el fondo un Funko Pop! de Hulk, mostrando su musculatura y expresi├│n de furia caracter├¡stica, y un Mystery Mini de Star-Lord con su m├íscara de combate y bl├ísters. La fotograf├¡a resalta la diferencia de texturas y el dise├▒o \"cabez├│n\" que ha dominado el coleccionismo moderno, ideal para exhibiciones tem├íticas de Marvel.', 'uploads/posts/post_69d6bc66ed74f6.57587694.jpg', NULL, 'figura', '2017', 0, '2026-04-09 00:36:54'),
(21, 3, 'asdada', 'asdadad', 'uploads/posts/post_69e0f63f58d835.09662754.jpg', NULL, 'figura', '1221', 8, '2026-04-16 18:46:23'),
(24, 3, 'sssss', '', 'uploads/posts/post_69e2dc0acedc78.43069912.jpg', NULL, 'figura', NULL, 6, '2026-04-18 05:19:06'),
(38, 3, 'Pragmata - Hugh & Diana', '¡Increíble set de Pragmata! Hugh y Diana lucen espectaculares. Una joya para cualquier coleccionista. #pragmata #capcom #figura #australcollector', 'uploads/posts/post_pragmata_1777055001.png', '[\"uploads\\/posts\\/post_pragmata_ex_69ebb519eeb09.png\",\"uploads\\/posts\\/post_pragmata_ex_69ebb519f1f6d.png\"]', 'figura', '2024', 1, '2026-04-25 00:23:22'),
(39, 1, 'friren', 'Mi pieza favorita del momento: friren. #figura #bocchi #collector', 'uploads/posts/post_bocchi_69ebb51a1cdc0.png', NULL, 'figura', '2024', 0, '2026-04-25 00:23:22'),
(40, 1, 'Sanji', 'Mi pieza favorita del momento: Sanji. #figura #bocchi #collector', 'uploads/posts/post_bocchi_69ebb51a34f70.jfif', NULL, 'figura', '2020', 0, '2026-04-25 00:23:22'),
(41, 1, 'Makima', 'Mi pieza favorita del momento: Makima. #cosplay #bocchi #collector', 'uploads/posts/post_bocchi_69ebb51a493b3.jpg', NULL, 'cosplay', '2020', 0, '2026-04-25 00:23:22'),
(42, 1, 'Marin Kitagawa', 'Mi pieza favorita del momento: Marin Kitagawa. #cosplay #bocchi #collector', 'uploads/posts/post_bocchi_69ebb51a6038e.webp', NULL, 'cosplay', '2022', 0, '2026-04-25 00:23:22'),
(43, 1, 'hilda', 'Mi pieza favorita del momento: hilda. #figura #bocchi #collector', 'uploads/posts/post_bocchi_69ebb51a757e2.png', NULL, 'figura', '2022', 0, '2026-04-25 00:23:22'),
(44, 1, 'Broly', 'Nueva adquisición: Broly. ¡Me encanta! #Bocchi #figura #australcollector', 'uploads/posts/post_69ebb51a8bf34.webp', NULL, 'figura', '2023', 0, '2026-04-25 00:22:22'),
(45, 2, 'yuta okkotsu', 'Nueva adquisición: yuta okkotsu. ¡Me encanta! #Imagine #figura #australcollector', 'uploads/posts/post_69ebb51a9f06f.webp', NULL, 'figura', '2022', 0, '2026-04-25 00:21:22'),
(46, 3, 'All Might', 'Nueva adquisición: All Might. ¡Me encanta! #Austral #figura #australcollector', 'uploads/posts/post_69ebb51aa644c.jpg', NULL, 'figura', '2021', 4, '2026-04-25 00:20:22'),
(52, 67, 'Roxy', 'Nueva adquisición: Roxy. ¡Me encanta! #Yuki_Tanaka_Vocaloid #figura #australcollector', 'uploads/posts/post_69ebb51b1b4ed.jpg', NULL, 'figura', '2020', 0, '2026-04-25 00:14:23'),
(56, 1, 'veggito', 'Nueva adquisición: veggito. ¡Me encanta! #Bocchi #figura #australcollector', 'uploads/posts/post_69ebb51b5cb05.webp', NULL, 'figura', '2022', 0, '2026-04-25 00:10:23'),
(57, 2, 'Uraraka', 'Nueva adquisición: Uraraka. ¡Me encanta! #Imagine #cosplay #australcollector', 'uploads/posts/post_69ebb51b71b33.jpg', NULL, 'cosplay', '2019', 0, '2026-04-25 00:09:23'),
(58, 3, 'rengoku', 'Nueva adquisición: rengoku. ¡Me encanta! #Austral #figura #australcollector', 'uploads/posts/post_69ebb51b88b79.png', NULL, 'figura', '2022', 5, '2026-04-25 00:08:23'),
(64, 67, 'Kaneki ken', 'Nueva adquisición: Kaneki ken. ¡Me encanta! #Yuki_Tanaka_Vocaloid #figura #australcollector', 'uploads/posts/post_69ebb51bebb9d.jpg', NULL, 'figura', '2021', 0, '2026-04-25 00:02:23'),
(69, 2, 'himmel', 'Nueva adquisición: himmel. ¡Me encanta! #Imagine #figura #australcollector', 'uploads/posts/post_69ebb51c50359.jpg', NULL, 'figura', '2021', 0, '2026-04-24 23:57:24'),
(70, 3, 'Hatsune Miku', 'Nueva adquisición: Hatsune Miku. ¡Me encanta! #Austral #cosplay #australcollector', 'uploads/posts/post_69ebb51c59d17.png', NULL, 'cosplay', '2020', 7, '2026-04-24 23:56:24'),
(76, 67, 'Konan Naruto Shippuden', 'Nueva adquisición: Konan Naruto Shippuden. ¡Me encanta! #Yuki_Tanaka_Vocaloid #cosplay #australcollector', 'uploads/posts/post_69ebb51cc2470.png', NULL, 'cosplay', '2020', 0, '2026-04-24 23:50:24'),
(80, 1, 'Vegeta Ozaru', 'Nueva adquisición: Vegeta Ozaru. ¡Me encanta! #Bocchi #figura #australcollector', 'uploads/posts/post_69ebb51d1d69a.webp', NULL, 'figura', '2017', 0, '2026-04-24 23:46:25'),
(81, 2, 'Kokushibo', 'Nueva adquisición: Kokushibo. ¡Me encanta! #Imagine #figura #australcollector', 'uploads/posts/post_69ebb51d2c416.webp', NULL, 'figura', '2023', 0, '2026-04-24 23:45:25'),
(82, 3, 'girl', 'Nueva adquisición: girl. ¡Me encanta! #Austral #figura #australcollector', 'uploads/posts/post_69ebb51d3586c.png', NULL, 'figura', '2020', 2, '2026-04-24 23:44:25'),
(88, 67, 'Inuyasha', 'Nueva adquisición: Inuyasha. ¡Me encanta! #Yuki_Tanaka_Vocaloid #figura #australcollector', 'uploads/posts/post_69ebb51d94060.webp', NULL, 'figura', '2016', 0, '2026-04-24 23:38:25'),
(92, 1, 'Hinata', 'Nueva adquisición: Hinata. ¡Me encanta! #Bocchi #cosplay #australcollector', 'uploads/posts/post_69ebb51dd78b3.png', NULL, 'cosplay', '2022', 0, '2026-04-24 23:34:25'),
(93, 3, 'ko - on', 'algo', 'uploads/posts/post_69ec15fd1fb071.71574952.png', NULL, 'figura', '2011', 3, '2026-04-25 01:16:45'),
(94, 3, 'BANDAI EVANGELION-01 TEST TYPE 01 (REBUILD OF EVANGELION)', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0cd802dd0.03779924.png', NULL, 'figura', NULL, 9, '2026-04-27 20:02:21'),
(95, 3, 'BANDAI PG MOBILE SUIT UNICORN GUNDAM', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0cd930e95.55922021.png', NULL, 'figura', NULL, 10, '2026-04-27 20:02:21'),
(96, 3, 'BANDAI POKEMON PLAMO MEWTWO', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0cda5e5a9.04004466.png', NULL, 'figura', NULL, 11, '2026-04-27 20:02:21'),
(97, 3, 'BANDAI POKEMON PLAMO PIKACHU', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0cdb70152.46985796.png', NULL, 'figura', NULL, 12, '2026-04-27 20:02:21'),
(98, 3, 'BANDAI RG MOBILE SUIT FREEDOM GUNDAM ZGMF-X 10A', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0cde21a05.39614634.png', NULL, 'figura', NULL, 13, '2026-04-27 20:02:22'),
(99, 3, 'FIGURA EVANGELION PRODUCTION MODEL 02 ACTION EDITION BLOKEES', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0ce0cda67.75362400.png', NULL, 'figura', NULL, 14, '2026-04-27 20:02:22'),
(100, 3, 'FIGURA HATSUNE MIKU DAALAMODE SERIES BLOKEES sit', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0ce2aab98.58648810.png', NULL, 'figura', NULL, 0, '2026-04-27 20:02:22'),
(101, 3, 'FIGURA HATSUNE MIKU DAALAMODE SERIES BLOKEES', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0ce563b89.21837143.png', NULL, 'figura', NULL, 15, '2026-04-27 20:02:22'),
(102, 3, 'FIGURA HATSUNE MIKU FANTASTIC SERIES BLOKEES', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0ce779a53.46276145.png', NULL, 'figura', NULL, 16, '2026-04-27 20:02:22'),
(103, 3, 'FIGURA SAKURA MIKU FANTASTIC SERIES BLOKEES', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0ce995629.62965133.png', NULL, 'figura', NULL, 17, '2026-04-27 20:02:22'),
(104, 3, 'KOTOBUKIYA EVANGELION PRODUCTION MODEL EVA-02B Q VER', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0cec1bef3.18754436.png', NULL, 'figura', NULL, 18, '2026-04-27 20:02:23'),
(105, 3, 'ONE PIECE GRAND SHIP COLLECTION MUGIWARA PIRATES GOING MERRY', 'Figura añadida a la colección.', 'uploads/posts/post_69efc0cf19a386.99283671.png', NULL, 'figura', NULL, 19, '2026-04-27 20:02:23'),
(106, 3, 'BANDAI FIGURE RISE STANDARD SON GOKU [ULTRA INSTINCT]', 'Figura añadida a la colección.', 'uploads/posts/post_69efc23e7ac167.18865790.png', NULL, 'figura', NULL, 20, '2026-04-27 20:08:30'),
(107, 3, 'BANDAI FIGURE RISE STANDARD SUPER SAIYAN BLUE GOGETA', 'Figura añadida a la colección.', 'uploads/posts/post_69efc23e906634.34688794.png', NULL, 'figura', NULL, 21, '2026-04-27 20:08:30'),
(108, 3, 'BANDAI FIGURE RISE STANDARD SUPER SAIYAN BROLY FULL POWER', 'Figura añadida a la colección.', 'uploads/posts/post_69efc23ea40be4.28387360.png', NULL, 'figura', NULL, 22, '2026-04-27 20:08:30'),
(109, 3, 'BANDAI PG MOBILE SUIT STRIKE FREEDOM GUNDAM ZGMF-X20A', 'Figura añadida a la colección.', 'uploads/posts/post_69efc23eb98867.52542193.png', NULL, 'figura', NULL, 23, '2026-04-27 20:08:30'),
(110, 3, 'BANDAI POKEMON PLAMO EEVEE', 'Figura añadida a la colección.', 'uploads/posts/post_69efc23ecd3dd2.53036607.png', NULL, 'figura', NULL, 24, '2026-04-27 20:08:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post_hashtags`
--

CREATE TABLE `post_hashtags` (
  `post_id` int(11) NOT NULL,
  `hashtag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `post_hashtags`
--

INSERT INTO `post_hashtags` (`post_id`, `hashtag_id`) VALUES
(38, 32),
(38, 33),
(38, 34),
(38, 35),
(39, 34),
(39, 37),
(39, 38),
(39, 39),
(40, 34),
(40, 37),
(40, 38),
(40, 39),
(41, 20),
(41, 37),
(41, 38),
(41, 39),
(42, 20),
(42, 37),
(42, 38),
(42, 39),
(43, 34),
(43, 37),
(43, 38),
(43, 39),
(44, 34),
(44, 35),
(44, 37),
(45, 34),
(45, 35),
(45, 60),
(46, 34),
(46, 35),
(46, 63),
(56, 34),
(56, 35),
(56, 37),
(57, 20),
(57, 35),
(57, 60),
(58, 34),
(58, 35),
(58, 63),
(69, 34),
(69, 35),
(69, 60),
(70, 20),
(70, 35),
(70, 63),
(80, 34),
(80, 35),
(80, 37),
(81, 34),
(81, 35),
(81, 60),
(82, 34),
(82, 35),
(82, 63),
(92, 20),
(92, 35),
(92, 37);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
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
  `verification_type` enum('none','austral','external') NOT NULL DEFAULT 'none',
  `verification_badge` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `email`, `password`, `nombre`, `apellido`, `fecha_nacimiento`, `biografia`, `role`, `is_active`, `avatar_url`, `banner_url`, `verification_type`, `verification_badge`, `created_at`) VALUES
(1, 'Bocchi', 'rjoseeliecer@gmail.com', '$2y$12$9OkElmW.eDaU9UR7eTm4ge9Ypflb/077tis0HuEBCE8jIGNlP1xai', '', '', '1995-05-28', '', 'user', 1, 'uploads/profiles/avatar_1_1775678996.png', 'uploads/profiles/banner_1_1775678996.jpg', 'austral', NULL, '2026-04-08 16:27:06'),
(2, 'Imagine', 'breakerimagine16@gmail.com', '$2y$12$9OkElmW.eDaU9UR7eTm4ge9Ypflb/077tis0HuEBCE8jIGNlP1xai', 'Kamijou', 'Touma', '1998-05-29', 'wsdddddddddddd', 'admin', 1, 'uploads/profiles/avatar_2_1775841637.jpg', 'uploads/profiles/banner_2_1775841637.jpg', 'external', 'uploads/badges/badge_2_69ea79ef6ce11.png', '2026-04-08 16:27:06'),
(3, 'Autral', 'austral.cadmin@gmail.com', '$2y$12$9OkElmW.eDaU9UR7eTm4ge9Ypflb/077tis0HuEBCE8jIGNlP1xai', '', '', '2001-05-30', '', 'admin', 1, 'uploads/profiles/avatar_3_1777079065.png', 'uploads/profiles/banner_3_1775695308.jpg', 'austral', NULL, '2026-04-08 16:27:06'),
(5, 'RexCaptin', 'rex.ford@example.com', '$2y$10$XZ0Xijs4Sv0zPJo5F4aQmetBVKJZdwnzNauFMB3OlER6MucLyDHrm', 'Rex', 'Ford', NULL, 'Coleccionista de clones y cascos.', 'user', 1, 'uploads/profiles/avatar_5.png', 'uploads/profiles/banner_5.png', 'austral', NULL, '2026-04-24 01:45:02'),
(10, 'LuffyPirateKing', 'luffy.monkey@example.com', '$2y$10$PPBKvWwwOaTSmLLfeJ17wu/rPKc.L5wY6hajfWwVth2MDPkIhZhTq', 'Monkey', 'Luffy', NULL, 'Buscando el One Piece de las figuras.', 'user', 1, 'uploads/profiles/avatar_10.png', 'uploads/profiles/banner_10.png', 'none', NULL, '2026-04-24 01:45:03'),
(12, 'SaberArturia_Fate', 'saber.fate@example.com', '$2y$10$boPYG47MHUGTl2UnGWfOIuzhUcM/L8fXg0pCqAVLLBS7GroBKjiJe', 'Arturia', 'Pendragon', NULL, 'Entusiasta de las espadas a escala.', 'user', 1, 'uploads/profiles/avatar_12.png', 'uploads/profiles/banner_12.png', 'none', NULL, '2026-04-24 01:45:03'),
(13, 'StarkTech_Collector', 'tony.stark@example.com', '$2y$10$NsOL1/t6a.xAj./8g79nO.hdfAgvL6pG/4LA9/Zak0zSnAFmou/VW', 'Tony', 'Stark', NULL, 'Genio, millonario, coleccionista.', 'user', 1, 'uploads/profiles/avatar_13.png', 'uploads/profiles/banner_13.png', 'austral', NULL, '2026-04-24 01:45:04'),
(14, 'Spidey_ToyPhoto', 'peter.parker@example.com', '$2y$10$CjRRvMhj1QCxffx1PyuMROxu8a6mlOsjpSGq1R2ywUPLhuQVbMjwa', 'Peter', 'Parker', NULL, 'Fot├│grafo de figuras de acci├│n.', 'user', 1, 'uploads/profiles/avatar_14.png', 'uploads/profiles/banner_14.png', 'none', NULL, '2026-04-24 01:45:04'),
(17, 'Tifa_SeventhHeaven', 'tifa.lockhart@example.com', '$2y$10$K7HWxCaC.XGoLMkaumhCEuiy3NN0woKKbQo.DMycx3kpha0xCVORa', 'Tifa', 'Lockhart', NULL, 'Busco estatuillas de Square Enix.', 'user', 1, 'uploads/profiles/avatar_17.png', 'uploads/profiles/banner_17.png', 'none', NULL, '2026-04-24 01:45:04'),
(19, 'WitcherGeralt', 'geralt.rivia@example.com', '$2y$10$SI1iNHRph8ACtJmBvS/nxuY30XxyntF7l3ZLORVrWpp3gtXownRK6', 'Geralt', 'Rivia', NULL, 'Cazador de ofertas en figuras de fantas├¡a.', 'user', 1, 'uploads/profiles/avatar_19.png', 'uploads/profiles/banner_19.png', 'none', NULL, '2026-04-24 01:45:04'),
(22, 'Soldier_Cloud', 'cloud.s@example.com', '$2y$10$LNxIFX7fwcFViCQYbODVBuyTW2BYQ53AbFpl6bB.zY7qnUkyXe5Ku', 'Cloud', 'Strife', NULL, 'No me interesa, solo quiero la Buster Sword.', 'user', 1, 'uploads/profiles/avatar_22.png', 'uploads/profiles/banner_22.png', 'none', NULL, '2026-04-24 01:45:05'),
(24, 'TombRaider_Lara', 'lara.croft@example.com', '$2y$10$fPZF7XORuUSSwwLuOAjn4uvk8k14C7OxpPTLbRU05qCOC/PoX8zXK', 'Lara', 'Croft', NULL, 'Buscadora de tesoros y figuras raras.', 'user', 1, 'uploads/profiles/avatar_24.png', 'uploads/profiles/banner_24.png', 'none', NULL, '2026-04-24 01:45:05'),
(28, 'WayneEnt_Marcus', 'marcus.wayne@example.com', '$2y$10$rusiAmW6hWOtuy.ZRaGV1eL26C8ZdtXM2pt9mb1ykpXrtX3bYwcyC', 'Marcus', 'Wayne', NULL, 'Especialista en fotograf├¡a de figuras.', 'user', 1, 'uploads/profiles/avatar_28.png', 'uploads/profiles/banner_28.png', 'austral', NULL, '2026-04-24 01:45:05'),
(29, 'Yuki_CosMaker', 'yuki.croft@example.com', '$2y$10$MjZ1oAwQm9/Ua.gQSyzsDOPzCj7h53d6/XXToT7fcHT89KwnzyXPa', 'Yuki', 'Croft', NULL, 'Cosplayer amateur.', 'user', 1, 'uploads/profiles/avatar_29.png', 'uploads/profiles/banner_29.png', 'none', NULL, '2026-04-24 01:45:05'),
(31, 'Lara_Valentine_Cos', 'lara.valentine@example.com', '$2y$10$jsNFHtxvgXw0n4vFU/C1IOegNz/qtHDjulbul.20gwwa5igF0Z7cS', 'Lara', 'Valentine', NULL, 'Hago mis propios trajes de cosplay.', 'user', 1, 'uploads/profiles/avatar_31.png', 'uploads/profiles/banner_31.png', 'none', NULL, '2026-04-24 01:45:06'),
(33, 'Misty_Water_Trainer', 'misty.lockhart@example.com', '$2y$10$xmO7ulJXRoMm8QbVzES0FOGfPXS4P4ihCrRNTUXvmut0L0hn3bcf.', 'Misty', 'Lockhart', NULL, 'Sigo todas las preventas.', 'user', 1, 'uploads/profiles/avatar_33.png', 'uploads/profiles/banner_33.png', 'austral', NULL, '2026-04-24 01:45:06'),
(39, 'Zelda_Tanaka_San', 'zelda.tanaka@example.com', '$2y$10$Kp5Q04y61EF.Tq1SqhuzC.B7HXE4aWrqxBjz/5.sUsIP.L5SFbzrq', 'Zelda', 'Tanaka', NULL, 'Cosplayer amateur.', 'user', 1, 'uploads/profiles/avatar_39.png', 'uploads/profiles/banner_39.png', 'none', NULL, '2026-04-24 01:45:07'),
(40, 'Link_The_Hero_90', 'link.smith@example.com', '$2y$10$IOM.eCZdihPD2srReO0i3ux.M72tu4HtpcN3ikEK3QxuQd8Xb//O6', 'Link', 'Smith', NULL, 'Buscando piezas raras de anime.', 'user', 1, 'uploads/profiles/avatar_40.png', 'uploads/profiles/banner_40.png', 'external', NULL, '2026-04-24 01:45:07'),
(42, 'Leon_S_Kennedy_Fig', 'leon.kazama@example.com', '$2y$10$FcN3aJg/85Fm0dVJLGeK..s6w6ytjRReh.GphoJmx9ilqQzXxrjSi', 'Leon', 'Kazama', NULL, 'Sigo todas las preventas.', 'user', 1, 'uploads/profiles/avatar_42.png', 'uploads/profiles/banner_42.png', 'none', NULL, '2026-04-24 01:45:07'),
(43, 'Tifa_Wayne_Gamer', 'tifa.wayne@example.com', '$2y$10$1cjbX12SzNxHfR4frk6F8enQN7qC.4ljaRyTz.a0aMcTJk4LZFcgq', 'Tifa', 'Wayne', NULL, 'Entusiasta de Marvel y DC.', 'user', 1, 'uploads/profiles/avatar_43.png', 'uploads/profiles/banner_43.png', 'austral', NULL, '2026-04-24 01:45:07'),
(44, 'Sephiroth_One_Wing', 'sephiroth.croft@example.com', '$2y$10$Pyiak/hJD2MjXSkLbJWvCOlesDzd5RwRQbA6HqmhywhDYgjHrmkG.', 'Sephiroth', 'Croft', NULL, 'Hago mis propios trajes de cosplay.', 'user', 1, 'uploads/profiles/avatar_44.png', 'uploads/profiles/banner_44.png', 'none', NULL, '2026-04-24 01:45:07'),
(46, 'Sora_Valentine_KH', 'sora.valentine@example.com', '$2y$10$/V1RhXZKubECexSN7QLCZucM6p38lJ9gPbecr4nB1NFzqyYLvx0EC', 'Sora', 'Valentine', NULL, 'Amo las figuras articuladas.', 'user', 1, 'uploads/profiles/avatar_46.png', 'uploads/profiles/banner_46.png', 'external', NULL, '2026-04-24 01:45:08'),
(48, 'Marcus_Lockhart_7', 'marcus.lockhart@example.com', '$2y$10$ExVFJQpv7lyUesz0SIAAAes7u00ih4Acgtp78kUiTB06LvSxGwSLW', 'Marcus', 'Lockhart', NULL, 'Coleccionista de figuras escala 1/6.', 'user', 1, 'uploads/profiles/avatar_48.png', 'uploads/profiles/banner_48.png', 'austral', NULL, '2026-04-24 01:45:08'),
(49, 'Yuki_Skywalker_Force', 'yuki.skywalker@example.com', '$2y$10$kUoOsdxXHBCNvdJYGcMrVemr3ZjJ7waHibwyg7cPXJ50tDbO4LWdu', 'Yuki', 'Skywalker', NULL, 'Cosplayer amateur.', 'user', 1, 'uploads/profiles/avatar_49.png', 'uploads/profiles/banner_49.png', 'none', NULL, '2026-04-24 01:45:08'),
(51, 'Lara_Uchiha_Cos', 'lara.uchiha@example.com', '$2y$10$cm0W.elVXnLjMenzd6hhbu5wNMDBnjHXwo3pdECZN24KSv63/WdZW', 'Lara', 'Uchiha', NULL, 'Enamorado de las resinas de Tsume Art.', 'user', 1, 'uploads/profiles/avatar_51.png', 'uploads/profiles/banner_51.png', 'none', NULL, '2026-04-24 01:45:08'),
(53, 'Misty_Dragneel_Tail', 'misty.dragneel@example.com', '$2y$10$6nRqhvaW2C5R9Tc0AVuJgeYBfPUQteSF9CKPLDAhuzB5q/YiAtfIW', 'Misty', 'Dragneel', NULL, 'Entusiasta de Marvel y DC.', 'user', 1, 'uploads/profiles/avatar_53.png', 'uploads/profiles/banner_53.png', 'austral', NULL, '2026-04-24 01:45:09'),
(58, 'Kratos_Wayne_Gow', 'kratos.wayne@example.com', '$2y$10$IsPSrEOGYF8fHRMJwtvfl.TRH9yqww8V9fDdIUaSgWCYo74Q4GGdK', 'Kratos', 'Wayne', NULL, 'Coleccionista de figuras escala 1/6.', 'user', 1, 'uploads/profiles/avatar_58.png', 'uploads/profiles/banner_58.png', 'austral', NULL, '2026-04-24 01:45:09'),
(59, 'Zelda_Croft_Adventurer', 'zelda.croft@example.com', '$2y$10$E2aM5KXTLk0YvJ81mBHnkutkMTI1Axhc4VZVm/YFxR6ZxxSdlod2W', 'Zelda', 'Croft', NULL, 'Cosplayer amateur.', 'user', 1, 'uploads/profiles/avatar_59.png', 'uploads/profiles/banner_59.png', 'none', NULL, '2026-04-24 01:45:09'),
(60, 'Link_Redfield_Z', 'link.redfield@example.com', '$2y$10$Gg.ULr/xi/YBY8h9eGKOr.xrKVJbm1vMnWrI6k.7dM8ByAaJcUrfW', 'Link', 'Redfield', NULL, 'Buscando piezas raras de anime.', 'user', 1, 'uploads/profiles/avatar_60.png', 'uploads/profiles/banner_60.png', 'external', NULL, '2026-04-24 01:45:09'),
(61, 'Leon_Strife_FF7', 'leon.strife@example.com', '$2y$10$GTtjXdDZMBfyHf523NvzCewebfcCj2u3zlSSpHjqfcICTPuhWblf2', 'Leon', 'Strife', NULL, 'Sigo todas las preventas.', 'user', 1, 'uploads/profiles/avatar_61.png', 'uploads/profiles/banner_61.png', 'none', NULL, '2026-04-24 01:45:09'),
(62, 'Sephiroth_Skywalker_Jedi', 'sephiroth.skywalker@example.com', '$2y$10$eUVVsyp9zbpogCVbMYtbLOjWh1kf5y02XWRrpUBUNvfUVldC4ATba', 'Sephiroth', 'Skywalker', NULL, 'Hago mis propios trajes de cosplay.', 'user', 1, 'uploads/profiles/avatar_62.png', 'uploads/profiles/banner_62.png', 'none', NULL, '2026-04-24 01:45:09'),
(64, 'Sora_Uchiha_Ninja', 'sora.uchiha@example.com', '$2y$10$VZ0lgWAEZkzm7ce67soRhOOgeAkUtbXKu9TevHa4pfG42VPQnlXhu', 'Sora', 'Uchiha', NULL, 'Amo las figuras articuladas.', 'user', 1, 'uploads/profiles/avatar_64.png', 'uploads/profiles/banner_64.png', 'external', NULL, '2026-04-24 01:45:10'),
(66, 'Marcus_Dragneel_Fire', 'marcus.dragneel@example.com', '$2y$10$K.08SyIIQ/MASKyBEHOSBe4WjwKAXU65HmEOVyF9yKJF2k5GNgbt2', 'Marcus', 'Dragneel', NULL, 'Coleccionista de figuras escala 1/6.', 'user', 1, 'uploads/profiles/avatar_66.png', 'uploads/profiles/banner_66.png', 'austral', NULL, '2026-04-24 01:45:10'),
(67, 'Yuki_Tanaka_Vocaloid', 'yuki.tanaka@example.com', '$2y$10$EXM6kJu6cdwZKBRm.LXs0.03ucCV34.NuYSfCVo4504wgENFoe4Vi', 'Yuki', 'Tanaka', '2005-05-18', 'Cosplayer amateur.', 'user', 1, 'uploads/profiles/avatar_67.png', 'uploads/profiles/banner_67.png', 'none', NULL, '2026-04-24 01:45:10'),
(69, 'Lara_Garcia_TR', 'lara.garcia@example.com', '$2y$10$545J8f5Mqeto8DdEg3q8C.aYbhnxgle1VxpLglqilV0G48aepvtOm', 'Lara', 'Garcia', NULL, 'Enamorado de las resinas de Tsume Art.', 'user', 1, 'uploads/profiles/avatar_69.png', 'uploads/profiles/banner_69.png', 'none', NULL, '2026-04-24 01:45:10'),
(71, 'Misty_Wayne_Gym', 'misty.wayne@example.com', '$2y$10$tKvaLUjfCwFFcMV7zNzPvuF3.rpIffLVKn7D.0/r7a1XO5b4jUMwq', 'Misty', 'Wayne', NULL, 'Entusiasta de Marvel y DC.', 'user', 1, 'uploads/profiles/avatar_71.png', 'uploads/profiles/banner_71.png', 'austral', NULL, '2026-04-24 01:45:10'),
(76, 'Kratos_Lockhart_Tifa', 'kratos.lockhart@example.com', '$2y$10$hBdiomavKbsYk71EgczCeOUzbaZcebnzGzg1MNK0yXDwJE27hW6pO', 'Kratos', 'Lockhart', NULL, 'Coleccionista de figuras escala 1/6.', 'user', 1, 'uploads/profiles/avatar_76.png', 'uploads/profiles/banner_76.png', 'austral', NULL, '2026-04-24 01:45:11'),
(77, 'Zelda_Skywalker_Sith', 'zelda.skywalker@example.com', '$2y$10$glgLUifi3i0CTMoBZt4LUO7KU7svrDMa3ixNZio9mkW8SSbqkEF/q', 'Zelda', 'Skywalker', NULL, 'Cosplayer amateur.', 'user', 1, 'uploads/profiles/avatar_77.png', 'uploads/profiles/banner_77.png', 'none', NULL, '2026-04-24 01:45:11'),
(78, 'Link_Kenobi_General', 'link.kenobi@example.com', '$2y$10$9yt3aTyV/iReWjHt3JIXwO5FoHc3VJijHPajlXLTFMHUIu/aoTECq', 'Link', 'Kenobi', '2026-04-30', 'Buscando piezas raras de anime.', 'user', 1, 'uploads/profiles/avatar_78.png', 'uploads/profiles/banner_78.png', 'external', 'uploads/badges/badge_78_69ebc6c71074c.png', '2026-04-24 01:45:12'),
(80, 'Leon_Ackerman_Levi', 'leon.ackerman@example.com', '$2y$10$3wdcO811eLzmIXdxJpf.3.hyeFkjBzyjZaXqLPr52shxwsdYfP6vi', 'Leon', 'Ackerman', NULL, 'Sigo todas las preventas.', 'user', 1, 'uploads/profiles/avatar_80.png', 'uploads/profiles/banner_80.png', 'none', NULL, '2026-04-24 01:45:12'),
(81, 'Tifa_Dragneel_Fairy', 'tifa.dragneel@example.com', '$2y$10$kSSUtJk6AgpGljF5Jl7ot.Jef9ErUVjZJhZ4FlyqF9F4aT6pv5X5W', 'Tifa', 'Dragneel', NULL, 'Entusiasta de Marvel y DC.', 'user', 1, 'uploads/profiles/avatar_81.png', 'uploads/profiles/banner_81.png', 'austral', NULL, '2026-04-24 01:45:12'),
(82, 'Sephiroth_Tanaka_San', 'sephiroth.tanaka@example.com', '$2y$10$MX9YmruDLgKDr9kqBHgeeOvldTStjd5DtIGNoszYxuIDuBEdfD7Bi', 'Sephiroth', 'Tanaka', NULL, 'Hago mis propios trajes de cosplay.', 'user', 1, 'uploads/profiles/avatar_82.png', 'uploads/profiles/banner_82.png', 'none', NULL, '2026-04-24 01:45:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `link_yt` varchar(255) NOT NULL,
  `destacado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `videos`
--

INSERT INTO `videos` (`id`, `titulo`, `link_yt`, `destacado`, `created_at`) VALUES
(1, 're zero', 'https://www.youtube.com/watch?v=VDGG9zi53rQ&pp=ygUOZmlndXJhIGppbiB3b28%3D', 0, '2026-04-09 00:37:37'),
(2, 'sun jin', 'https://www.youtube.com/watch?v=eRsfDA6BwQk&pp=ugMGCgJlcxABugUEEgJlc8oFDmZpZ3VyYSBqaW4gd29v0gcJCdkKAYcqIYzv2AcB', 0, '2026-04-09 00:37:53'),
(3, 'shangiry', 'https://www.youtube.com/watch?v=kGXWuzpMLRo&pp=ygUOZmlndXJhIGppbiB3b28%3D', 0, '2026-04-09 00:38:26'),
(4, 'sun jhin short', 'https://www.youtube.com/shorts/65apTQHwXZs', 0, '2026-04-09 00:39:06'),
(5, 'fairy tail ', 'https://www.youtube.com/watch?v=rHh7fi7yX8o&pp=0gcJCdoKAYcqIYzv', 0, '2026-04-09 00:39:32'),
(6, 'el principe', 'https://www.youtube.com/watch?v=jg5zCZc-7To&list=RDjg5zCZc-7To&start_radio=1', 0, '2026-04-16 21:09:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videos_portafolio`
--

CREATE TABLE `videos_portafolio` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT '',
  `descripcion` text DEFAULT NULL,
  `link_yt` varchar(255) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `videos_portafolio`
--

INSERT INTO `videos_portafolio` (`id`, `titulo`, `descripcion`, `link_yt`, `orden`, `created_at`) VALUES
(1, 'Video Antiguo', 'el hijo menor de la familia de reyes su opening ', 'https://www.youtube.com/watch?v=jg5zCZc-7To&list=RDjg5zCZc-7To&start_radio=1', 1, '2026-04-16 16:03:21'),
(2, 'Video Antiguo', '', 'https://www.youtube.com/watch?v=E0d2uEQJbXs&list=RDjg5zCZc-7To&index=2', 0, '2026-04-16 16:03:21'),
(3, 'Video Antiguo', NULL, 'https://www.youtube.com/watch?v=RkkGHJUpJCw&list=RDjg5zCZc-7To&index=3', 2, '2026-04-16 16:03:21'),
(4, 'Video Antiguo', NULL, 'https://www.youtube.com/watch?v=a4na2opArGY&list=RDjg5zCZc-7To&index=4', 3, '2026-04-16 16:03:21');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`clave`);

--
-- Indices de la tabla `destacado_mes`
--
ALTER TABLE `destacado_mes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `galeria_portafolio`
--
ALTER TABLE `galeria_portafolio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `hashtags`
--
ALTER TABLE `hashtags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `hp_promociones`
--
ALTER TABLE `hp_promociones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_seccion_activo` (`seccion`,`activo`,`orden`);

--
-- Indices de la tabla `identidad`
--
ALTER TABLE `identidad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mascot_texts`
--
ALTER TABLE `mascot_texts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_name` (`section_name`);

--
-- Indices de la tabla `perfil_ratings`
--
ALTER TABLE `perfil_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rating` (`rater_id`,`rated_user_id`),
  ADD KEY `rated_user_id` (`rated_user_id`);

--
-- Indices de la tabla `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `post_hashtags`
--
ALTER TABLE `post_hashtags`
  ADD PRIMARY KEY (`post_id`,`hashtag_id`),
  ADD KEY `hashtag_id` (`hashtag_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `videos_portafolio`
--
ALTER TABLE `videos_portafolio`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `destacado_mes`
--
ALTER TABLE `destacado_mes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `galeria_portafolio`
--
ALTER TABLE `galeria_portafolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `hashtags`
--
ALTER TABLE `hashtags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT de la tabla `hp_promociones`
--
ALTER TABLE `hp_promociones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT de la tabla `mascot_texts`
--
ALTER TABLE `mascot_texts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `perfil_ratings`
--
ALTER TABLE `perfil_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT de la tabla `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `videos_portafolio`
--
ALTER TABLE `videos_portafolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `destacado_mes`
--
ALTER TABLE `destacado_mes`
  ADD CONSTRAINT `destacado_mes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `perfil_ratings`
--
ALTER TABLE `perfil_ratings`
  ADD CONSTRAINT `perfil_ratings_ibfk_1` FOREIGN KEY (`rater_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `perfil_ratings_ibfk_2` FOREIGN KEY (`rated_user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `post_hashtags`
--
ALTER TABLE `post_hashtags`
  ADD CONSTRAINT `post_hashtags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_hashtags_ibfk_2` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- update_portafolio.sql
-- Ejecutar en Producción y Local para unificar galería y videos.

CREATE TABLE IF NOT EXISTS `portafolio_grupos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `orden` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `portafolio_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `grupo_id` INT(11) NOT NULL,
  `tipo` ENUM('foto', 'video') NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `titulo` VARCHAR(255) DEFAULT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `orden` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`grupo_id`) REFERENCES `portafolio_grupos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Migración opcional (Crea un grupo General y mueve los datos existentes)
INSERT INTO `portafolio_grupos` (`titulo`, `orden`) VALUES ('General', 0);
SET @grupo_id = LAST_INSERT_ID();

INSERT INTO `portafolio_items` (`grupo_id`, `tipo`, `url`, `descripcion`, `orden`, `created_at`)
SELECT @grupo_id, 'foto', imagen_url, descripcion, orden, created_at FROM `galeria_portafolio`;

INSERT INTO `portafolio_items` (`grupo_id`, `tipo`, `url`, `titulo`, `descripcion`, `orden`, `created_at`)
SELECT @grupo_id, 'video', link_yt, titulo, descripcion, orden, created_at FROM `videos_portafolio`;

-- Opcional: Eliminar tablas antiguas (Descomentar si estás seguro)
-- DROP TABLE `galeria_portafolio`;
-- DROP TABLE `videos_portafolio`;
