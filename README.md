
# Contract MGT API

## Overview

This project is a NestJS application with TypeORM for managing profiles, contracts, and jobs. It includes functionality for handling payments, deposits, and querying client and job data using appropriate transaction and row-locking mechanisms to handle race conditions and ensure data consistency. The application also provides API documentation through Swagger.


## Setup

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL 

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Ethical-Ralph/contract-mgt.git
   cd contract-mgt
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   PORT=3000
   DB_TYPE=postgres
   DB_HOST=<your-database-host>
   DB_PORT=<your-database-port>
   DB_USERNAME=<your-database-username>
   DB_PASSWORD=<your-database-password>
   DB_NAME=<your-database-name>
   ```

   Replace the placeholders with your actual database configuration values.

### Running the Application

1. **Start the Application**

   ```bash
   yarn start:dev
   ```

2. **Run Tests**

   To run unit and integration tests, use:

   ```bash
   yarn test
   ```

   To run tests with coverage:

   ```bash
   yarn test:cov
   ```

### Swagger Documentation

The API documentation is available at:

```
http://localhost:3000/api/docs
```

To access the Swagger documentation, you will need to authenticate using the following credentials:

- **Username:** shortlet
- **Password:** shortlet

This endpoint provides an interactive interface for exploring the API endpoints and their details.

### API Endpoints

- `GET /contracts/:id` - Retrieve a specific contract associated with the profile making the request.
- `GET /contracts` - List active contracts associated with a user.
- `GET /jobs/unpaid` - Get all unpaid jobs for a user within active contracts.
- `POST /jobs/:job_id/pay` - Pay for a job, transferring funds from the client’s balance to the contractor’s balance.
- `POST /balances/deposit/:userId` - Deposit money into a client’s balance, with constraints on the deposit amount.
- `GET /admin/best-profession?start=<date>&end=<date>` - Get the profession that earned the most money within the specified date range.
- `GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>` - Get the top clients who paid the most within the specified period.

### Authentication

All endpoints require Bearer authentication. To authenticate a request, include the `Authorization` header with the format:

```
Authorization: Bearer <profileID>
```

Replace `<profileID>` with the actual ID of the profile making the request.
