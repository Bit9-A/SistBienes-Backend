# SistBienes-Backend

Este repositorio contiene el backend de la aplicación de gestión de bienes nacionales. Desarrollado con Node.js, TypeScript y Express, se conecta a una base de datos MySQL y proporciona una API RESTful para la administración de bienes, usuarios, incorporaciones, desincorporaciones, transferencias y reportes.

## Tecnologías Utilizadas

*   **Node.js**: Entorno de ejecución para JavaScript.
*   **TypeScript**: Superset de JavaScript que añade tipado estático.
*   **Express**: Framework web para Node.js.
*   **MySQL**: Base de datos relacional.
*   **tsx**: Para la ejecución de TypeScript en tiempo de desarrollo.
*   **pkgroll**: Para empaquetar la aplicación para producción.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente:

*   [Node.js](https://nodejs.org/en/) (versión 18 o superior recomendada)
*   [npm](https://www.npmjs.com/) (viene con Node.js)
*   [Visual Studio Code](https://code.visualstudio.com/) (editor de código recomendado)

## Instalación y Configuración

Sigue estos pasos para configurar y ejecutar el proyecto localmente:

### 1. Clonar el Repositorio

```sh
git clone https://github.com/Bit9-A/SistBienes-Backend.git
cd SistBienes-Backend
```

### 2. Instalar Dependencias

```sh
npm install
```

### 3. Configurar la Base de Datos (MySQL)

El proyecto utiliza MySQL. Asegúrate de tener una instancia de MySQL corriendo localmente o accesible.

Puedes crear una base de datos llamada `test` (o el nombre que prefieras) y un usuario con los permisos adecuados.

### 4. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade las variables de entorno necesarias. Un ejemplo básico podría ser:

```
PORT=8000
DATABASE_URL="mysql://root:@localhost:3306/test"
JWT_SECRET="your_jwt_secret_key"
```

Asegúrate de reemplazar `your_jwt_secret_key` con una clave secreta fuerte para la autenticación JWT.

### 5. Ejecutar el Proyecto

#### Modo Desarrollo

Para ejecutar el servidor en modo desarrollo con recarga automática:

```sh
npm run dev
```

El servidor se iniciará en `http://localhost:8000` (o el puerto especificado en tu `.env`).

#### Modo Producción

Para construir y ejecutar el proyecto en modo producción:

```sh
npm run build
npm start
```

Esto compilará el código TypeScript a JavaScript y luego ejecutará la versión optimizada.

## Estructura del Proyecto

El código fuente principal se encuentra en el directorio `src/`.

```
src/
├── database/             # Configuración de la conexión a la base de datos
├── images/               # Imágenes utilizadas en el proyecto (ej. para reportes)
├── index.ts              # Punto de entrada principal de la aplicación
├── jobs/                 # Tareas programadas (ej. cierre de sesiones antiguas)
├── middlewares/          # Middlewares de Express (ej. autenticación JWT)
├── modules/              # Módulos de la aplicación (cada uno con su lógica, modelos, controladores y rutas)
│   ├── audit/
│   ├── auth/
│   ├── components/
│   ├── concept-des/
│   ├── concept-inc/
│   ├── config/
│   ├── dept/
│   ├── desincorp/
│   ├── furniture/
│   ├── goods-status/
│   ├── history/
│   ├── home/
│   ├── incorp/
│   ├── logs/
│   ├── marca_modelo/
│   ├── missing-goods/
│   ├── notifications/
│   ├── parish/
│   ├── report/
│   ├── subgroup/
│   ├── tranfer/
│   ├── transferComponent/
│   ├── users/
│   └── users-role/
├── plantillas/           # Plantillas para la generación de documentos (ej. Excel)
└── routes/               # Rutas adicionales (ej. para exportación de Excel, etiquetas QR)
```

## Endpoints de la API

Las rutas de la API están organizadas por módulos dentro de `src/modules/`. Puedes explorar los archivos `*.route.ts` dentro de cada módulo para ver los endpoints disponibles.

Algunos ejemplos de rutas principales incluyen:

*   `/auth`: Autenticación de usuarios.
*   `/`: Ruta principal (home).
*   `/user`: Gestión de usuarios.
*   `/subgroup`: Gestión de subgrupos.
*   `/incorp`: Gestión de incorporaciones de bienes.
*   `/goods-status`: Gestión de estados de bienes.
*   `/user_role`: Gestión de roles de usuario.
*   `/concept-incorp`: Gestión de conceptos de incorporación.
*   `/concept-desincorp`: Gestión de conceptos de desincorporación.
*   `/furniture`: Gestión de mobiliario.
*   `/api`: Rutas relacionadas con marcas y modelos.
*   `/dept`: Gestión de departamentos.
*   `/parish`: Gestión de parroquias.
*   `/audit`: Rutas de auditoría.
*   `/transfers`: Gestión de transferencias de bienes.
*   `/notifications`: Gestión de notificaciones.
*   `/config`: Configuración de la aplicación.
*   `/missing-goods`: Gestión de bienes faltantes.
*   `/desincorp`: Gestión de desincorporaciones.
*   `/history`: Historial de bienes.
*   `/logs`: Gestión de logs.
*   `/components`: Gestión de componentes.
*   `/transfer-component`: Gestión de transferencias de componentes.
*   `/report`: Generación de reportes.
*   `/excel`: Exportación de datos a Excel.
*   `/labels`: Generación de etiquetas QR.

## Contribución

Si deseas contribuir a este proyecto, por favor, sigue las mejores prácticas de desarrollo y crea Pull Requests para tus cambios.
