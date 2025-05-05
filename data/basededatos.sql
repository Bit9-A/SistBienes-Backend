CREATE TABLE `TipoUsuario` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `Dept` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(50) DEFAULT null
);

CREATE TABLE `Parroquia` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `Usuarios` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `tipo_usuario_id` INT DEFAULT null,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(15) DEFAULT null,
  `dept_id` INT DEFAULT null,
  `cedula` VARCHAR(20) NOT NULL,
  `login_token` VARCHAR(255) DEFAULT null,
  `login_token_expiration` DATETIME DEFAULT null,
  `reset_token` VARCHAR(255) DEFAULT null,
  `reset_token_expiration` DATETIME DEFAULT null
);

CREATE TABLE `Auditoria` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `usuario_id` INT DEFAULT null,
  `entrada` DATETIME DEFAULT null,
  `salida` DATETIME DEFAULT null,
  `ip` VARCHAR(45) DEFAULT null
);

CREATE TABLE `Logs` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `usuario_id` INT DEFAULT null,
  `fecha` DATETIME DEFAULT (NOW()),
  `accion` VARCHAR(255) DEFAULT null,
  `detalles` TEXT
);

CREATE TABLE `EstadoBien` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `SubGrupoMuebles` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(50) DEFAULT null
);

CREATE TABLE `SubGrupoInmuebles` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(50) DEFAULT null
);

CREATE TABLE `Muebles` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `subgrupo_id` INT DEFAULT null,
  `cantidad` INT NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `marca` VARCHAR(100) DEFAULT null,
  `modelo` VARCHAR(100) DEFAULT null,
  `numero_serial` VARCHAR(100) DEFAULT null,
  `valor_unitario` DECIMAL(10,2) DEFAULT null,
  `valor_total` DECIMAL(10,2) DEFAULT null,
  `fecha` DATE DEFAULT null,
  `dept_id` INT DEFAULT null,
  `estado_id` INT DEFAULT null,
  `parroquia_id` INT DEFAULT null,
  `numero_identificacion` VARCHAR(100) NOT NULL
);

CREATE TABLE `ConceptoIncorp` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(50) DEFAULT null
);

CREATE TABLE `ConceptoDesincorp` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(50) DEFAULT null
);

CREATE TABLE `Incorp` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `bien_id` INT DEFAULT null,
  `fecha` DATE DEFAULT null,
  `valor` DECIMAL(10,2) DEFAULT null,
  `cantidad` INT DEFAULT null,
  `concepto_id` INT DEFAULT null,
  `dept_id` INT DEFAULT null
);

CREATE TABLE `Desincorp` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `bien_id` INT DEFAULT null,
  `fecha` DATE DEFAULT null,
  `valor` DECIMAL(10,2) DEFAULT null,
  `cantidad` INT DEFAULT null,
  `concepto_id` INT DEFAULT null,
  `dept_id` INT DEFAULT null
);

CREATE TABLE `Traslado` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `fecha` DATE DEFAULT null,
  `cantidad` INT DEFAULT null,
  `origen_id` INT DEFAULT null,
  `destino_id` INT DEFAULT null
);

CREATE TABLE `bien_traslado` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `traslado_id` INT DEFAULT null,
  `mueble_id` INT DEFAULT null
);

CREATE TABLE `BienesFaltantes` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `unidad` VARCHAR(255) DEFAULT null,
  `existencias` INT DEFAULT null,
  `diferencia_cantidad` INT DEFAULT null,
  `diferencia_valor` DECIMAL(10,2) DEFAULT null,
  `funcionario_id` INT DEFAULT null,
  `jefe_id` INT DEFAULT null,
  `observaciones` TEXT,
  `fecha` DATE DEFAULT null,
  `bien_id` INT DEFAULT null
);

CREATE TABLE `Costo_Inmueble` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `fecha_adquisicion` DATE DEFAULT null,
  `valor_adquisicion` DECIMAL(10,2) DEFAULT null,
  `total_actualizado` DECIMAL(10,2) DEFAULT null COMMENT 'valor_adquisicion + suma de AdicionMejora.monto'
);

