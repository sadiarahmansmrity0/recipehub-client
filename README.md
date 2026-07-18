# 🍽️ RecipeHub – Recipe Sharing Platform

RecipeHub is a full-stack recipe sharing platform where users can create, discover, purchase, and manage recipes. The platform provides premium membership, recipe favorites, reporting system, Stripe payment integration, and an admin dashboard for managing users and recipes.

## 🌐 Live Website

**Live Site:** https://recipehub-client-delta.vercel.app

## 🔗 Server Repository

https://github.com/sadiarahmansmrity0/recipehub-server

## 🔗 Client Repository

https://github.com/sadiarahmansmrity0/recipehub-client

---

# ✨ Features

### 🔐 Authentication

- Email & Password Login
- Google Login
- JWT Authentication
- HTTPOnly Cookie Authentication
- Protected Routes
- Persistent Login After Refresh

---

### 👨‍🍳 User Features

- Register & Login
- Update Profile
- Add Recipe
- Edit Recipe
- Delete Recipe
- Browse All Recipes
- View Recipe Details
- Like Recipes
- Favorite Recipes
- Report Recipes
- Purchase Recipes
- View Purchased Recipes
- Premium Membership
- Dark / Light Theme

---

### ⭐ Premium Features

- Premium Badge
- Unlimited Recipe Upload
- Stripe Payment Integration

---

### 👑 Admin Features

- Dashboard Statistics
- Manage Users
- Block / Unblock Users
- Manage Recipes
- Edit Recipes
- Delete Recipes
- Feature Recipes
- View Reports
- Remove Reported Recipes
- Dismiss Reports
- View Transactions

---

## 📄 Pages

### Public

- Home
- Browse Recipes
- Recipe Details
- Login
- Register

### Protected

- Dashboard
- My Recipes
- Add Recipe
- Favorites
- Purchased Recipes
- Profile

### Admin

- Dashboard Overview
- Manage Users
- Manage Recipes
- Reports

---

# 🚀 Technologies Used

## Frontend

- Next.js 16
- React 19
- Tailwind CSS
- Framer Motion
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- JWT
- Better Auth
- Stripe
- ImgBB API

---

# 📦 NPM Packages

## Client

- next
- react
- react-dom
- tailwindcss
- framer-motion
- lucide-react
- better-auth
- @stripe/stripe-js

## Server

- express
- mongodb
- jsonwebtoken
- bcryptjs
- dotenv
- cors
- cookie-parser
- stripe
- better-auth

---

# 📂 Database Collections

## users

- name
- email
- image
- role
- isBlocked
- isPremium
- createdAt
- updatedAt

---

## recipes

- recipeName
- recipeImage
- category
- cuisineType
- difficultyLevel
- preparationTime
- ingredients
- instructions
- authorId
- authorName
- authorEmail
- likesCount
- isFeatured
- status
- createdAt
- updatedAt

---

## favorites

- userEmail
- userId
- recipeId
- addedAt

---

## reports

- recipeId
- reporterEmail
- reason
- status
- createdAt

---

## payments

- userEmail
- userId
- amount
- recipeId
- transactionId
- paymentStatus
- paidAt

---

# 🔒 Environment Variables

## Client

```env
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Server

```env
PORT=
DB_NAME=
MONGODB_URI=
JWT_SECRET=

CLIENT_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_SECRET_KEY=
IMGBB_API_KEY=
```

---

# 📸 Main Functionalities

- Responsive Design
- Recipe Image Upload (ImgBB)
- Featured Recipes
- Popular Recipes
- Category Filtering
- Server-side Pagination
- Recipe Likes
- Favorites
- Reports
- Stripe Checkout
- Premium Membership
- Admin Dashboard
- JWT Authentication
- Protected APIs
- Dark & Light Mode
- Framer Motion Animation
- Custom 404 Page

---

# 🛠️ Installation

Clone the repositories

```bash
git clone https://github.com/sadiarahmansmrity0/recipehub-client
git clone https://github.com/sadiarahmansmrity0/recipehub-server
```

Install dependencies

```bash
npm install
```

Run Client

```bash
npm run dev
```

Run Server

```bash
npm run dev
```

---

# 📁 Folder Structure

```
src/
│
├── app/
├── components/
├── context/
├── hooks/
├── lib/
├── utils/
├── services/
└── styles/
```

---

# 🎯 Assignment Features Implemented

- ✅ Authentication
- ✅ Google Login
- ✅ JWT Authentication
- ✅ HTTPOnly Cookie
- ✅ Recipe CRUD
- ✅ Premium Membership
- ✅ Stripe Payment
- ✅ ImgBB Upload
- ✅ Recipe Favorites
- ✅ Recipe Reports
- ✅ Admin Dashboard
- ✅ User Dashboard
- ✅ Protected Routes
- ✅ Dark/Light Theme
- ✅ Pagination
- ✅ MongoDB $in Filtering
- ✅ Framer Motion Animation
- ✅ Responsive UI
- ✅ Custom 404 Page

---

# 👩‍💻 Developed By

**Sadia Rahman Smrity**

Department of Computer Science & Engineering

Metropolitan University, Sylhet

---

## 📜 License

This project was developed as an assignment for the Web Development Course.