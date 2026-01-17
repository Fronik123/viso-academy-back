# Viso Academy Backend

A NestJS-based REST API for managing time entries. This application allows you to track time spent on different projects with validation to ensure time entries don't exceed 24 hours per day.

## Features

- **Time Entry Management**: Create and retrieve time entries with project, date, hours, and description
- **Daily Hour Validation**: Automatically validates that total hours per day don't exceed 24 hours
- **Grouped Results**: Time entries are grouped by date with daily totals and a grand total
- **Data Validation**: Input validation using class-validator decorators
- **CORS Enabled**: Configured to work with frontend applications

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Database**: SQLite with [Prisma](https://www.prisma.io/) ORM
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd viso-academy-back
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

The application will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

### Production Mode
```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## API Endpoints

### Create Time Entry
**POST** `/time-entries`

Creates a new time entry. Validates that the total hours for the specified date don't exceed 24 hours.

**Request Body:**
```json
{
  "date": "2024-01-17T00:00:00.000Z",
  "project": "Project Name",
  "hours": 8.5,
  "description": "Work description"
}
```

**Validation Rules:**
- `date`: Required, must be a valid date string
- `project`: Required, must be a non-empty string
- `hours`: Required, must be a positive number, maximum 24
- `description`: Required, must be a non-empty string

**Response:**
```json
{
  "id": 1,
  "date": "2024-01-17T00:00:00.000Z",
  "project": "Project Name",
  "hours": 8.5,
  "description": "Work description",
  "createdAt": "2024-01-17T10:00:00.000Z",
  "updatedAt": "2024-01-17T10:00:00.000Z"
}
```

**Error Response (if hours exceed 24 per day):**
```json
{
  "statusCode": 400,
  "message": "Total hours for this date cannot exceed 24. Current total: 16.00 hours, trying to add: 10.00 hours."
}
```

### Get All Time Entries
**GET** `/time-entries`

Retrieves all time entries grouped by date, sorted by date in descending order.

**Response:**
```json
{
  "grouped": [
    {
      "date": "2024-01-17",
      "entries": [
        {
          "id": 1,
          "date": "2024-01-17T00:00:00.000Z",
          "project": "Project A",
          "hours": 8,
          "description": "Morning work",
          "createdAt": "2024-01-17T10:00:00.000Z",
          "updatedAt": "2024-01-17T10:00:00.000Z"
        },
        {
          "id": 2,
          "date": "2024-01-17T00:00:00.000Z",
          "project": "Project B",
          "hours": 4,
          "description": "Afternoon work",
          "createdAt": "2024-01-17T14:00:00.000Z",
          "updatedAt": "2024-01-17T14:00:00.000Z"
        }
      ],
      "totalHours": 12
    }
  ],
  "grandTotal": 12
}
```

## Project Structure

```
src/
├── main.ts                
├── app.module.ts           
├── app.controller.ts       
├── app.service.ts          
├── prisma/
│   ├── prisma.module.ts    
│   └── prisma.service.ts   
└── time-entries/
    ├── time-entry.module.ts
    ├── time-entry.controller.ts
    ├── time-entry.service.ts
    └── dto/
        └── create-time-entry.dto.ts

prisma/
├── schema.prisma          
└── migrations/           
```

## Database Schema

The `TimeEntry` model includes:
- `id`: Auto-incrementing integer primary key
- `date`: DateTime for the entry date
- `project`: String for project name
- `hours`: Float for hours worked
- `description`: String for work description
- `createdAt`: DateTime (auto-generated)
- `updatedAt`: DateTime (auto-updated)


The application uses the following environment variables:

- `PORT` - Server port (default: 3000)

Create a `.env` file in the root directory to set environment variables:

```env
PORT=3000
```

## CORS Configuration

The application is configured to accept requests from `http://localhost:3001`. To change this, modify the CORS configuration in `src/main.ts`.

