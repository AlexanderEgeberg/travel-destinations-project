# Travel Destinations

A school project: a CRUD app for saving travel destinations, with a Node/Express API backed by PostgreSQL and a vanilla HTML/CSS/TypeScript frontend.

## Screenshots

| Login | Homepage |
|---|---|
| ![Login](image-3.png) | ![Homepage](image.png) |

| Create destination | Edit destination |
|---|---|
| ![Create destination](image-1.png) | ![Edit destination](image-2.png) |

## Task description

**Backend**

- Save travel destinations in a database: title, date (from/to), description, location, country.
- Build with Node.js, exposing a REST API that sends JSON to the frontend.
- CRUD operations for travel destinations, following REST principles.
- Basic error handling, e.g. a destination can't be saved without a title.

| Requirement | Status |
|---|---|
| Create (title required) | ✅ |
| Read all | ✅ |
| Read one | ✅ |
| Update one | ✅ |
| Delete one (auth gated) | ✅ |
| Users have a 1-to-many relation to travel destinations | ✅ |

**Frontend**

Only standard HTML, CSS and JavaScript/TypeScript — no framework.

- A page for creating a new destination, with input fields for the data model and front-end validation.
- A list view showing all destinations.
- A page for viewing/updating an existing destination, using the same layout as creation but pre-filled.
- Login and signup pages and functionality.
- Delete, gated to authorized/logged-in users, with a confirmation dialog.
- The UI updates/syncs after deleting without a page refresh.
- Image upload for a destination, stored on the API and referenced from the database.

| Requirement | Status |
|---|---|
| List view of all destinations | ✅ |
| View existing destination (for updating) | ✅ |
| Create destination | ✅ |
| Update destination, pre-filled from existing data | ✅ |
| Login and signup | ✅ |
| Delete button only shown to authorized users | ✅ |
| Delete confirmation dialog | ❌ |
| UI updates after delete without a refresh | ✅ |

> `react-web/` is an unstarted bonus rewrite of the frontend using React instead of vanilla HTML/CSS/JS — not part of the graded submission below.

## How to run

The project has two parts you run separately: `api/` and `vanilla_web/`. You'll need [Node.js](https://nodejs.org/) and a running [PostgreSQL](https://www.postgresql.org/) (>= 15) server.

### 1. Database

```bash
cd api
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your own PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### 2. API

With yarn (default):

```bash
cd api
yarn install
yarn db      # creates the tables
yarn dev
```

With npm:

```bash
cd api
npm install
npm run db      # creates the tables
npm run dev
```

### 3. Frontend

With yarn (default):

```bash
cd vanilla_web
yarn install
yarn dev
```

With npm:

```bash
cd vanilla_web
npm install
npm run dev
```

Then open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).
