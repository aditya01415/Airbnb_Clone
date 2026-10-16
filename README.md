# 🏡 Wanderlust (Airbnb Clone)

A full-stack web application inspired by Airbnb, built with **Node.js**, **Express**, **MongoDB**, and **EJS**. Wanderlust lets users explore unique accommodations around the world, host their own spaces with image uploads, leave reviews, and filter listings by category and location.

---

## ✨ Features

- **🏠 Listings Management (CRUD)**: Create, view, update, and delete property listings with detailed descriptions, pricing, and location data.
- **📸 Cloud Image Uploads**: Integrated with **Cloudinary** via `multer` and `multer-storage-cloudinary` for reliable media storage.
- **🏷️ Category Filtering**: Filter stays by categories such as *Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic, Boats,* and *Domes*.
- **🔍 Search Functionality**: Search listings dynamically by destination, title, country, or keywords.
- **🗺️ Geolocation & Map Support**: Stores GeoJSON coordinate points for listing locations with fallback support for interactive maps.
- **🔐 User Authentication & Authorization**:
  - Secure registration, login, and logout powered by **Passport.js** and **passport-local-mongoose**.
  - Strict authorization: Only the listing creator can edit/delete their listing; only review authors can delete their reviews.
- **⭐ Reviews & Ratings**: Authenticated users can leave 1–5 star reviews and feedback on stays.
- **🛡️ Server-Side Validation & Error Handling**: Robust request validation powered by **Joi** schemas and custom asynchronous error handlers.
- **🔔 Flash Notifications**: User-friendly flash alerts for actions (e.g., successful listing creation, login, errors).

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend / Templating**: EJS, EJS-Mate (boilerplate layouts), Bootstrap 5, Font Awesome
- **Database**: MongoDB, Mongoose ODM (supports local MongoDB and MongoDB Atlas)
- **Media Hosting**: Cloudinary
- **Authentication**: Passport.js, Passport-Local, Express-Session, Connect-Flash
- **Schema Validation**: Joi

---

## 📁 Project Structure

```text
Airbnb Clone/
├── .envSample             # Template for required environment variables
├── .gitignore              # Files and folders excluded from git tracking
├── app.js                  # Main server entry point and Express configuration
├── cloudConfig.js          # Cloudinary and Multer storage setup
├── package.json            # Project dependencies and npm scripts
├── schema.js               # Joi validation schemas for listings and reviews
├── middleware.js           # Auth & authorization middlewares
├── controllers/            # Route controllers (MVC architecture)
│   ├── listing.js          # Listing logic
│   ├── reviews.js          # Review logic
│   └── users.js            # User authentication logic
├── models/                 # Mongoose schemas & data models
│   ├── listing.js          # Listing schema with GeoJSON and category support
│   ├── review.js           # Review schema
│   └── user.js             # User schema with passport-local-mongoose
├── routes/                 # Express route definitions
│   ├── listing.js          # /listings routes
│   ├── review.js           # /listings/:id/reviews routes
│   └── user.js             # /signup, /login, /logout routes
├── views/                  # EJS template views
│   ├── layouts/            # Base boilerplate layout
│   ├── includes/           # Partials (navbar, footer, flash alerts)
│   ├── listing/            # Listing pages (index, show, new, edit)
│   └── users/              # Authentication pages (login, signup)
├── public/                 # Static assets (custom CSS, JS)
├── init/                   # Database seeding utility
│   ├── data.js             # 29+ realistic sample listings
│   └── index.js            # Database population script
└── utils/                  # Utility helpers (ExpressError, wrapAsync)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local community edition or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- A free [Cloudinary](https://cloudinary.com/) account for image uploads

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Airbnb Clone"
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file from the provided `.envSample` template:
   ```bash
   cp .envSample .env
   ```
   Fill in your own credentials in `.env`:
   ```env
   CLOUD_NAME=
   CLOUD_API_KEY=
   CLOUD_API_SECRET=
   ATLASDB_URL=
   SECRET=
   PORT=8080
   ```

4. **Seed the Database with Sample Listings:**
   Initialize the database with pre-configured sample stays:
   ```bash
   node init/index.js
   ```

5. **Start the Application:**
   ```bash
   npm start
   ```
   Or run in development mode with nodemon:
   ```bash
   npx nodemon app.js
   ```

6. **Open in Browser:**
   Navigate to [http://localhost:8080](http://localhost:8080) to explore Wanderlust!

---

## 🔑 Environment Variables

Refer to `.envSample` for the required configuration variables:

| Variable | Description |
| :--- | :--- |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API Key |
| `CLOUD_API_SECRET` | Cloudinary API Secret |
| `ATLASDB_URL` | MongoDB connection URI (MongoDB Atlas or local instance) |
| `SECRET` | Session encryption secret key |
| `PORT` | Application server port (default: `8080`) |

---

## 🌐 Routes Overview

### Listings (`/listings`)
- `GET /listings` — View all listings (supports `?category=` and `?search=` filters)
- `GET /listings/new` — Form to create a new listing (login required)
- `POST /listings` — Submit and upload a new listing with image (login required)
- `GET /listings/:id` — View details, map, and reviews for a listing
- `GET /listings/:id/edit` — Form to edit a listing (owner only)
- `PUT /listings/:id` — Update listing details and/or image (owner only)
- `DELETE /listings/:id` — Delete a listing and associated reviews (owner only)

### Reviews (`/listings/:id/reviews`)
- `POST /listings/:id/reviews` — Add a review with rating and comment (login required)
- `DELETE /listings/:id/reviews/:reviewId` — Remove a review (review author only)

### Authentication (`/`)
- `GET /signup` & `POST /signup` — Register a new account
- `GET /login` & `POST /login` — Log in to an existing account
- `GET /logout` — Log out current user session

---

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
