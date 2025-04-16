CREATE TABLE `SubGrupoMuebles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `SubGrupoInmuebles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `Muebles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `subgrupo_id` INT,
  `cantidad` INT NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `marca` VARCHAR(100),
  `modelo` VARCHAR(100),
  `numero_serial` VARCHAR(100),
  `valor_unitario` DECIMAL(10,2),
  `valor_total` DECIMAL(10,2),
  `fecha` DATE,
  `dept_id` INT,
  `estado_id` INT,
  `parroquia_id` INT
);

CREATE TABLE `Inmuebles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `subgrupo_id` INT,
  `fecha` DATE,
  `ubicacion_geografica` VARCHAR(255),
  `denominacion_inmueble` VARCHAR(255),
  `valor_bs` DECIMAL(10,2),
  `parroquia_id` INT,
  `tipo_inmueble` INT
);

CREATE TABLE `Dept` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `Parroquia` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `TipoUsuario` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `Usuarios` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `tipo_usuario` INT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(16) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(15),
  `dept_id` INT,
  `cedula` VARCHAR(20) NOT NULL
);

CREATE TABLE `Auditoria` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` INT,
  `entrada` DATETIME,
  `salida` DATETIME,
  `ip` VARCHAR(45)
);

CREATE TABLE `EstadoBien` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `ConceptoIncorp` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `ConceptoDesincorp` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `Incorp` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `bien_id` INT,
  `fecha` DATE,
  `valor` DECIMAL(10,2),
  `cantidad` INT,
  `concepto_id` INT,
  `dept_id` INT
);

CREATE TABLE `Desincorp` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `bien_id` INT,
  `fecha` DATE,
  `valor` DECIMAL(10,2),
  `cantidad` INT,
  `concepto_id` INT,
  `dept_id` INT
);

CREATE TABLE `Traslado` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `fecha` DATE,
  `cantidad` INT,
  `bien_id` INT,
  `origen_id` INT,
  `destino_id` INT
);

CREATE TABLE `BienesFaltantes` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `traslado_id` INT,
  `unidad` VARCHAR(255),
  `existencias` INT,
  `diferencia_cantidad` INT,
  `diferencia_valor` DECIMAL(10,2),
  `funcionario_id` INT,
  `jefe_id` INT,
  `observaciones` TEXT
);

CREATE TABLE `Logs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` INT,
  `fecha` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `accion` VARCHAR(255),
  `detalles` TEXT
);

ALTER TABLE `Muebles` ADD FOREIGN KEY (`subgrupo_id`) REFERENCES `SubGrupoMuebles` (`id`);

ALTER TABLE `Inmuebles` ADD FOREIGN KEY (`subgrupo_id`) REFERENCES `SubGrupoInmuebles` (`id`);

ALTER TABLE `Muebles` ADD FOREIGN KEY (`dept_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Muebles` ADD FOREIGN KEY (`estado_id`) REFERENCES `EstadoBien` (`id`);

ALTER TABLE `Muebles` ADD FOREIGN KEY (`parroquia_id`) REFERENCES `Parroquia` (`id`);

ALTER TABLE `Inmuebles` ADD FOREIGN KEY (`parroquia_id`) REFERENCES `Parroquia` (`id`);

ALTER TABLE `Usuarios` ADD FOREIGN KEY (`tipo_usuario`) REFERENCES `TipoUsuario` (`id`);

ALTER TABLE `Usuarios` ADD FOREIGN KEY (`dept_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Auditoria` ADD FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `Incorp` ADD FOREIGN KEY (`bien_id`) REFERENCES `Muebles` (`id`);

ALTER TABLE `Incorp` ADD FOREIGN KEY (`concepto_id`) REFERENCES `ConceptoIncorp` (`id`);

ALTER TABLE `Incorp` ADD FOREIGN KEY (`dept_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Desincorp` ADD FOREIGN KEY (`bien_id`) REFERENCES `Muebles` (`id`);

ALTER TABLE `Desincorp` ADD FOREIGN KEY (`concepto_id`) REFERENCES `ConceptoDesincorp` (`id`);

ALTER TABLE `Desincorp` ADD FOREIGN KEY (`dept_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Traslado` ADD FOREIGN KEY (`bien_id`) REFERENCES `Muebles` (`id`);

ALTER TABLE `Traslado` ADD FOREIGN KEY (`origen_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `Traslado` ADD FOREIGN KEY (`destino_id`) REFERENCES `Dept` (`id`);

ALTER TABLE `BienesFaltantes` ADD FOREIGN KEY (`traslado_id`) REFERENCES `Traslado` (`id`);

ALTER TABLE `BienesFaltantes` ADD FOREIGN KEY (`funcionario_id`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `BienesFaltantes` ADD FOREIGN KEY (`jefe_id`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `Logs` ADD FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`);