CREATE TABLE `AdicionMejora` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `activo_id` INT DEFAULT null,
  `fecha_adicion` DATE DEFAULT null,
  `monto` DECIMAL(10,2) DEFAULT null,
  `descripcion` VARCHAR(255) DEFAULT null
);

CREATE TABLE `Inmuebles` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `subgrupo_id` INT DEFAULT null,
  `fecha` DATE DEFAULT null,
  `ubicacion_geografica` VARCHAR(255) DEFAULT null,
  `denominacion_inmueble` VARCHAR(255) DEFAULT null,
  `valor_bs` DECIMAL(10,2) DEFAULT null,
  `parroquia_id` INT DEFAULT null,
  `tipo_inmueble` INT DEFAULT null
);

CREATE TABLE `tipos_caracteristicas_edificio` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) DEFAULT null
);

CREATE TABLE `caracteristicas` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `tipo_caracteristica_id` INT DEFAULT null,
  `nombre` VARCHAR(255) DEFAULT null
);

CREATE TABLE `Inmuebles_Descripcion_de_Edificios` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `inmueble_id` INT DEFAULT null,
  `area_total_terreno` DECIMAL(10,2) DEFAULT null,
  `area_construccion` DECIMAL(10,2) DEFAULT null,
  `numero_pisos` INT DEFAULT null,
  `area_total_construccion` DECIMAL(10,2) DEFAULT null,
  `area_anexidades` DECIMAL(10,2) DEFAULT null,
  `linderos` VARCHAR(255) DEFAULT null,
  `estudio_legal` VARCHAR(255) DEFAULT null,
  `valor_contabilidad_id` INT DEFAULT null,
  `avaluo` VARCHAR(255) DEFAULT null COMMENT 'Hace referencia a el proceso de estimar el valor de un bien',
  `encargado_por_id` INT DEFAULT null,
  `lugar_inscripcion` VARCHAR(255) DEFAULT null,
  `fecha_inscripcion` DATETIME DEFAULT null
);

CREATE TABLE `caracteristicas_inmueble` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `inmueble_id` INT DEFAULT null,
  `caracteristica_id` INT DEFAULT null,
  `observaciones` TEXT
);

CREATE TABLE `tipos_caracteristicas_terreno` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) DEFAULT null
);

CREATE TABLE `caracteristicas_terreno` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `tipo_caracteristica_id` INT DEFAULT null,
  `nombre` VARCHAR(255) DEFAULT null
);

CREATE TABLE `Inmuebles_Descripcion_de_Terrenos` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `inmueble_id` INT DEFAULT null,
  `area_total_terreno` DECIMAL(10,2) DEFAULT null,
  `area_construcciones` DECIMAL(10,2) DEFAULT null
);

CREATE TABLE `caracteristicas_inmueble_terreno` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `inmueble_id` INT DEFAULT null,
  `caracteristica_id` INT DEFAULT null,
  `observaciones` TEXT
);

CREATE UNIQUE INDEX `email_UNIQUE` ON `Usuarios` (`email`);

CREATE UNIQUE INDEX `cedula_UNIQUE` ON `Usuarios` (`cedula`);

CREATE INDEX `tipo_usuario_id` ON `Usuarios` (`tipo_usuario_id`);

CREATE INDEX `dept_id` ON `Usuarios` (`dept_id`);

CREATE INDEX `usuario_id` ON `Auditoria` (`usuario_id`);

CREATE INDEX `usuario_id` ON `Logs` (`usuario_id`);

CREATE UNIQUE INDEX `numero_identificacion_UNIQUE` ON `Muebles` (`numero_identificacion`);

CREATE INDEX `subgrupo_id` ON `Muebles` (`subgrupo_id`);

CREATE INDEX `dept_id` ON `Muebles` (`dept_id`);

CREATE INDEX `estado_id` ON `Muebles` (`estado_id`);

CREATE INDEX `parroquia_id` ON `Muebles` (`parroquia_id`);

CREATE INDEX `bien_id` ON `Incorp` (`bien_id`);

CREATE INDEX `concepto_id` ON `Incorp` (`concepto_id`);

CREATE INDEX `dept_id` ON `Incorp` (`dept_id`);

CREATE INDEX `bien_id` ON `Desincorp` (`bien_id`);

