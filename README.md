# Local Services Worker Search Backend

A Node.js + Express backend for searching workers in a local services web app using Supabase PostgreSQL.

## Database Tables

Create these tables in your Supabase project:

### register_worker
- id: uuid primary key
- name: text
- email: text
- phone: text
- profession: text
- locality: text
- is_available: boolean
- created_at: timestamp

### services (optional)
- id: uuid
- service_name: text

### localities (optional)
- id: uuid
- locality_name: text

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env`:
   - SUPABASE_URL: Your Supabase project URL
   - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key

3. Start the server:
   ```
   npm start
   ```

## API Endpoints

- `GET /services`: Get all services for dropdown
- `GET /localities`: Get all localities for dropdown
- `POST /search-workers`: Search workers
  - Body: `{ "service": "Plumber", "locality": "Kochi", "availableOnly": true }`
  - Returns: Array of workers with name, phone, profession, locality, is_available

## Folder Structure

```
.
├── server.js              # Express server with search routes
├── package.json           # Dependencies
├── .env                   # Environment variables
└── README.md              # This file
```

## Usage

The frontend (homepage.html with search bar and dropdowns) can make requests to these endpoints to populate dropdowns and search for workers.