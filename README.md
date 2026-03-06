# 🎮 Game Store

A full-stack web application for browsing, purchasing, and managing video games. The platform features a modern storefront UI with admin management capabilities, user authentication, shopping cart, order processing, and review system.

---

## ✨ Features

### 🛒 Customer Features
- **Browse Games** — View all available games with category filtering
- **Search** — Find games quickly with search functionality
- **Product Details** — View detailed game info with image galleries
- **Shopping Cart** — Add/remove games and manage quantities
- **Order Placement** — Place and track orders
- **Reviews** — Submit reviews for purchased games
- **User Accounts** — Register, login, and manage your profile

### 🔧 Admin Features
- **Game Management** — Add, update, and delete games (with image uploads)
- **Category Management** — Create and organize game categories
- **Order Management** — View and update order statuses
- **Access Control** — Modify admin privileges for users

---

## 🛠️ Tech Stack

| Layer        | Technology                                                  |
|--------------|-------------------------------------------------------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Material UI (MUI)            |
| **Backend**  | Node.js, Express.js                                         |
| **Database** | Microsoft SQL Server (MSSQL)                                |
| **Auth**     | JSON Web Tokens (JWT), bcrypt.js                            |
| **Maps**     | Leaflet / React-Leaflet                                     |
| **Security** | Helmet, CORS, XSS-Clean, Express Rate Limiter              |
| **Other**    | Axios, Multer (file uploads), Sharp (image processing)      |

---

## 📁 Project Structure

```
Game-Store/
├── BackEnd/
│   ├── app.js                 # Express server entry point
│   ├── controllers/
│   │   ├── auth.js            # Registration & login logic
│   │   ├── no-auth.js         # Public endpoints (browse games)
│   │   └── req-auth.js        # Protected endpoints (cart, orders, admin)
│   ├── db/
│   │   └── dbconfig.js        # MSSQL connection configuration
│   ├── middleware/
│   │   ├── route-auth.js      # JWT authentication middleware
│   │   └── error-handler.js   # Global error handler
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── no-auth-routes.js  # Public routes
│   │   └── req-auth-routes.js # Protected routes
│   └── package.json
│
├── FrontEnd/
│   ├── src/
│   │   ├── App.jsx            # Main app with routing
│   │   ├── context.jsx        # Global state (React Context)
│   │   ├── components/
│   │   │   ├── NavBar.jsx     # Navigation bar with search
│   │   │   ├── ShowNavBar.jsx # Conditional navbar display
│   │   │   ├── Card.jsx       # Game card component
│   │   │   └── Category.jsx   # Category filter component
│   │   └── pages/
│   │       ├── Home.jsx       # Landing page
│   │       ├── Products.jsx   # Game listing / search results
│   │       ├── Product.jsx    # Single game details
│   │       ├── Cart.jsx       # Shopping cart
│   │       ├── Login.jsx      # Login page
│   │       ├── Register.jsx   # Registration page
│   │       ├── Account.jsx    # User account dashboard
│   │       ├── AddProduct.jsx # Admin: add a game
│   │       └── UpdateProduct.jsx # Admin: edit a game
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── screenshots/               # App screenshots
```

---

## 🔌 API Endpoints

### Public
| Method | Route                      | Description          |
|--------|----------------------------|----------------------|
| GET    | `/api/v1/products`         | Get all games        |
| GET    | `/api/v1/products/:id`     | Get a single game    |

### Authentication
| Method | Route                      | Description          |
|--------|----------------------------|----------------------|
| POST   | `/api/v1/auth/register`    | Register a new user  |
| POST   | `/api/v1/auth/login`       | Login                |

### Protected (requires JWT)
| Method | Route                              | Description                |
|--------|------------------------------------|----------------------------|
| POST   | `/api/v1/user/admin`               | Add a new game (with images) |
| DELETE | `/api/v1/user/admin/:id`           | Delete a game              |
| PATCH  | `/api/v1/user/admin/:id`           | Update a game              |
| PATCH  | `/api/v1/user/admin/modifyAccess/:id` | Modify admin access     |
| POST   | `/api/v1/user/admin/category`      | Add a category             |
| POST   | `/api/v1/user/cart/:id`            | Add game to cart           |
| PATCH  | `/api/v1/user/cart/:id`            | Remove game from cart      |
| GET    | `/api/v1/user/cart`                | Get cart items             |
| POST   | `/api/v1/user/review/:id`          | Add a review               |
| GET    | `/api/v1/user/order`               | Get orders                 |
| POST   | `/api/v1/user/order`               | Place an order             |
| PATCH  | `/api/v1/user/order`               | Update order status        |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+)
- **Microsoft SQL Server** (with a database named `steam`)
- **npm**

### 1. Clone the Repository
```bash
git clone https://github.com/C1earVision/Game-Store.git
cd Game-Store
```

### 2. Setup the Backend
```bash
cd BackEnd
npm install
```

Create a `.env` file in the `BackEnd/` directory:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

Update `db/dbconfig.js` with your SQL Server credentials.

```bash
npm start
```

### 3. Setup the Frontend
```bash
cd FrontEnd
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

