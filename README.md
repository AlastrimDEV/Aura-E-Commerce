# Aura E-Commerce

Aura is a full-stack clothing e-commerce application with a React/Vite frontend and an Express/MongoDB backend. It includes authentication with email OTP verification, product and order management, an admin dashboard, Cloudinary image uploads, and eSewa payment integration.

## Prerequisites

- Node.js 20.19 or newer
- npm
- A MongoDB database (local MongoDB or MongoDB Atlas)
- An SMTP account for registration OTP emails
- A Cloudinary account for product images
- An eSewa merchant/test account if payment features are required

## Project structure

```text
.
├── backend/    # Express API and MongoDB models
├── frontend/   # React/Vite client
└── package.json
```

## Setup

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd Aura-E-Commerce
   ```

2. Install dependencies for both applications:

   ```bash
   npm install
   ```

3. Create the backend environment file:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Fill in the values in `backend/.env`. At minimum, set `MONGO_URI` and `JWT_SECRET`. Configure the email, Cloudinary, and eSewa values when using those features.

4. Create the frontend environment file:

   ```bash
   cp frontend/.env.example frontend/.env
   ```

   Set `VITE_BACKEND_URL` to the backend URL, for example:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

   Never commit either `.env` file. They are ignored by Git because they contain secrets.

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | API port; defaults to `5000` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `FRONTEND_URL` | Frontend URL used for payment redirects, normally `http://localhost:5173` |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials used to send OTP emails |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `ESEWA_PRODUCT_CODE` / `ESEWA_SECRET_KEY` / `ESEWA_GATEWAY_URL` | eSewa payment configuration |

### Frontend (`frontend/.env`)

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Base URL of the running backend, normally `http://localhost:5000` |

## Run in development

Start both the backend and frontend from the project root:

```bash
npm run dev
```

Or run them separately in two terminals:

```bash
npm run dev:server
npm run dev:client
```

The API is available at `http://localhost:5000` and the Vite frontend is normally available at `http://localhost:5173`.

## Seed sample products

After configuring `backend/.env`, run:

```bash
cd backend
npm run seed
```

This deletes the existing products collection and inserts the sample catalog. Do not run it against a database whose products must be preserved.

## Production build

Build the frontend from the project root:

```bash
npm run build
```

To start only the backend without hot reloading:

```bash
cd backend
npm start
```

## Useful scripts

| Command | Description |
| --- | --- |
| `npm install` | Install backend and frontend dependencies |
| `npm run dev` | Run backend and frontend concurrently |
| `npm run dev:server` | Run the backend with Nodemon |
| `npm run dev:client` | Run the frontend with Vite |
| `npm run build` | Build the frontend for production |
| `cd backend && npm run seed` | Replace products with sample data |
| `cd frontend && npm run lint` | Run the frontend ESLint checks |