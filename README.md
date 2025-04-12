# Template Node Typescript tsx pkgroll

En este artículo, veremos cómo ejecutar TypeScript con node.js utilizando tsx y pkgroll.

## Recursos

- [https://tsx.is](https://tsx.is/)
- [https://tsx.is/watch-mode](https://tsx.is/watch-mode)
- [https://github.com/privatenumber/pkgroll](https://github.com/privatenumber/pkgroll)
- [https://github.com/privatenumber/ts-runtime-comparison](https://github.com/privatenumber/ts-runtime-comparison)
- [https://nodejs.org/en/learn/typescript/run-natively](https://nodejs.org/en/learn/typescript/run-natively)

## Software

- [https://nodejs.org/en/](https://nodejs.org/en/)
- [https://code.visualstudio.com/](https://code.visualstudio.com/)
- [https://www.docker.com/](https://www.docker.com/)

## Extensiones de vscode

- [https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)
- [https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)
- [https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
- [https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres)
- [https://marketplace.visualstudio.com/items?itemName=MariusAlchimavicius.json-to-ts](https://marketplace.visualstudio.com/items?itemName=MariusAlchimavicius.json-to-ts)
- [https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
- [https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [https://marketplace.visualstudio.com/items?itemName=jeff-hykin.better-dockerfile-syntax](https://marketplace.visualstudio.com/items?itemName=jeff-hykin.better-dockerfile-syntax) -[https://marketplace.visualstudio.com/items?itemName=atomiks.moonlight](https://marketplace.visualstudio.com/items?itemName=atomiks.moonlight)

## Node.js + TSX

tsx significa TypeScript Execute y es una mejora de Node.js para ejecutar TypeScript.

tsx está diseñado para simplificar tu experiencia con TypeScript. Mejora la compatibilidad de Node.js con TypeScript tanto en modo CommonJS como ESM, lo que te permite cambiar entre ellos sin problemas. También admite tsconfig.json rutas e incluye un modo Watch para que el desarrollo sea aún más fácil.

tsx no comprueba el tipo de su código por sí solo y espera que se lo gestione por separado. Si bien tsx no requiere que se instale TypeScript y las comprobaciones de tipo que ofrece su IDE pueden ser suficientes para scripts rápidos, **se recomienda encarecidamente incluir un paso de comprobación de tipo en sus proyectos**.

### ¿ts-node?

La idea de tsx surgió en un momento en el que el ecosistema de Node.js se estaba fragmentando debido al lanzamiento de los módulos ES (ESM). A medida que los paquetes migraban a ESM, los proyectos luchaban por conciliar sus aplicaciones CommonJS con las dependencias de ESM.

En aquel entonces, `ts-node` era la herramienta de referencia para ejecutar TypeScript en Node.js, pero carecía de compatibilidad con ESM y era bastante complicada de usar. Observamos varias herramientas de código abierto que usaban esbuild para ejecutar TypeScript en Node.js y decidimos unir estos esfuerzos en un proyecto simple y cohesivo.

tsx está diseñado para simplificar tu experiencia con TypeScript. Mejora Node.js con compatibilidad con TypeScript tanto en modo CommonJS como ESM, lo que te permite cambiar entre ellos sin problemas. También admite `tsconfig.json` rutas e incluye un modo Watch para que el desarrollo sea aún más fácil.

### Instalación

Crear un proyecto de Node.js

```sh
npm init -y
```

- typescript: Para comprobar el tipo con el tsccomando CLI
- @types/node: Para obtener la información de tipo de Node.js
- tsx: Para ejecutar TypeScript en tiempo de ejecución
- express: Para crear un servidor web
- @types/express: Para obtener la información de tipo de Express
- pg: Para conectarse a una base de datos PostgreSQL
- @types/pg: Para obtener la información de tipo de pg
- pkgroll: Para empaquetar tu aplicación en un solo archivo

```sh
npm init -y
```

```sh
npm i -D typescript tsx pkgroll
```

```sh
npm i -D @types/node @types/express @types/pg
```

```sh
npm i express pg
```

```sh
npx tsc --init
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "module": "Preserve", // Conservar el tipo de módulo
    "strict": true, // Habilitar todas las opciones de comprobación de tipo
    "moduleDetection": "force", // Forzar la detección de módulos
    "allowJs": true, // Permitir archivos JS
    "esModuleInterop": true, // Habilitar interoperabilidad de módulos
    "isolatedModules": true, // Habilitar la comprobación de módulos independientes,}
    "resolveJsonModule": true // Habilitar la resolución de módulos JSON
  },
  "include": ["src/**/*"], // Incluir archivos
  "exclude": ["node_modules", "dist"] // Excluir archivos
}
```

## package.json

- --clear-screen=false: Para que no se borre la pantalla al guardar un archivo

```json
{
  "exports": "./dist/index.mjs",
  "type": "module",
  "scripts": {
    "start": "node dist/index.mjs",
    "dev": "tsx watch --clear-screen=false src/index.ts",
    "build": "pkgroll"
  }
}
```

Ejecutar el proyecto en modo desarrollo

```sh
npm run dev
```

Pasar proyecto a producción

```sh
npm run build
```

Ejecutar el proyecto en modo producción

```sh
npm start
```

## docker-compose.yml

```yml
version: "3.8"

services:
  db:
    image: postgres:13
    container_name: postgres2
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
      POSTGRES_DB: dbtest
    ports:
      - "5434:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

## src/index.ts

```ts
import express from "express";
import homeRoute from "./routes/home.route";

import { testConnection } from "./database/index";

testConnection();

const __dirname = import.meta.dirname;
console.log(__dirname);

const app = express();

app.use("/", homeRoute);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhot:${PORT}`);
});
```

## src/routes/home.route.ts

```ts
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

export default router;
```

## src/database/index.ts

```ts
import pg from "pg";

const { Pool } = pg;
const connectionString = "postgresql://postgres:root@localhost:5434/dbtest";

export const pool = new Pool({ connectionString });

export const testConnection = async () => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("Postgres connected:", rows[0].now);
  } catch (error) {
    console.log(error);
  }
};
```

## node --watch --experimental-strip-types src/index.ts

Desde la versión 22.6.0, Node.js tiene compatibilidad experimental con algunas sintaxis de TypeScript. Puedes escribir código que sea TypeScript válido directamente en Node.js sin necesidad de transpilarlo primero.

La bandera `--experimental-strip-types` le dice a Node.js que elimine las anotaciones de tipo del código TypeScript antes de ejecutarlo.

¡Y eso es todo! Ahora puedes ejecutar código TypeScript directamente en Node.js sin necesidad de transpilarlo primero y usar TypeScript para detectar errores relacionados con los tipos. Las versiones futuras de Node.js incluirán compatibilidad con TypeScript sin necesidad de una bandera de línea de comandos.

### A tomar en cuenta:

- **Sin transformaciones de TypeScript**: --experimental-strip-types no admite transformaciones de TypeScript. Si su archivo requiere transformaciones, Node.js arrojará un error.
- **Enumeraciones y espacios de nombres**: las enumeraciones y los espacios de nombres no son compatibles con --experimental-strip-types. Si su archivo contiene enumeraciones o espacios de nombres, Node.js arrojará un error.
- **Estado experimental**: --experimental-strip-types es una función experimental y puede cambiar en futuras versiones de Node.js.

Esto generará un error:

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

console.log(Direction.Up);
```

`--experimental-strip-types` es una herramienta útil para scripts rápidos y pequeños, pero no es adecuada para proyectos grandes o complejos.

### ¿Cómo usar?

- `--watch`: Para que Node.js observe los cambios en el archivo y vuelva a ejecutarlo automáticamente, es nativo de Node.js.

```sh
node --watch --experimental-strip-types src/index.ts
```
