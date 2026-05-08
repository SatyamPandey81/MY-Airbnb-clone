# WanderLust - Airbnb Clone

WanderLust is a simple Airbnb-inspired web application that I built while learning full-stack web development.  
This is one of my first major backend projects where I worked with authentication, databases, CRUD operations, routing, and server-side validation.

Users can explore property listings, create their own listings, edit them, and also add reviews.

---

## Features

- User Authentication & Authorization
- Create, Edit & Delete Listings
- Add Reviews & Ratings
- Flash Messages
- Responsive UI
- MongoDB Database Integration
- RESTful Routing
- Server-side Validation

---

## Tech Stack

### Frontend
- HTML
- CSS
- Bootstrap
- EJS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- Passport.js
- Express Session

---

## Folder Structure

```bash
project-root/
│
├── models/
├── routes/
├── views/
├── public/
├── controllers/
├── utils/
├── app.js
├── package.json
├── README.md
└── .gitignore
```

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/wanderlust-airbnb-clone.git
```

### Move into the Project Folder

```bash
cd wanderlust-airbnb-clone
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory and add:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_secret_key
```

---

## Run the Project

Start the server:

```bash
npm start
```

OR

```bash
nodemon app.js
```

After starting the server, open:

```bash
http://localhost:8080/listings
```

(Use the port according to your project configuration.)

---

## What I Learned

While building this project, I learned:

- Authentication & Authorization
- CRUD Operations
- MongoDB Integration
- MVC Architecture
- REST APIs
- Express Middleware
- Backend Validation
- Full Stack Development Workflow

---

## Future Improvements

- Booking System
- Search & Filters
- Map Integration
- Payment Integration
- Cloudinary Image Upload

---

## Author

Satyam Pandey

---

## Note

This project was built for learning and practice purposes while exploring backend and full-stack development.