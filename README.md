Movies Search System:
=====================
A full-stack application to sync and search movies from the OMDB API,
built with a Node.js/Express backend, React frontend, PostgreSQL, and Elasticsearch,
all containerized with Docker Compose.

## Features

### Start with Docker Compose:
- Run `docker-compose up --build` to start the application.

### Access
- The frontend is available at `http://localhost:3000`.
- The backend is available at `http://localhost:3001`.

### Architecture Diagram

+----------------+       +----------------+       +----------------+
|    Frontend    | <---> |    Backend     | <---> |   PostgreSQL   |
| (React/Nginx)  |       | (Node.js/Expr) |       |   (Database)   |
|  localhost:3001|       | localhost:3000 |       +----------------+
+----------------+       |                |       +----------------+
                         |                |       |  Elasticsearch |
                         |                | <---> |   (Search)     |
                         |                |       | localhost:9200 |
                         +----------------+       +----------------+