# Social Network (API)

Este es un ejemplo práctico una "red social" en la cual se pueden crear usuarios, publicaciones, darles like y comentar.

Esta es solo la API, en esta se usaron las siguientes tecnologías: [NestJS](https://nestjs.com/), [Prisma (SQLite)](https://www.prisma.io/), [JWT (Autenticación)](https://jwt.io/)

## Tabla de contenido:

- [Inicialización](#inicialización)
  - [Instalar dependencias](#instalar-dependencias)
  - [Variables de entorno](#variables-de-entorno)
  - [Migración](#migración-prisma)
  - [Iniciar en modo desarrollo](#iniciar-en-modo-desarrollo)
- [Rutas protegidas](#rutas-protegidas)
- [Endpoints](#endpoints)
  - [`/auth` routes](#auth)
  - [`/users` routes](#users)
  - [`/posts` routes](#posts)

## Inicialización

Para iniciar el proyecto, obviamente hay que configurar algunas cosas, compilar, etc. Aquí verás los comandos básicos.

Eres libre de usar el gestro de paquetes de tu gusto (Yarn, PNPM, etc).

### Instalar dependencias

```bash
npm install
```

### Variables de entorno

Copia y pega el contenido dentro de `.env.example` en un nuevo archivo `.env`;

```toml
DATABASE_URL="file:./dev.db"
ACCESS_SECRET="mysecretkey" // Change this
```

### Migración (Prisma)

```bash
npx prisma migrate dev --name init
```

### Iniciar en modo desarrollo

```bash
npm run start:dev
```

## Rutas protegidas

Existen rutas protegidas, para acceder a ellas se les debe pasar un [**Header**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) al momento de hacer una petición.

```
Authorization: Bearer <token>
```

Usted reemplazaría `<token>` por el token que se obtiene al [crear una cuenta](#auth) o [iniciar sesión](#auth).

En el caso que no se agregue ese **Header** a la petición, el token esté expirado/malformado o el contenido del **Header** sea inválido, el servidor responderá con un código [`401`Unauthorized](https://developer.mozilla.org/es/docs/Web/HTTP/Status/401)

## Endpoints

- ### `/auth`

  - (**POST**) `/login`: Iniciar sesión

    Body:

    ```json
    {
      "email": "...",
      "password": "****"
    }
    ```

  - (**POST**) `/register`: Crear cuenta.

    Body:

    ```json
    {
      "username": "...",
      "email": "...",
      "password": "****"
    }
    ```

- ### `/users`

  - (**GET**) `/profile`: Obtener el perfil actual.
  - (**GET**) `/:id`: Obtiene el perfíl de un usuario (por id).
  - (**DELETE**) `/profile`: Elimina la cuenta actual.

- ### `/posts`

  - (**GET**) `/`: Obtiene todos los posts.

    > Esta ruta tiene paginación, debera de pasarle algúnos [parámetros de busqueda](https://en.wikipedia.org/wiki/Query_string).

    Representación en json:

    ```jsonc
    {
      "page": 1, // Indica cuál es la página.
      "limit": 10, // El límite de publicaciones por página.
      "userId": "...", // (Opcional) Filtra publicaciones de un usuario
    }
    ```

  - (**GET**) `/:id`: Obtiene una publicación por id.
  - (**GET**) `/:id/like`: Si es que se le dió like a la publicación.
  - (**POST**) `/:id/like`: Alterna el like a una publicación.
  - (**GET**) `/:id/comments`: Recupera los comentarios a una publicación.
  - (**POST**) `/:id/comments`: Crea un comentario.

    Body:

    ```json
    {
      "content": "..."
    }
    ```

  - (**POST**) `/`: Crea una publicación.

    Body:

    ```json
    {
      "content": "..."
    }
    ```

  - (**PATCH**) `/:id`: Edita la publicación.

    Body:

    ```json
    {
      "content": "..."
    }
    ```

  - (**DELETE**) `/:id`: Elimina la publicación.
