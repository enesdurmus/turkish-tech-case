# Transportation Route Finder

A full-stack application for finding optimal transportation routes between cities. Users can search for routes combining flights, buses, and trains with up to 3 transfers.

## Features

- Multi-city route search with up to 3 transfers
- Prioritizes routes containing at least one flight segment
- Complete CRUD operations for locations and transportation management
- Redis-based caching for improved performance
- Graph-based pathfinding algorithm
- Responsive web interface

## Tech Stack

### Backend
- **Java 24** - Latest LTS with modern features
- **Spring Boot 4.0.1** - Application framework
- **PostgreSQL 16** - Primary database
- **Redis 7** - Distributed caching layer
- **Liquibase** - Database version control
- **MapStruct** - Object mapping
- **SpringDoc OpenAPI** - API documentation

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Material-UI v7** - Component library
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Infrastructure
- **Docker & Docker Compose** - Container orchestration
- **Maven** - Build automation

## Requirements

- Docker and Docker Compose
- Java 24 (for local development)
- Node.js 20+ (for frontend development)
- Maven 3.9+ (for local development)

## Quick Start

### Running with Docker

Start PostgreSQL and Redis:

```bash
docker-compose up -d
```

Run the backend:

```bash
mvn spring-boot:run
```

Services will be available at:
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6379

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at http://localhost:5173

## Architecture

### Route Finding Algorithm

The application uses a graph-based DFS (Depth-First Search) algorithm where cities are nodes and transportation connections are edges. Key features:

- Maximum 3 transfers allowed
- Prevents circular routes (no city visited twice)
- Filters routes to include at least one flight segment
- Considers only transportations operating on the search date

### Database Schema

Version-controlled schema management using Liquibase:

- **locations**: Airports, bus stations, train terminals
- **transportations**: Inter-city transportation connections
- **transportation_operating_days**: Weekly operation schedule (normalized)

### Async Processing

Location data is fetched in parallel during route searches using CompletableFuture. Thread pool management handled by ExecutorService.

## Testing

Postman collection included: `turkish-tech-case.postman_collection.json`

## Useful Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f              # All services
docker-compose logs -f backend      # Backend only
docker-compose logs -f frontend     # Frontend only

# Rebuild images
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v

# Check service status
docker-compose ps

# Connect to PostgreSQL
docker exec -it case-postgres psql -U case_user -d case_db

# Connect to Redis
docker exec -it case-redis redis-cli
```