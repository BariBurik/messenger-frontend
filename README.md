# Real-Time Messenger — Frontend

Frontend application for a full-stack real-time messenger built with **React** and **TypeScript**.

The application provides user authentication, chat management and real-time messaging through a GraphQL API and WebSocket subscriptions.

The backend is available in a separate repository:

**[messenger-backend](https://github.com/BariBurik/messenger-backend)**

## Features

* User registration and authentication
* User profile editing
* User avatar upload
* User search
* Chat creation and management
* Adding participants to chats
* Chat avatar upload
* Chat search
* Sending messages
* Editing messages
* Deleting messages
* Message history loading
* Real-time message updates
* Real-time chat creation, update and deletion events
* Desktop and mobile interfaces

## Tech Stack

### Core

* React 18
* TypeScript
* React Router

### State & Data

* Redux Toolkit
* RTK Query
* TanStack React Query
* Apollo Client

### API

* GraphQL
* Graphene GraphQL API
* Strawberry GraphQL API
* GraphQL WebSocket subscriptions
* Axios

### Styling & Build

* SCSS / Sass
* Webpack
* TypeScript loader
* CSS / Sass loaders
* SVGR

## Architecture

The source code is separated into application responsibilities:

```text
src/
├── API/             # GraphQL clients, queries, mutations and subscriptions
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Desktop and mobile application pages
├── router/          # Application routing
├── services/        # Shared application services
├── store/           # Global state configuration
├── types/           # TypeScript types and interfaces
└── index.tsx        # Application entry point
```

The application communicates with the backend through separate GraphQL endpoints and uses WebSocket subscriptions for real-time events.

## Backend

The frontend requires the backend part of the project:

[messenger-backend](https://github.com/BariBurik/messenger-backend)

Follow the backend repository instructions to configure PostgreSQL, apply Django migrations and start the backend server.

By default, the frontend expects the backend to be available at:

```text
http://localhost:8000/
```

GraphQL endpoints used by the application:

```text
http://localhost:8000/graphql/graphene/
http://localhost:8000/graphql/strawberry/
```

WebSocket subscriptions:

```text
ws://localhost:8000/graphql/subscription/
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/BariBurik/Messenger_Fullstack_Frontend.git
cd Messenger_Fullstack_Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend

Make sure the Messenger backend and PostgreSQL database are running before starting the frontend.

### 4. Start the development server

```bash
npm start
```

By default, the development server runs on:

```text
http://localhost:3000/
```

## Production Build

Create a production build:

```bash
npm run build:prod
```

Run the generated production build locally:

```bash
npm run start:prod
```

## Available Scripts

### Development

```bash
npm start
```

Starts the Webpack development server.

### Development Build

```bash
npm run build:dev
```

Creates a development build.

### Production Build

```bash
npm run build:prod
```

Creates an optimized production build.

### Serve Production Build

```bash
npm run start:prod
```

Serves the generated application from the `build` directory.

## Real-Time Communication

The application uses GraphQL subscriptions over WebSocket connections for real-time updates.

Subscriptions are used for events such as:

* receiving new messages;
* creation of new chats;
* chat updates;
* chat deletion.

HTTP GraphQL requests are handled separately from WebSocket subscription traffic.

## Related Repository

### Backend

Django / PostgreSQL backend:

**[Messenger Fullstack Backend](https://github.com/BariBurik/Messenger_Fullstack_Backend)**

## About

Personal full-stack portfolio project demonstrating the development of a React/TypeScript client, GraphQL API integration, application state management and real-time communication with a separate Django backend.
