<p align="center">
  <img src="/docs/logo.svg" width="180" alt="QueTeRegalo Logo" />
</p>

# QueTeRegalo - API

Backend de QueTeRegalo, un buscador de regalos: cada usuario rellena un perfil con sus gustos y tallas, para que sus amigos sepan fácilmente qué regalarle.

Este repositorio es la migración del backend original (Node.js + Express) a **NestJS**, como proyecto de portfolio.


<p align="center"> 
 <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

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