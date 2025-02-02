# event-management

# Advanced Event Management System

A full-stack web application for managing events, allowing users to view, create, edit, and delete events, with role-based access control and event registrations.

## Features

### Backend (Express.js)
- **Authentication**
  - `POST /auth/register` - Register a new user.
  - `POST /auth/login` - Authenticate and return a JWT.

- **Events Management**
  - `GET /events` - Fetch all events with optional filters (date, category, location) and pagination (5 per page).
  - `POST /events` - Create a new event (Admin only).
  - `PUT /events/:id` - Update an event by ID (Admin only).
  - `DELETE /events/:id` - Delete an event by ID (Admin only).

- **Event Registration**
  - `POST /events/:id/register` - Register for an event.
  - `GET /events/registrations` - List all registrations for the logged-in user.

### Frontend (React)
- **Pages**
  - **Home**: Displays a list of events with filters (date, category, location).
  - **Event Details**: Shows event details and allows user registration.
  - **Admin Dashboard**: Allows admins to manage events and view registrations.
  - **Login/Register**: Authentication pages.


## Tech Stack
- **Backend**: Node.js, Express.js, TypeScript, TypeORM, PostgreSQL
- **Frontend**: React, TypeScript, Context API, React Router
- **Database**: PostgreSQL (Hosted on Render)
- **Authentication**: JWT-based authentication
- **Deployment**: Render
