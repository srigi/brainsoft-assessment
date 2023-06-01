# Igor Hlina assessment - Pokémon fullstack webapp

This project represents my solution for home task - a small [Pokedex](https://www.pokemon.com/us/pokedex) clone written in Typescript & React.

![screenshot of my solution](https://i.postimg.cc/DzDrX1ZZ/Screenshot-2023-06-01-at-20-21-34.png)


## Requirements

You will need a unix machine with:
- Node.js v20
- corepack
- PostgreSQL v9+, use [Postgres.app](https://postgresapp.com/) for minimalistic & effortless installation

This project is a monorepo with Yarn Berry workspaces, see [yarn getting started guide](https://yarnpkg.com/getting-started/install).

# Getting started

1. clone the repository
2. copy [.env (example)](.env%20(example)) into `.env`<br />
   Change values in ENV file as needed.
3. no need to install dependencies,<br />
   This project is using [yarn's zero install](https://yarnpkg.com/features/zero-installs) topology.
4. migrate your database
    ```shell
   yarn api db:migrations:push
   ```
5. seed database with data
    ```shell
   yarn api db:seed
   ```
6. start the API server
    ```shell
   yarn api dev
   ```
   By default, the API server starts at `127.0.0.1:3000` and `[::1]:3000`.<br />
   feel free to explore the GraphQL API at http://localhost:3000/graphiql
7. link API & frontend
   ```shell
   yarn
   ```
8. start the React frontend
   ```shell
   yarn web dev
   ```
   By default, the frontend starts at `127.0.0.1:8000`. Navigate your browser to  http://localhost:8000
