# MediMitra - Project Structure Documentation

## 📁 Organized Directory Structure

The project has been reorganized for better maintainability and scalability. Below is the complete structure:

```
frontend/src/
│
├── api/
│   └── api.js                      # API configuration and endpoints
│
├── components/
│   ├── index.js                    # Centralized component exports
│   ├── Navbar.jsx                  # Navigation bar component
│   ├── PrivateRoute.jsx            # Protected route wrapper
│   └── MedicineCard.jsx            # Medicine display card
│
├── context/
│   ├── index.js                    # Centralized context exports
│   └── AuthContext.jsx             # Authentication context & provider
│
├── pages/
│   │
│   ├── auth/                       # 🔐 Authentication Pages
│   │   ├── index.js                # Auth pages exports
│   │   ├── LoginSelection.jsx      # Main login portal (landing)
│   │   ├── LoginAdmin.jsx          # Admin login page
│   │   ├── LoginStore.jsx          # Store login page
│   │   ├── LoginUser.jsx           # Customer login page
│   │   └── Register.jsx            # Customer registration
│   │
│   ├── user/                       # 👤 Customer/User Pages
│   │   ├── index.js                # User pages exports
│   │   ├── HomeNew.jsx             # Promotional landing page
│   │   ├── MedicinesNew.jsx        # Browse medicines catalog
│   │   ├── CartNew.jsx             # Shopping cart
│   │   ├── Checkout.jsx            # Checkout & payment
│   │   └── OrdersNew.jsx           # Order history & tracking
│   │
│   ├── admin/                      # 👨‍💼 Admin Pages
│   │   ├── index.js                # Admin pages exports
│   │   └── AdminDashboard.jsx      # Admin management dashboard
│   │
│   ├── store/                      # 🏪 Store Pages
│   │   ├── index.js                # Store pages exports
│   │   └── StoreDashboard.jsx      # Store management dashboard
│   │
│   └── common/                     # 🌐 Common Pages (All Users)
│       ├── index.js                # Common pages exports
│       ├── Feedback.jsx            # Feedback & order confirmation
│       └── StoreLocator.jsx        # Find nearby pharmacies
│
├── App.jsx                         # Main application with routing
├── main.jsx                        # Application entry point
└── index.css                       # Global styles

```

---

## 🎯 Page Organization by Category

### 🔐 Authentication Pages (`/pages/auth/`)
**Purpose:** User authentication and authorization

- **LoginSelection.jsx** - Main portal with 3 login options (User/Store/Admin)
- **LoginUser.jsx** - Customer login with registration link
- **LoginStore.jsx** - Store owner login (no registration)
- **LoginAdmin.jsx** - Admin login (no registration)
- **Register.jsx** - Customer registration form

**Access:** Public (unauthenticated users)

---

### 👤 User Pages (`/pages/user/`)
**Purpose:** Customer shopping experience

- **HomeNew.jsx** - Promotional landing page with benefits
- **MedicinesNew.jsx** - Browse and search medicine catalog
- **CartNew.jsx** - View and manage shopping cart
- **Checkout.jsx** - Address selection and payment
- **OrdersNew.jsx** - Order history and tracking

**Access:** Customers only (after login)

---

### 👨‍💼 Admin Pages (`/pages/admin/`)
**Purpose:** Platform administration

- **AdminDashboard.jsx** - Complete platform management
  - Add/remove medicines and cosmetics
  - Manage stores and locations
  - View analytics and insights
  - Monitor total sales

**Access:** Admin only (highest privilege)

---

### 🏪 Store Pages (`/pages/store/`)
**Purpose:** Pharmacy management

- **StoreDashboard.jsx** - Store operations management
  - Inventory management
  - Customer database
  - Sales data and analytics
  - Stock updates

**Access:** Store owners only

---

### 🌐 Common Pages (`/pages/common/`)
**Purpose:** Accessible by all authenticated users

