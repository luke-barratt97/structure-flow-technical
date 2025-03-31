# Structure Flow REST API

A RESTful API service for managing company data. Built with Express, TypeScript, MongoDB, and Redis.

## Features

- CRUD operations for company data
- MongoDB for persistent storage
- Redis caching for improved performance
- TypeScript for type safety
- Jest for testing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)
- Redis server

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true
   MONGO_DB_NAME=structure_flow
   REDIS_URL=redis://localhost:6379
   ```

## Usage

### Development

Run the API in development mode:

```
npm run dev
```

### Production

Build and start the API:

```
npm run build
npm start
```

### Testing

Run tests:

```
npm test
```

## API Endpoints

### Companies

| Method | Endpoint                        | Description          |
| ------ | ------------------------------- | -------------------- |
| POST   | `/structure-flow/companies`     | Create a new company |
| GET    | `/structure-flow/companies/:id` | Get a company by ID  |
| PATCH  | `/structure-flow/companies/:id` | Update a company     |
| DELETE | `/structure-flow/companies/:id` | Delete a company     |

### Data Model

Company schema:

```typescript
{
  name: string;
  dateIncorporated: string;
  description: string;
  totalEmployees: number;
  address: {
    street: string;
    city: string;
    postcode: string;
  }
}
```

## Author

Luke Barratt