CREATE INDEX `concepto_id` ON `Desincorp` (`concepto_id`);

CREATE INDEX `dept_id` ON `Desincorp` (`dept_id`);

CREATE INDEX `origen_id` ON `Traslado` (`origen_id`);

CREATE INDEX `destino_id` ON `Traslado` (`destino_id`);

CREATE INDEX `traslado_id` ON `bien_traslado` (`traslado_id`);

CREATE INDEX `mueble_id` ON `bien_traslado` (`mueble_id`);

CREATE INDEX `funcionario_id` ON `BienesFaltantes` (`funcionario_id`);

CREATE INDEX `jefe_id` ON `BienesFaltantes` (`jefe_id`);

CREATE INDEX `bien_id` ON `BienesFaltantes` (`bien_id`);

CREATE INDEX `activo_id` ON `AdicionMejora` (`activo_id`);

CREATE INDEX `parroquia_id` ON `Inmuebles` (`parroquia_id`);

CREATE INDEX `subgrupo_id` ON `Inmuebles` (`subgrupo_id`);

CREATE INDEX `tipo_caracteristica_id` ON `caracteristicas` (`tipo_caracteristica_id`);

CREATE INDEX `inmueble_id` ON `Inmuebles_Descripcion_de_Edificios` (`inmueble_id`);

CREATE INDEX `valor_contabilidad_id` ON `Inmuebles_Descripcion_de_Edificios` (`valor_contabilidad_id`);

CREATE INDEX `encargado_por_id` ON `Inmuebles_Descripcion_de_Edificios` (`encargado_por_id`);

CREATE INDEX `inmueble_id` ON `caracteristicas_inmueble` (`inmueble_id`);

CREATE INDEX `caracteristica_id` ON `caracteristicas_inmueble` (`caracteristica_id`);

CREATE INDEX `tipo_caracteristica_id` ON `caracteristicas_terreno` (`tipo_caracteristica_id`);

CREATE INDEX `inmueble_id` ON `Inmuebles_Descripcion_de_Terrenos` (`inmueble_id`);

CREATE INDEX `inmueble_id` ON `caracteristicas_inmueble_terreno` (`inmueble_id`);