- **Feedback.jsx** - Feedback form and order confirmation
- **StoreLocator.jsx** - Find nearby pharmacies on map

**Access:** All authenticated users

---

## 📦 Import Structure

### Centralized Exports
Each directory has an `index.js` file for cleaner imports:

```javascript
// Before (old structure)
import LoginUser from './pages/LoginUser';
import Medicines from './pages/MedicinesNew';
import AdminDashboard from './pages/AdminDashboard';

// After (new structure)
import { LoginUser, Register } from './pages/auth';
import { Medicines, Cart, Orders } from './pages/user';
import { AdminDashboard } from './pages/admin';
```

### App.jsx Import Example
```javascript
import { AuthProvider, useAuth } from './context';
import { Navbar, PrivateRoute } from './components';
import { LoginSelection, LoginUser, Register } from './pages/auth';
import { Home, Medicines, Cart, Checkout, Orders } from './pages/user';
import { Feedback, StoreLocator } from './pages/common';
import { AdminDashboard } from './pages/admin';
import { StoreDashboard } from './pages/store';
```

---

## 🚀 Benefits of New Structure

### 1. **Better Organization**
- Related pages grouped together
- Easy to locate specific functionality
- Clear separation of concerns

### 2. **Scalability**
- Easy to add new pages to appropriate categories
- Simple to create new categories as needed
- Organized growth without clutter

### 3. **Maintainability**
- Quick to find and update related pages
- Reduced import path complexity
- Centralized exports make refactoring easier

### 4. **Developer Experience**
- Cleaner, shorter import statements
- Intuitive file locations
- Better IDE autocomplete support

### 5. **Role-Based Access**
- Clear separation between user types
- Easy to apply role-specific logic
- Security boundaries are obvious

---

## 🔄 Migration Guide

### Old vs New Paths

| Old Path | New Path |
|----------|----------|
| `pages/LoginSelection.jsx` | `pages/auth/LoginSelection.jsx` |
| `pages/LoginUser.jsx` | `pages/auth/LoginUser.jsx` |
| `pages/Register.jsx` | `pages/auth/Register.jsx` |
| `pages/HomeNew.jsx` | `pages/user/HomeNew.jsx` |
| `pages/MedicinesNew.jsx` | `pages/user/MedicinesNew.jsx` |
| `pages/CartNew.jsx` | `pages/user/CartNew.jsx` |
| `pages/Checkout.jsx` | `pages/user/Checkout.jsx` |
| `pages/OrdersNew.jsx` | `pages/user/OrdersNew.jsx` |
| `pages/AdminDashboard.jsx` | `pages/admin/AdminDashboard.jsx` |
| `pages/StoreDashboard.jsx` | `pages/store/StoreDashboard.jsx` |
| `pages/Feedback.jsx` | `pages/common/Feedback.jsx` |
| `pages/StoreLocator.jsx` | `pages/common/StoreLocator.jsx` |

---

## 🎨 Future Enhancements

### Potential New Categories

**`/pages/shared/`** - Reusable page templates
**`/pages/errors/`** - Error pages (404, 500, etc.)
**`/pages/settings/`** - User/Store/Admin settings
**`/pages/reports/`** - Analytics and reporting
**`/pages/notifications/`** - Notification center

### Component Organization
Similarly, components can be organized:
```
components/
├── common/         # Buttons, Inputs, Cards
├── layout/         # Header, Footer, Sidebar
├── forms/          # Form components
└── navigation/     # Navigation components
```

---

## ✅ Checklist for Adding New Pages

1. **Identify the category** (auth, user, admin, store, common)
2. **Create the component** in appropriate directory
3. **Export from index.js** in that directory
4. **Import in App.jsx** using centralized exports
5. **Add route** in App.jsx
6. **Update documentation** if needed

---

**Last Updated:** December 23, 2025  
**Version:** 2.0 - Organized Structure  
**Status:** ✅ Production Ready
