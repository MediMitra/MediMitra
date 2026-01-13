# 🏥 MediMitra Frontend

> A beautiful, modern, and fully functional medical platform UI with mock authentication

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` and start exploring!

## 🔐 Login Credentials

Click the **Quick Login** buttons on the login page, or use:

### 👨‍💼 Admin
- **Email:** `admin@medimitra.com`
- **Password:** `admin123`
- **Access:** Full platform management

### 🏪 Store  
- **Email:** `store@medimitra.com`
- **Password:** `store123`
- **Access:** Inventory & customer management

### 👤 User
- **Email:** `user@medimitra.com`
- **Password:** `user123`
- **Access:** Shopping & feedback

## 📱 Features

### All Roles
- ✨ Beautiful medicine-themed UI (green, blue, orange)
- 🔍 Browse medicines with search and filters
- 📱 Fully responsive design
- 🎨 Smooth animations and transitions

### Admin Dashboard
- 💊 Add, view, and delete medicines
- 🏪 Manage pharmacy stores
- 📊 View platform statistics
- ⚠️ Monitor stock levels

### Store Dashboard
- 📦 Manage medicine inventory
- 👥 View customer database
- 🛍️ Process and track orders
- 📈 Update stock quantities

### User Features
- 🔍 Search medicines by name/category
- 🛒 Shopping cart with live updates
- 📦 Order history and tracking
- 💬 Submit feedback with ratings

## 🎨 Color Theme

- **🟢 Green (Primary)**: Medicines, health, success
- **🔵 Blue (Secondary)**: Stores, trust, information
- **🟠 Orange (Accent)**: Actions, alerts, energy

## 📂 Documentation

- **[CREDENTIALS.md](./CREDENTIALS.md)** - Quick reference for mock logins
- **[FEATURES.md](./FEATURES.md)** - Complete feature list
- **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** - Comprehensive guide
- **[COLOR_GUIDE.md](./COLOR_GUIDE.md)** - Color palette details

## 🛠️ Tech Stack

- React 18.2
- React Router 6.21
- Tailwind CSS 3.4
- Vite 5.0

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/     # Navbar, cards, routes
│   ├── context/        # Auth with mock credentials
│   ├── pages/          # All main pages
│   ├── App.jsx         # Routing
│   └── index.css       # Custom styles
├── CREDENTIALS.md      # Login info
├── FEATURES.md         # Feature summary
├── FRONTEND_GUIDE.md   # Full guide
└── COLOR_GUIDE.md      # Design system
```

## 🎯 Pages

- `/` - Landing page with portals
- `/login` - Login with quick access
- `/admin` - Admin dashboard
- `/store` - Store dashboard  
- `/medicines` - Browse medicines
- `/cart` - Shopping cart
- `/orders` - Order history
- `/feedback` - Submit feedback

## ✨ Highlights

- **No backend required** - Fully functional with mock data
- **Beautiful gradients** - Medicine-themed colors
- **Quick demo access** - One-click login for all roles
- **Production ready** - Clean code, proper structure
- **Mobile responsive** - Works on all devices

## 🔄 Backend Integration

When ready to connect backend:
1. Update `AuthContext.jsx` with real API calls
2. Replace mock data with API endpoints
3. Add authentication tokens
4. Enable real cart/order functionality

All integration points are marked and ready!

## 📝 Notes

- All data is in component state (resets on refresh)
- Mock credentials are in `AuthContext.jsx`
- Backend API calls are commented out
- Ready for production deployment

---

**Enjoy exploring MediMitra! 💊✨**

For questions or issues, check the documentation files above.