CREATE INDEX `caracteristica_id` ON `caracteristicas_inmueble_terreno` (`caracteristica_id`);

ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_ibfk_1` FOREIGN KEY (`tipo_usuario_id`) REFERENCES `TipoUsuario` (`id`);

ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_ibfk_2` FOREIGN KEY (`dept_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Auditoria` ADD CONSTRAINT `Auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `Logs` ADD CONSTRAINT `Logs_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `Muebles` ADD CONSTRAINT `Muebles_ibfk_1` FOREIGN KEY (`subgrupo_id`) REFERENCES `SubGrupoMuebles` (`id`);

ALTER TABLE `Muebles` ADD CONSTRAINT `Muebles_ibfk_2` FOREIGN KEY (`dept_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Muebles` ADD CONSTRAINT `Muebles_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `EstadoBien` (`id`);

ALTER TABLE `Muebles` ADD CONSTRAINT `Muebles_ibfk_4` FOREIGN KEY (`parroquia_id`) REFERENCES `Parroquia` (`id`);

ALTER TABLE `Incorp` ADD CONSTRAINT `Incorp_ibfk_1` FOREIGN KEY (`bien_id`) REFERENCES `Muebles` (`id`);

ALTER TABLE `Incorp` ADD CONSTRAINT `Incorp_ibfk_2` FOREIGN KEY (`concepto_id`) REFERENCES `ConceptoIncorp` (`id`);

ALTER TABLE `Incorp` ADD CONSTRAINT `Incorp_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Desincorp` ADD CONSTRAINT `Desincorp_ibfk_1` FOREIGN KEY (`bien_id`) REFERENCES `Muebles` (`id`);

ALTER TABLE `Desincorp` ADD CONSTRAINT `Desincorp_ibfk_2` FOREIGN KEY (`concepto_id`) REFERENCES `ConceptoDesincorp` (`id`);

ALTER TABLE `Desincorp` ADD CONSTRAINT `Desincorp_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Traslado` ADD CONSTRAINT `Traslado_ibfk_1` FOREIGN KEY (`origen_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Traslado` ADD CONSTRAINT `Traslado_ibfk_2` FOREIGN KEY (`destino_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `bien_traslado` ADD CONSTRAINT `bien_traslado_ibfk_1` FOREIGN KEY (`traslado_id`) REFERENCES `Traslado` (`id`);

ALTER TABLE `bien_traslado` ADD CONSTRAINT `bien_traslado_ibfk_2` FOREIGN KEY (`mueble_id`) REFERENCES `Muebles` (`id`);

ALTER TABLE `BienesFaltantes` ADD CONSTRAINT `BienesFaltantes_ibfk_1` FOREIGN KEY (`bien_id`) REFERENCES `Muebles` (`id`);

ALTER TABLE `BienesFaltantes` ADD CONSTRAINT `BienesFaltantes_ibfk_2` FOREIGN KEY (`funcionario_id`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `BienesFaltantes` ADD CONSTRAINT `BienesFaltantes_ibfk_3` FOREIGN KEY (`jefe_id`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `AdicionMejora` ADD CONSTRAINT `AdicionMejora_ibfk_1` FOREIGN KEY (`activo_id`) REFERENCES `Costo_Inmueble` (`id`);

ALTER TABLE `Inmuebles` ADD CONSTRAINT `Inmuebles_ibfk_1` FOREIGN KEY (`parroquia_id`) REFERENCES `Parroquia` (`id`);

ALTER TABLE `Inmuebles` ADD CONSTRAINT `Inmuebles_ibfk_2` FOREIGN KEY (`subgrupo_id`) REFERENCES `SubGrupoInmuebles` (`id`);

ALTER TABLE `caracteristicas` ADD CONSTRAINT `caracteristicas_ibfk_1` FOREIGN KEY (`tipo_caracteristica_id`) REFERENCES `tipos_caracteristicas_edificio` (`id`);

ALTER TABLE `Inmuebles_Descripcion_de_Edificios` ADD CONSTRAINT `Inmuebles_Descripcion_de_Edificios_ibfk_1` FOREIGN KEY (`inmueble_id`) REFERENCES `Inmuebles` (`id`);

ALTER TABLE `Inmuebles_Descripcion_de_Edificios` ADD CONSTRAINT `Inmuebles_Descripcion_de_Edificios_ibfk_2` FOREIGN KEY (`valor_contabilidad_id`) REFERENCES `Costo_Inmueble` (`id`);

ALTER TABLE `Inmuebles_Descripcion_de_Edificios` ADD CONSTRAINT `Inmuebles_Descripcion_de_Edificios_ibfk_3` FOREIGN KEY (`encargado_por_id`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `caracteristicas_inmueble` ADD CONSTRAINT `caracteristicas_inmueble_ibfk_1` FOREIGN KEY (`inmueble_id`) REFERENCES `Inmuebles_Descripcion_de_Edificios` (`id`);

ALTER TABLE `caracteristicas_inmueble` ADD CONSTRAINT `caracteristicas_inmueble_ibfk_2` FOREIGN KEY (`caracteristica_id`) REFERENCES `caracteristicas` (`id`);

ALTER TABLE `caracteristicas_terreno` ADD CONSTRAINT `caracteristicas_terreno_ibfk_1` FOREIGN KEY (`tipo_caracteristica_id`) REFERENCES `tipos_caracteristicas_terreno` (`id`);

ALTER TABLE `Inmuebles_Descripcion_de_Terrenos` ADD CONSTRAINT `Inmuebles_Descripcion_de_Terrenos_ibfk_1` FOREIGN KEY (`inmueble_id`) REFERENCES `Inmuebles` (`id`);

ALTER TABLE `caracteristicas_inmueble_terreno` ADD CONSTRAINT `caracteristicas_inmueble_terreno_ibfk_1` FOREIGN KEY (`inmueble_id`) REFERENCES `Inmuebles_Descripcion_de_Terrenos` (`id`);

ALTER TABLE `caracteristicas_inmueble_terreno` ADD CONSTRAINT `caracteristicas_inmueble_terreno_ibfk_2` FOREIGN KEY (`caracteristica_id`) REFERENCES `caracteristicas_terreno` (`id`);
