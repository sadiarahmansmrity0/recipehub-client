# 🍳 RecipeHub - Recipe Sharing Platform

A full-featured recipe sharing platform where food enthusiasts can create, share, discover, and manage recipes. Built with Next.js, Node.js, MongoDB, and Stripe.

## 🌐 Live Demo

https://recipehub-client-git-main-sadiarahmansmrity0s-projects.vercel.app/



## ✨ Features

### 🔐 Authentication
- User Registration with Name, Email, Image URL, Password
- User Login with Email/Password
- Google OAuth Login
- JWT Authentication with HTTPOnly Cookies
- Password Hashing with bcrypt
- Protected Routes & APIs

### 👤 User Features
- **Dashboard Overview**: View total recipes, favorites, and likes
- **Recipe Management**: Create, Edit, Delete, View recipes
- **Favorites**: Save and manage favorite recipes
- **Likes**: Like/unlike recipes
- **Profile**: Update name and profile image
- **Recipe Limit**: Free users limited to 2 recipes

### 💎 Premium Features
- Unlimited recipe uploads
- Premium profile badge
- Purchase premium recipes
- Stripe Checkout integration

### 🔧 Admin Features
- **Dashboard**: Platform statistics overview
- **User Management**: View, Block, Unblock users
- **Recipe Management**: Feature/Unfeature, Delete recipes
- **Report Management**: View, Resolve, Dismiss reports
- **Transactions**: View all payments

### 🎨 UI/UX
- Fully responsive design
- Dark/Light Theme Toggle
- Framer Motion animations
- Professional UI with Tailwind CSS
- Loading states & error handling

## 🛠️ Technologies Used

### Frontend
| Technology | Description |
|------------|-------------|
| Next.js 14 | React framework with App Router |
| Tailwind CSS | Utility-first CSS framework |
| Framer Motion | Animation library |
| Axios | HTTP client |
| React Icons | Icon library |
| Stripe.js | Payment processing |

### Backend
| Technology | Description |
|------------|-------------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcrypt | Password hashing |
| Stripe | Payment processing |

### Database Collections
- `users` - User accounts
- `recipes` - Recipe data
- `favorites` - User favorites
- `reports` - Recipe reports
- `payments` - Transaction records

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Stripe account
- Google Cloud Console account (for Google Login)

### Environment Variables

**Server (.env)**
```env
# Database
DB_URI=mongodb+srv://...

# Security
JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Environment
NODE_ENV=development
CLIENT_URL=http://localhost:3000

##Run Locally
# Clone repository
git clone https://github.com/yourusername/recipehub.git
cd recipehub

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start server (from server folder)
npm run dev

# Start client (from client folder - new terminal)
npm run dev

# Start Stripe webhook (new terminal)
stripe listen --forward-to http://localhost:5000/api/payment/webhook

# Visit http://localhost:3000



