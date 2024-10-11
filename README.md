# Backend Setup Guide

This guide provides instructions to set up and deploy the backend application. Follow the steps below to get the application running locally or in your environment.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) and npm
- [Supabase](https://supabase.com/) account

## Setup Instructions

### 1. Clone the Repository

Clone the backend repository to your local machine:

```bash
git clone https://github.com/yyongjiann/nest-supabase-backend.git
cd your-backend-repo
```

### 2. Install Dependencies

Run the following command to install the required npm packages and automatically set up the Supabase storage bucket:

```bash
npm install
```

### 3. Set Up Environment Variables

- Copy the example environment file to create your `.env` file:

```bash
cp .env.example .env
```

- Fill in the necessary environment variables in the `.env` file:

  - `SUPABASE_URL`: Provided in .env.example
  - `SUPABASE_KEY`: Provided in .env.example
  - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key. This is only necessary if you wish to create your own instance of the database and storage using the scripts provided.
  - `DATABASE_URL`: The URL of your PostgreSQL database.
    Format: "postgres://root:password@hostaddress:6543/postgres?pgbouncer=true"
  - `DIRECT_URL`: The direct URL of your PostgreSQL database. Format: DIRECT_URL="postgres://root:password@hostaddress:5432/postgres"
  - `JWT_SECRET`: Your JWT secret for authentication.

### 4. Locating Environment Variables for Supabase

To find the `DATABASE_URL` and `DIRECT_URL` for your Supabase database:

    1. Log in to the Supabase dashboard.
    2. Navigate to Project Settings.
    3. Under the Configuration section, go to Database.
    4. Look for the Connection String section.
    5. Transaction URL corresponds to DATABASE_URL. Add "?pgbouncer=true" at the end of the string.
    6. Session URL corresponds to DIRECT_URL.

Refer to https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#external-connection-poolers for more information on `DATABASE_URL`, `DIRECT_URL`, and PgBouncer.

**Optional:** To find the `SUPABASE_URL`, `SUPABASE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` for your Supabase database:

    1. Log in to the Supabase Dashboard (https://app.supabase.io/)
    2. Create a New Project.
    3. Navigate to Project Settings.
    4. Under the Configuration section, go to API.
    5. SUPABASE_URL is listed under the Project URL section. This is your project’s unique API endpoint.
    6. SUPABASE_KEY (anon key) is found under the Project API Keys section. This key is for accessing public endpoints and limited database operations.
    7. SUPABASE_SERVICE_ROLE_KEY (service_role key) is found under the Project API Keys section. This key has elevated permissions (bypass Row-Level Security).

Do note that you will only need to change to your own `SUPABASE_URL`, `SUPABASE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` if you wish to create a local instance of the database for covered linkways and the Supabase Storage for route images.

### 5. Run Database Migrations

Set up the database schema for users and runs using Prisma by running:

```bash
npm run migrate
```

This command will deploy all migrations and set up your database schema automatically.

### 6. Build and Run the Server

#### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run start:dev
```

#### Production Mode

To run the application in production mode:

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start:prod
```

### 7. Optional: Additional Setup

**NOTE:** The environmental variables `SUPABASE_URL`, `SUPABASE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` need to be set up first.

If you need to manually set up the Supabase storage:

```bash
npx ts-node scripts/setup-storage.ts
```

If you need to manually set up the Supabase database for covered linkways and load its geojson data into the database:

```bash
npx ts-node scripts/setup-database.ts
npx ts-node scripts/load-geojson.ts data/covered-linkway.geojson
```

### 8. Updating the Application

When making changes that require database updates:

**Create a migration**:

```bash
npx prisma migrate dev --name your-migration-name
```

## Directory Structure

Below is an overview of the key files and directories:

```
your-backend-repo/
├── data/
│    └── covered-linkway.geojson    # Covered Linkway dataset in geojson format
│
├── prisma/
│   ├── schema.prisma               # Prisma schema file
│   └── migrations/                 # Prisma migrations
│
├── scripts/
│   ├── setup-storage.ts            # Script to set up Supabase storage for route images
│   ├── setup-database.ts           # Script to set up Supabase database for covered linkway
│   └── load-geojson.ts             # Script to load the geojson data for covered linkway
│
├── src/
│   ├── main.ts                     # Entry point for the application
│   └── ...                         # Other application modules and files
│
├── .env.example                    # Example environment file
├── package.json                    # npm scripts and dependencies
└── README.md                       # Project setup guide
```

## Dataset

Covered Linkway dataset source: https://datamall.lta.gov.sg/content/datamall/en/static-data.html

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
