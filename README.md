<p align="center">
  <img src="/docs/logo.svg" width="180" alt="QueTeRegalo Logo" />
</p>

# QueTeRegalo - API

Backend de QueTeRegalo, un buscador de regalos: cada usuario rellena un perfil con sus gustos y tallas, para que sus amigos sepan fácilmente qué regalarle.

Este repositorio es la migración del backend original (Node.js + Express) a **NestJS**, como proyecto de portfolio.


<p align="center"> 
 <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Stack

- NestJS + TypeScript
- PostgreSQL + TypeORM
- Autenticación con JWT
- Docker (base de datos)

## Módulos

- **Auth**: registro y login de usuarios
- **Profile**: perfil público del usuario (tallas, gustos), con búsqueda por nombre
- **Categories**: categorías de regalos
- **Presents**: regalos creados por cada usuario, filtrables por usuario

## Como levantarlo

1. Clonar el Proyecto

2.  ```
    npm install
    ```

3. Clonar el archivo ```.env.template``` y reenombralo a ```.env```

4. Cambiar las variables de entorno

5. Levantar la base de datos
    ````
    docker-compose up -d
    ````

6. Levantar : 
    ```
    npm run start:dev 
    ```